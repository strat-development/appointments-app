"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import { DateSelectArg, EventClickArg } from "@fullcalendar/core"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import { Calendar } from "iconsax-react"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { handleEvents, renderEventContent } from "@/actions/schedule/EventHandlets"
import { NewVisitModal } from "./NewVisitModal"
import { EditVisitModal } from "./EditVisitModal"
import { VisitsData } from "@/types/types"

export const Schedule = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<VisitsData[]>([])
    const queryClient = useQueryClient();
    const { userName, userId } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventId, setEventId] = useState<string>("")
    const [newVisits, setNewVisits] = useState<VisitsData | null>(null);

    const { data: hoursData, isLoading, isError } = useQuery(
        ['visits', userId],
        async () => {
            const { data, error, status } = await supabase
                .from("visits")
                .select("*")
                .eq("employee", userId);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data);

                queryClient.invalidateQueries(['visits', userId]);
            }
        },
    );

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    };


    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        setIsModalOpen(true);
    
        const newVisits = {
            start_time: selectInfo.startStr,
            end_time: selectInfo.endStr,
        };
    
        setNewVisits(newVisits as VisitsData);
    };
    
    const handleEventClick = (clickInfo: EventClickArg) => {
        setIsEditModalOpen(true);
    
        const event = clickInfo.event;
    
        const newVisits = {
            start_time: clickInfo.event.startStr,
            end_time: clickInfo.event.endStr,
        };
    
        setNewVisits(newVisits as VisitsData);
        setEventId(event.id);
    };


    return (
        <>
            <div className="min-[1024px]:hidden relative h-screen flex flex-col items-center justify-center text-violet-600">
                <Calendar className="absolute z-0 opacity-10" size={164} />
                <h1 className="z-[23423423] text-3xl text-center font-bold text-[#404040] w-[85%]">For better user experience switch to PC</h1>
            </div>

            <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8 max-[1024px]:hidden">
                    <div className="flex flex-col gap-4">
                        {userName && (
                            <div className="flex flex-col justify-end">
                                <h1 className="text-3xl font-bold truncate min-[768px]:text-4xl">
                                    Hello, <span className="bg-clip-text text-transparent bg-gradient-to-b from-violet-600 to-violet-500">{userName}</span>
                                </h1>

                                {isData.length > 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">Here is your schedule!</p>
                                )}

                                {isData.length === 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No visits yet</p>
                                )}
                            </div>
                        )}
                    </div>

                    <FullCalendar
                        height={650}
                        plugins={[
                            resourceTimelinePlugin,
                            dayGridPlugin,
                            interactionPlugin,
                            timeGridPlugin,
                        ]}
                        headerToolbar={{
                            right: 'today prev,next',
                            center: 'title',
                            left: 'timeGridDay,timeGridWeek,dayGridMonth',
                        }}
                        initialView="timeGridWeek"
                        navLinks={true}
                        forceEventDuration={true}
                        defaultAllDayEventDuration={{ hour: 8 }}
                        businessHours={
                            {
                                daysOfWeek: [1, 2, 3, 4, 5],
                                startTime: '08:00',
                                endTime: '16:00',
                            }
                        }
                        eventContent={renderEventContent}
                        nowIndicator={false}
                        allDaySlot={false}
                        editable={true}
                        selectable={true}
                        eventDurationEditable={false}
                        droppable={false}
                        selectMirror={true}
                        dayMaxEventRows={3}
                        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                        dayMaxEvents={1}
                        events={
                            isData.map((event) => {
                                return {
                                    id: event.visit_id.toString(),
                                    title: event.client_name || "",
                                    start: event.start_time?.toString(),
                                    end: event.end_time?.toString(),
                                }
                            })
                        }
                        select={handleDateSelect}
                        eventsSet={handleEvents}
                        eventClick={handleEventClick}
                        eventMaxStack={1}
                        locale={"en"}
                        buttonText={
                            {
                                today: "Today",
                                month: "Month",
                                week: "Week",
                                day: "Day",
                            }
                        }
                        slotDuration={"01:00:00"}
                        eventBackgroundColor="rgba(221,209,254)"
                        eventDisplay={"list-item"}
                        slotEventOverlap={false}
                        eventBorderColor="transparent"
                    />
                </div>
            </div>
            <NewVisitModal isOpen={isModalOpen}
                onClose={closeModal}
                startTime={newVisits?.start_time}
                endTime={newVisits?.end_time}
            />
            <EditVisitModal isOpen={isEditModalOpen}
                onClose={closeModal}
                startTime={newVisits?.start_time}
                endTime={newVisits?.end_time}
                visitId={eventId}
            />
        </>
    )
}
