"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { Add, BagCross, Edit, User } from "iconsax-react"
import { AddClientModal } from "./AddClientModal"
import { EditClientModal } from "./EditClientModal"
import { useBusinessContext } from "@/providers/businessContextProvider"
import { ClientsData } from "@/types/types"
import { IoMdMail, IoMdPhonePortrait } from "react-icons/io"

export const ClientsSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<ClientsData[]>([])
    const queryClient = useQueryClient();
    const { userName } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [clientName, setClientName] = useState<string>("");
    const [clientId, setClientId] = useState<string>("");
    const [clientEmail, setClientEmail] = useState<string>("");
    const [clientPhoneNumber, setClientPhoneNumber] = useState<string>("");
    const filteredData = isData.filter(item => item.full_name && item.full_name.includes(searchPrompt));
    const { businessId } = useBusinessContext();

    useQuery(
        ['clients', businessId],
        async () => {
            const { data, error, status } = await supabase
                .from("clients")
                .select("*")
                .eq("business_id", businessId)

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
            <div className="p-4 rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                <div className="flex items-start justify-start self-start w-full border-b-[1px] pb-4 gap-2">
                    <User className="w-6 h-6 text-violet-500" />
                    <p className="text-lg font-medium">Clients</p>
                </div>
                <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        {userName && (
                            <div className="flex flex-col justify-end">
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-4">
                                        <input className="px-4 py-2 outline-none border transition focus:border-violet-300 border-gray-300 rounded-lg w-full max-[768px]:w-[250px] min-[768px]:w-64"
                                            type="text"
                                            placeholder="Search..."
                                            value={searchPrompt}
                                            onChange={(e) => setSearchPrompt(e.target.value)}
                                        />
                                        <p className="w-[250px] max-[480px]:text-xs max-[480px]:max-w-[300px] min:[1024px]:max-w-[400px] text-sm text-black/70">
                                            Adding availiable positions will help your clients to chose the exact position they’re looking for. Feel free to add one, for example: “Haircut ✂️”
                                        </p>
                                    </div>
                                    <button className="flex gap-2 px-4 py-2 rounded-full h-fit hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-fit max-[640px]:p-2"
                                        onClick={() => setIsModalOpen(true)}>
                                        <p className="max-[640px]:hidden">Add client</p>
                                        <Add className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {isData.length === 0 && (
                        <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No clients added</p>
                    )}

                    <div className="grid grid-cols-4 gap-8 max-[1460px]:grid-cols-3 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1">
                        {filteredData.map((client) => (
                            <div className="peer group gap-4 cursor-pointer flex flex-col justify-start items-start p-4 w-full bg-white rounded-lg border-[1px] hover:border-violet-300 transition shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)]"
                                key={client.client_id}
                                onClick={() => {
                                    setIsEditModalOpen(true)
                                    setClientName(client.full_name || "")
                                    setClientId(client.client_id)
                                    setClientEmail(client.email || "")
                                    setClientPhoneNumber(client.phone_number || "")
                                }
                                }>
                                <div className="flex justify-between w-full gap-4 overflow-hidden">
                                    <div className="flex flex-col gap-4">
                                        <p className="text-black/70 text-base font-semibold">
                                            {client.full_name}
                                        </p>
                                        <div className="flex gap-2">
                                            {client.label}
                                        </div>
                                        <div className="flex gap-4">
                                            <IoMdPhonePortrait className="w-6 h-6 text-violet-500" />
                                            <p className="text-black/70 text-base">{client.phone_number}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <IoMdMail className="w-6 h-6 text-violet-500" />
                                            <p className="text-black/70 text-base truncate max-w-[150px]">{client.email}</p>
                                        </div>
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
                clientEmail={clientEmail}
                clientPhoneNumber={clientPhoneNumber}
            />
        </>
    )
}
