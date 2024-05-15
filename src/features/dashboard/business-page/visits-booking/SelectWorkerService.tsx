import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, ServicesData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";
import { BookVisitButton } from "./BookVisitButton";
import { set } from "date-fns";

interface SelectWorkerServiceProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
    selectedService?: ServicesData[];
}

export const SelectWorkerService = ({ businessSlugId, startTime, endTime, selectedService }: SelectWorkerServiceProps) => {
    const supabase = createClientComponentClient<Database>();
    const [selectedWorker, setSelectedWorker] = useState<string>("");
    const [selectedWorkerName, setSelectedWorkerName] = useState<string>("");

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
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col w-full border-t-[1px] gap-4 p-4">
                {selectedService?.map(service => {
                    return (
                        <div key={service.service_id} className="flex justify-between">
                            <p className="text-lg">{service.title}</p>
                            <div className="flex flex-col gap-2 text-right">
                                <p className="text-lg font-semibold">{service.price}zł</p>
                                <div>
                                    <div>
                                        {typeof startTime === 'string' ? startTime.split('T')[1] : ''}
                                        -
                                        {typeof endTime === 'string' ? endTime.split('T')[1] : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="flex items-center justify-between pt-4 border-t-[1px]">
                    <div>
                        <div className="text-black/70 flex gap-2 items-baseline">Selected worker:
                            <p className="text-lg text-black">{!selectedWorker
                                ? "Any"
                                : workersData?.find(employee => employee.employee_id === selectedWorker)?.full_name
                            }
                            </p>
                        </div>
                    </div>
                    <select className="p-2 border-[1px] rounded-full w-fit outline-none"
                        onChange={(e) => {
                            setSelectedWorker(e.target.value)
                        }
                        }
                        name="" id="">
                        <option value="">Any</option>
                        {workersData?.map(employee => (
                            <option key={employee.employee_id}
                                value={employee.employee_id}>{employee.full_name}</option>
                        ))}
                    </select>
                </div>
            </div>

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