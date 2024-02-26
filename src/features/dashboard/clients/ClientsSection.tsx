"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { Edit } from "iconsax-react"
import { AddClientModal } from "./AddClientModal"
import { EditClientModal } from "./EditClientModal"
import { useBusinessContext } from "@/providers/businessContextProvider"

type Clients = Database["public"]["Tables"]["clients"]["Row"]

export const ClientsSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<Clients[]>([])
    const queryClient = useQueryClient();
    const { userName } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [clientName, setClientName] = useState<string>("");
    const [clientId, setClientId] = useState<number>(0);
    const filteredData = isData.filter(item => item.full_name && item.full_name.includes(searchPrompt));
    const { businessName } = useBusinessContext();

    useQuery(
        ['clients', businessName],
        async () => {
            const { data, error, status } = await supabase
                .from("clients")
                .select("*")
                .eq("business_name", businessName)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data)
                queryClient.invalidateQueries(['clients', clientId]);
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
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">Here are your clients!</p>
                                )}

                                {isData.length === 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No clients added</p>
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
                                        Add client
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 w-fit min-[768px]:grid-cols-2 gap-4 min-[1024px]:grid-cols-4 grid-template-rows-1fr-1fr-1fr">
                        {filteredData.map((client) => (
                            <div className="peer group cursor-pointer flex flex-col justify-center items-start p-4 w-full bg-white rounded-lg border-[1px] hover:border-violet-300 transition shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] gap-4"
                                key={client.id}
                                onClick={() => {
                                    setIsEditModalOpen(true)
                                    setClientName(client.full_name || "")
                                    setClientId(client.id)
                                }
                                }>
                                <div className="flex justify-between w-full gap-4">
                                    <div className="flex flex-col">
                                        <p className="text-black/70 text-base font-semibold">
                                            {client.full_name}
                                        </p>
                                        <p className="text-black/70 text-base">{client.phone_number}</p>
                                        <p className="text-black/70 text-base">{client.description}</p>
                                    </div>
                                    <Edit className="group-hover:opacity-100 opacity-0 duration-300 w-6 h-6 text-violet-500" />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <AddClientModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
            <EditClientModal
                clientName={clientName}
                clientId={clientId}
                isOpen={isEditModalOpen}
                onClose={closeModal}
            />
        </>
    )
}
