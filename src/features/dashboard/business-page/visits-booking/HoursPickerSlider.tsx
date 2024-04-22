import { BusinessSlugIdProps, OpeningHoursData, VisitsData } from "@/types/types";
import { useState } from "react";
import { SelectWorkerService } from "./SelectWorkerService";
import { useQuery } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { format, isValid } from 'date-fns';

interface HoursPickerSliderProps {
    visits: VisitsData[];
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    selectedDate: string | null;
}

export const HoursPickerSlider = ({ visits, businessSlugId, selectedDate }: HoursPickerSliderProps) => {
    const [selectedStartTime, setSelectedStartTime] = useState<string>("");
    const [selectedEndTime, setSelectedEndTime] = useState<string>("");
    const supabase = createClientComponentClient<Database>();

    const { data: openingHours, isLoading } = useQuery<OpeningHoursData>(
        ['opening-hours'],
        async () => {
            const { data, error } = await supabase
                .from('business-opening-hours')
                .select('*')
                .eq('business_id', businessSlugId || "")
            if (error) {
                throw error;
            }
            return data?.[0];
        }
    )

    if (isLoading || !openingHours) {
        return <div>Loading...</div>;
    }

    const parsedOpeningHours = JSON.parse(openingHours.opening_hours as string);

    const generateTimeSlots = (start: string, end: string) => {
        const result = [];
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        const startMinutes = parseInt(start.split(':')[1]);
        const endMinutes = parseInt(end.split(':')[1]);

        for (let i = startHour; i <= endHour; i++) {
            for (let j = 0; j < 60; j += 30) {
                if (i === startHour && j < startMinutes) continue;
                if (i === endHour && j > endMinutes) break;
                const hourPart = i.toString().padStart(2, '0');
                const minutePart = j.toString().padStart(2, '0');
                result.push(hourPart + ':' + minutePart);
            }
        }

        return result;
    }

    const selectedDateObj = new Date(selectedDate || "");
    if (!isValid(selectedDateObj)) {
        return <div>Select a date...</div>;
    }

    const dayOfWeek = format(selectedDateObj, 'EEEE');
    const hoursForDay = parsedOpeningHours[dayOfWeek];

    const timeSlots = generateTimeSlots(hoursForDay.start, hoursForDay.end);
    const bookedTimes = visits.map(visit => {
        const visitDate = new Date(visit.start_time ?? "");
        return isValid(visitDate) ? format(visitDate, 'HH:mm') : null;
    }).filter(Boolean);

    const availableTimeSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));

    const handleTimeSlotClick = (slot: string, index: number) => {
        const startTime = new Date(`${selectedDate}T${slot}:00Z`).toISOString();
        const endTime = new Date(`${selectedDate}T${availableTimeSlots[index + 1]}:00Z`).toISOString();

        setSelectedStartTime(startTime);
        setSelectedEndTime(endTime);

        console.log("Selected start time: ", startTime);
        console.log("Selected end time: ", endTime);
    };

    return (
        <>
            <div className="flex gap-4 overflow-x-scroll w-[600px]">
                {availableTimeSlots.map((slot, index) => (
                    <button key={slot} onClick={() => {
                        handleTimeSlotClick(slot, index)
                    }}>
                        {slot}
                    </button>
                ))}
            </div>
            <SelectWorkerService
                businessSlugId={businessSlugId}
                startTime={selectedStartTime}
                endTime={selectedEndTime}
            />
        </>
    )
}