"use client"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import { DateSelectArg, EventClickArg } from "@fullcalendar/core"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import { Calendar } from "iconsax-react"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { handleEvents, renderEventContent } from "@/actions/schedule/EventHandlers"
import { NewVisitModal } from "./NewVisitModal"
import { EditVisitModal } from "./EditVisitModal"
import { VisitsData } from "@/types/types"
import { useBusinessContext } from "@/providers/businessContextProvider"

export const Schedule = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<VisitsData[]>([])
    const queryClient = useQueryClient();
    const { userId, userRole } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventId, setEventId] = useState<string>("")
    const [newVisits, setNewVisits] = useState<VisitsData | null>(null);
    const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const { businessId } = useBusinessContext();


    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);


        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getQueryKeyAndFn = () => {
        if (userRole === 'Employee') {
            return {
                queryKey: ['visits', userId],
                queryFn: async () => {
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

                    return data;
                }
            };
        } else if (userRole === 'Employer') {
            return {
                queryKey: ['visits', businessId],
                queryFn: async () => {
                    const { data, error, status } = await supabase
                        .from("visits")
                        .select("*")
                        .eq("business_id", businessId || "");

                    if (error && status !== 406) {
                        throw error;
                    }

                    if (data) {
                        setIsData(data);

                        queryClient.invalidateQueries(['visits', businessId]);
                    }

                    return data;
                }
            };
        }

        return { queryKey: null, queryFn: () => { } };
    };

    const { queryKey, queryFn } = getQueryKeyAndFn();

    const { data: hoursData, isLoading, isError } = useQuery(queryKey || [], queryFn as () => Promise<any[] | null>, {
        enabled: !!queryKey
    });

    useEffect(() => {
        if (hoursData) {
            if (queryKey) {
              queryClient.invalidateQueries(queryKey);
            }
        }
    }, [hoursData, queryKey, queryClient]);

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
            <div className="w-full h-[80vh] overflow-y-auto flex flex-col gap-8 max-[768px]:overflow-y-scroll">
                <div className="flex items-start justify-start self-start w-full border-b-[1px] pb-4 gap-2">
                    <Calendar className="w-6 h-6 text-violet-500" />
                    <p className="text-lg font-medium">Schedule</p>
                </div>
                <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
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
                            left: `${screenWidth < 768 ? "timeGridDay" : "timeGridDay,timeGridWeek,dayGridMonth"}`,
                        }}
                        initialView="timeGridDay"
                        navLinks={true}
                        forceEventDuration={true}
                        defaultAllDayEventDuration={{ hour: 8 }}
                        businessHours={
                            {
                                daysOfWeek: [1, 2, 3, 4, 5],
                                startTime: '00:00',
                                endTime: '24:00',
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
                        slotDuration={"00:30:00"}
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
