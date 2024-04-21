import { Database } from "@/types/supabase";
import { BusinessSlugIdProps } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";
import { BookVisitButton } from "./BookVisitButton";

interface SelectWorkerServiceProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
}

export const SelectWorkerService = ({ businessSlugId, startTime, endTime }: SelectWorkerServiceProps) => {
    const supabase = createClientComponentClient<Database>();
    const [selectedWorker, setSelectedWorker] = useState<string>("");
    const [selectedService, setSelectedService] = useState<string>("");

    const { data: workersData, isLoading, isError } = useQuery(
        ['employees', businessSlugId],
        async () => {
            const { data, error, status } = await supabase
                .from("employees")
                .select("*")
                .eq("business_id", businessSlugId || "");

            if (error && status !== 406) {
                throw error;
            }

            return data;
        },
    );


    const { data: servicesData, isLoading: servicesIsLoading } = useQuery(
        ['services', businessSlugId],
        async () => {
            const { data, error, status } = await supabase
                .from("services")
                .select("*")
                .eq("business_id", businessSlugId || "");

            if (error && status !== 406) {
                throw error;
            }

            return data;
        },
    );

    return (
        <div className="flex flex-col gap-8">
            <select onChange={(e) => setSelectedWorker(e.target.value)}
                name="" id="">
                {workersData?.map(employee => (
                    <option key={employee.employee_id}
                        value={employee.employee_id}>{employee.full_name}</option>
                ))}
            </select>
            <select onChange={(e) => setSelectedService(e.target.value)}
                name="" id="">
                {servicesData?.map(service => (
                    <option key={service.service_id} value={service.service_id}>{service.title}</option>
                ))}
            </select>

            <div>
                <BookVisitButton businessSlugId={businessSlugId}
                    selectedService={Number(selectedService)}
                    selectedWorker={selectedWorker}
                    startTime={startTime}
                    endTime={endTime}
                />
            </div>
        </div>
    )
}