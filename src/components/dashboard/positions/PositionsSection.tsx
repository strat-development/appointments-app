"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { AddPositionModal } from "./AddPositionModal"
import { EditPositionModal } from "./EditPositionModal"
import { Edit } from "iconsax-react"

type Positions = Database["public"]["Tables"]["positions"]["Row"]

export const PositionsSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<Positions[]>([])
    const queryClient = useQueryClient();
    const { userName } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [positionName, setPositionName] = useState<string>("");
    const [positionId, setPositionId] = useState<number>(0);
    const filteredData = isData.filter(item => item.position_name && item.position_name.includes(searchPrompt));
    const bussines_name = "Visio";

    useQuery(
        ['positions', bussines_name],
        async () => {
            const { data, error, status } = await supabase
                .from("positions")
                .select("*")
                .eq("business_name", bussines_name)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data)
                queryClient.invalidateQueries(['positions', positionId]);
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
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">Here is availiable positions!</p>
                                )}

                                {isData.length === 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No positions added</p>
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
                                        Add position
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-4 min-[1024px]:grid-cols-4 grid-template-rows-1fr-1fr-1fr">
                        {filteredData.map((position) => (
                            <div className="peer group cursor-pointer flex flex-col justify-center items-start p-4 w-full bg-white rounded-lg border-[1px] hover:border-violet-300 transition shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] gap-4"
                                key={position.id}
                                onClick={() => {
                                    setIsEditModalOpen(true)
                                    setPositionName(position.position_name)
                                    setPositionId(position.id)
                                }
                                }>
                                <div className="flex justify-between w-full">
                                    <p className="text-black/70 text-base">
                                        {position.position_name}
                                    </p>
                                    <Edit className="group-hover:opacity-100 opacity-0 duration-300 w-6 h-6 text-violet-500" />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <AddPositionModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
            <EditPositionModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                positionName={positionName}
                positionId={positionId}
            />
        </>
    )
}
