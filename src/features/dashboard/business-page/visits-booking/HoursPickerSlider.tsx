import { BusinessSlugIdProps, VisitsData } from "@/types/types";
import { useEffect, useState } from "react";
import { SelectWorkerService } from "./SelectWorkerService";

interface HoursPickerSliderProps {
    visits: VisitsData[];
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
}

export const HoursPickerSlider = ({ visits, businessSlugId }: HoursPickerSliderProps) => {
    const workingHours = Array.from({ length: 20 }, (_, i) => (i * 0.5) + 8);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState<string>("");
    const [selectedEndTime, setSelectedEndTime] = useState<string>("");

    const availableHours = workingHours.filter(hour => {
        const hourPart = Math.floor(hour).toString().padStart(2, '0');
        const minutePart = (hour % 1 > 0) ? '30' : '00';
        const hourString = hourPart + ':' + minutePart;
        return !visits.some(visit => {
            const startTime = visit.start_time ? new Date(visit.start_time) : null;
            const endTime = visit.end_time ? new Date(visit.end_time) : null;
            const currentHour = new Date(startTime?.toISOString().split('T')[0] + 'T' + hourString + ':00');
            return startTime !== null && currentHour >= startTime && (endTime === null || currentHour < endTime);
        });
    });

    return (
        <>
            <div className="flex gap-4 overflow-x-scroll w-[600px]">
                {availableHours.map(hour => {
                    const hourPart = Math.floor(hour).toString().padStart(2, '0');
                    const minutePart = (hour % 1 > 0) ? '30' : '00';
                    const startTimeString = hourPart + ':' + minutePart;
                    const endTimeHourPart = (hour % 1 > 0) ? (Math.floor(hour) + 1).toString().padStart(2, '0') : hourPart;
                    const endTimeMinutePart = (hour % 1 > 0) ? '00' : '30';

                    const date = selectedDate ? new Date(selectedDate) : new Date();
                    const startTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(hourPart), parseInt(minutePart));
                    const endTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(endTimeHourPart), parseInt(endTimeMinutePart));

                    const startTime = new Date(startTimeDate.getTime() - startTimeDate.getTimezoneOffset() * 60000).toISOString();
                    const endTime = new Date(endTimeDate.getTime() - endTimeDate.getTimezoneOffset() * 60000).toISOString();

                    return (
                        <div key={hour}>
                            <button onClick={() => {
                                setSelectedDate(date.toISOString().split('T')[0]);
                                setSelectedStartTime(startTime);
                                setSelectedEndTime(endTime);
                            }}
                                className="p-2 border-[1px]">
                                {startTimeString}
                            </button>
                        </div>
                    )
                })}
            </div>
            <SelectWorkerService
                businessSlugId={businessSlugId}
                startTime={selectedStartTime}
                endTime={selectedEndTime}
            />
        </>
    )
}