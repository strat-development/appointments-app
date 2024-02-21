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

type Hours = Database["public"]["Tables"]["hours"]["Row"]

export const Schedule = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<Hours[]>([])
    const queryClient = useQueryClient();
    const { userName, userId } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventId, setEventId] = useState<string>("")
    const [newHours, setNewHours] = useState<Hours | null>(null);

    const { data: hoursData, isLoading, isError } = useQuery(
        ['hours', userId],
        async () => {
            const { data, error, status } = await supabase
                .from("hours")
                .select("*")
                .eq("userId", userId);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data);
                queryClient.invalidateQueries(['hours', userId]);
            }
        },
    );

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    };


    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        setIsModalOpen(true);

        const newHours = {
            startTime: selectInfo.startStr,
            endTime: selectInfo.endStr,
        };

        setNewHours(newHours as Hours);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        setIsEditModalOpen(true);

        const event = clickInfo.event;

        console.log(event.id);

        const newHours = {
            startTime: clickInfo.event.startStr,
            endTime: clickInfo.event.endStr,
        };

        setNewHours(newHours as Hours);

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
                                    id: event.id.toString(),
                                    title: event.title || "",
                                    start: event.startTime?.toString(),
                                    end: event.endTime?.toString(),
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
                startTime={newHours?.startTime}
                endTime={newHours?.endTime}
            />
            <EditVisitModal isOpen={isEditModalOpen}
                onClose={closeModal}
                startTime={newHours?.startTime}
                endTime={newHours?.endTime}
                hourId={eventId}
            />
        </>
    )
}
