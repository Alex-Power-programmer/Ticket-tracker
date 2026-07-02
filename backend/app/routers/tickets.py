from typing import Optional
from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.get("/", response_model=dict)
def get_tickets(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100),
        status: Optional[str] = None,
        priority: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = Query("created_at", regex="^(created_at|priority)$"),
        sort_order: str = Query("desc", regex="^(asc|desc)$"),
        db: Session = Depends(get_db)
):
    tickets, total = crud.get_tickets(
        db, skip=skip, limit=limit, status=status,
        priority=priority, search=search, sort_by=sort_by, sort_order=sort_order
    )

    items = []
    for ticket in tickets:
        items.append({
            "id": ticket.id,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "created_at": ticket.created_at,
            "updated_at": ticket.updated_at
        })

    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.post("/", response_model=schemas.Ticket)
def create_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db)
):
    return crud.create_ticket(db, ticket)


@router.put("/{ticket_id}", response_model=schemas.Ticket)
def update_ticket(
    ticket_id: int,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    try:
        result = crud.update_ticket(db, ticket_id, ticket_update)
        if not result:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{ticket_id}/status", response_model=schemas.Ticket)
def update_ticket_status(
    ticket_id: int,
    status_update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    try:
        result = crud.update_ticket_status(db, ticket_id, status_update.status)
        if not result:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    admin: bool = Depends(auth.verify_admin),
    db: Session = Depends(get_db)
):
    try:
        result = crud.delete_ticket(db, ticket_id)
        if not result:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return {"message": "Ticket deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))