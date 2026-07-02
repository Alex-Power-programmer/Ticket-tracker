from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas
from datetime import datetime


def get_ticket(db: Session, ticket_id: int):
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()


def get_tickets(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    status: str = None,
    priority: str = None,
    search: str = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    query = db.query(models.Ticket)

    # Фильтрация
    if status:
        query = query.filter(models.Ticket.status == status)
    if priority:
        query = query.filter(models.Ticket.priority == priority)
    if search:
        query = query.filter(
            or_(
                models.Ticket.title.contains(search),
                models.Ticket.description.contains(search)
            )
        )

    # Сортировка
    if sort_by == "priority":
        if sort_order == "desc":
            query = query.order_by(models.Ticket.priority_order.desc())
        else:
            query = query.order_by(models.Ticket.priority_order.asc())
    else:
        if sort_order == "desc":
            query = query.order_by(getattr(models.Ticket, sort_by).desc())
        else:
            query = query.order_by(getattr(models.Ticket, sort_by).asc())

    total = query.count()
    tickets = query.offset(skip).limit(limit).all()

    return tickets, total


def create_ticket(db: Session, ticket: schemas.TicketCreate):
    # Определяем числовой порядок для приоритета
    priority_order_map = {
        "low": 1,
        "normal": 2,
        "high": 3
    }

    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        status=ticket.status.value.lower(),
        priority=ticket.priority.value.lower(),
        priority_order=priority_order_map[ticket.priority.value.lower()]
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def update_ticket(db: Session, ticket_id: int, ticket_update: schemas.TicketUpdate):
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None

    if db_ticket.status == "done":
        raise ValueError('Cannot update ticket with status DONE')

    update_data = ticket_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ticket, key, value)

    db_ticket.updated_at = datetime.now()
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def update_ticket_status(db: Session, ticket_id: int, new_status: str):
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None

    if db_ticket.status == "done":
        raise ValueError('Cannot change status of DONE ticket')

    db_ticket.status = new_status
    db_ticket.updated_at = datetime.now()
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def delete_ticket(db: Session, ticket_id: int):
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None

    if db_ticket.status == "done":
        raise ValueError('Cannot delete ticket with status DONE')

    db.delete(db_ticket)
    db.commit()
    return db_ticket