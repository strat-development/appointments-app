"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { Edit } from "iconsax-react"
import { AddServiceModal } from "./AddServiceModal"
import { EditServiceModal } from "./EditServiceModal"

type Services = Database["public"]["Tables"]["services"]["Row"]

export const ServicesSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<Services[]>([])
    const queryClient = useQueryClient();
    const { userName } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [serviceName, seServiceName] = useState<string>("");
    const [serviceId, setServiceId] = useState<number>(0);
    const [servicePrice, setServicePrice] = useState<string>("");
    const [serviceDuration, setServiceDuration] = useState<string>("");
    const filteredData = isData.filter(item => item.title && item.title.includes(searchPrompt));
    const businessName = "Visio";

    useQuery(
        ['services', businessName],
        async () => {
            const { data, error, status } = await supabase
                .from("services")
                .select("*")
                .eq("business_name", businessName)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data)
                queryClient.invalidateQueries(['services', serviceId]);
            }
        },
    );

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    };

    return (
        <>
            <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8 max-[1024px]:hidden">
                    <div className="flex flex-col gap-4">
                        {userName && (
                            <div className="flex flex-col justify-end">
                                <h1 className="text-3xl font-bold truncate min-[768px]:text-4xl">
                                    Hello, <span className="bg-clip-text text-transparent bg-gradient-to-b from-violet-600 to-violet-500">{userName}</span>
                                </h1>

                                {isData.length > 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">Here is availiable services!</p>
                                )}

                                {isData.length === 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No service added</p>
                                )}
                                <div className="flex justify-between">
                                    <input
                                        className="px-4 py-2 outline-none border transition focus:border-violet-300 border-gray-300 rounded-full w-full min-[768px]:w-64"
                                        type="text"
                                        placeholder="Search"
                                        value={searchPrompt}
                                        onChange={(e) => setSearchPrompt(e.target.value)}
                                    />
                                    <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full min-[768px]:w-32"
                                        onClick={() => setIsModalOpen(true)}>
                                        Add service
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 w-fit min-[768px]:grid-cols-2 gap-4 min-[1024px]:grid-cols-4 grid-template-rows-1fr-1fr-1fr">
                        {filteredData.map((service) => (
                            <div className="peer group cursor-pointer flex flex-col justify-center items-start p-4 w-full bg-white rounded-lg border-[1px] hover:border-violet-300 transition shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] gap-4"
                                key={service.id}
                                onClick={() => {
                                    setIsEditModalOpen(true)
                                    seServiceName(service.title)
                                    setServiceId(service.id)
                                    setServicePrice(service.price)
                                    setServiceDuration(service.duration)
                                }
                                }>
                                <div className="flex justify-between w-full gap-4">
                                    <div className="flex flex-col">
                                        <p className="text-black/70 text-base font-semibold">
                                            {service.title}
                                        </p>
                                        <p className="text-black/70 text-base">{service.duration}</p>
                                        <p className="text-black/70 text-base">{service.price}</p>
                                    </div>
                                    <Edit className="group-hover:opacity-100 opacity-0 duration-300 w-6 h-6 text-violet-500" />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <AddServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
            <EditServiceModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                serviceName={serviceName}
                serviceId={serviceId}
                servicePrice={servicePrice}
                serviceDuration={serviceDuration}
            />
        </>
    )
}
