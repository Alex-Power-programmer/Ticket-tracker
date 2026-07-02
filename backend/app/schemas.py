from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class TicketStatus(str, Enum):
    NEW = 'new'
    IN_PROGRESS = 'in_progress'
    DONE = 'done'


class TicketPriority(str, Enum):
    LOW = 'low'
    NORMAL = 'normal'
    HIGH = 'high'


class TicketBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    status: TicketStatus = TicketStatus.NEW
    priority: TicketPriority = TicketPriority.NORMAL


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=120)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None


class Ticket(TicketBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
