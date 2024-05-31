"use client"

import { EventApi, EventContentArg } from "@fullcalendar/core"

export const handleEvents = (events: EventApi[]) => {
    ({
        currentEvents: events
    })
}

export const renderEventContent = (eventContent: EventContentArg) => {
    return (
        <div className="flex flex-col items-start p-2 text-base min-w-[20px] max-w-[200px] truncate text-[#5498DC]">
            <b className="w-32 truncate text-black/70 uppercase">{eventContent.event.title}</b>
            <p className="text-black/50">{eventContent.event.startStr.split('T')[1].slice(0, -6)}</p>
            <p className="text-black/50">{eventContent.event.endStr.split('T')[1].slice(0, -6)}</p>
        </div>
    )
}