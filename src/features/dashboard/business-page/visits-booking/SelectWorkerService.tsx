import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, ServicesData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";
import { BookVisitButton } from "./BookVisitButton";

interface SelectWorkerServiceProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
    selectedService?: ServicesData[];
}

export const SelectWorkerService = ({ businessSlugId, startTime, endTime, selectedService }: SelectWorkerServiceProps) => {
    const supabase = createClientComponentClient<Database>();
    const [selectedWorker, setSelectedWorker] = useState<string>("Any");
    const [clientPhoneNumber, setClientPhoneNumber] = useState<string>("");
    const [clientName, setClientName] = useState<string>("");

    console.log(selectedService);

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


    console.log(workersData);

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
        <div className="flex flex-col gap-8 w-full max-[480px]:gap-4">
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
                    <div className="text-black/70 flex gap-2 items-baseline">Selected worker:
                        <p className="text-lg text-black">{!selectedWorker
                            ? "Any"
                            : workersData?.find(employee => employee.employee_id === selectedWorker)?.full_name
                        }
                        </p>
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
                <div className="flex gap-4 flex-wrap">
                    <input className="p-2 border-[1px] rounded-full w-fit outline-none"
                        type="text"
                        placeholder="Full name"
                        onChange={(e) => setClientName(e.target.value)} />
                    <input className="p-2 border-[1px] rounded-full w-fit outline-none"
                        type="text"
                        placeholder="Phone number"
                        onChange={(e) => setClientPhoneNumber(e.target.value)} />
                </div>
            </div>

        {/* {selectedService && startTime && endTime && clientPhoneNumber && clientName && */}
            <BookVisitButton businessSlugId={businessSlugId}
                selectedService={selectedService}
                selectedWorker={selectedWorker}
                startTime={startTime}
                endTime={endTime}
                phoneNumber={clientPhoneNumber}
                clientName={clientName}
            />
        {/* } */}
        </div>
    )
}