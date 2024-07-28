"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { AddPositionModal } from "./AddPositionModal"
import { EditPositionModal } from "./EditPositionModal"
import { Add, ChemicalGlass, Edit } from "iconsax-react"
import { useBusinessContext } from "@/providers/businessContextProvider"
import { PositionsData } from "@/types/types"
import { Pagination } from "@mui/material"

export const PositionsSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<PositionsData[]>([])
    const queryClient = useQueryClient();
    const { userName } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [positionName, setPositionName] = useState<string>("");
    const [positionId, setPositionId] = useState<number>(0);
    const filteredData = isData.filter(item => item.position_name && item.position_name.includes(searchPrompt));
    const { businessId } = useBusinessContext();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    useQuery(
        ['positions', businessId],
        async () => {
            const { data, error, status } = await supabase
                .from("positions")
                .select("*")
                .eq("business_id", businessId)

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
            <div className="p-4 rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                <div className="flex items-start justify-start self-start w-full border-b-[1px] pb-4 gap-2">
                    <ChemicalGlass className="w-6 h-6 text-violet-500" />
                    <p className="text-lg font-medium">Positions</p>
                </div>
                <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        {userName && (
                            <div className="flex flex-col justify-end">
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-4">
                                        <input className="px-4 py-2 outline-none border-[1px] transition focus:border-violet-300rounded-lg w-full max-[768px]:w-[250px] min-[768px]:w-64"
                                            type="text"
                                            placeholder="Search..."
                                            value={searchPrompt}
                                            onChange={(e) => setSearchPrompt(e.target.value)}
                                        />
                                        <p className="w-[350px] max-[480px]:text-xs max-[480px]:max-w-[300px] min:[1024px]:max-w-[400px] text-sm text-black/70">
                                            In this section you can manage your positions. You can add, edit and delete positions.
                                        </p>
                                    </div>
                                    <button className="flex gap-2 px-4 py-2 rounded-full h-fit hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-fit max-[640px]:p-2"
                                        onClick={() => setIsModalOpen(true)}>
                                        <p className="max-[640px]:hidden">Add position</p>
                                        <Add className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {isData.length === 0 && (
                        <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No positions added</p>
                    )}

                    <div className="grid grid-cols-4 gap-8 max-[1460px]:grid-cols-3 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1">
                        {filteredData.slice(startIndex, endIndex).map(position => (
                            <div className="peer group gap-4 cursor-pointer flex flex-col justify-start items-start p-4 w-full bg-white rounded-lg border-[1px] hover:border-violet-300 transition shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)]"
                                key={position.position_id}
                                onClick={() => {
                                    setIsEditModalOpen(true)
                                    setPositionName(position.position_name || "")
                                    setPositionId(position.position_id || 0)
                                }
                                }>
                                <div className="flex justify-between w-full gap-4 overflow-hidden">
                                    <div className="flex flex-col gap-4">
                                        <p className="text-black/70 text-base font-semibold">
                                            {position.position_name}
                                        </p>
                                    </div>
                                    <Edit className="group-hover:opacity-100 opacity-0 duration-300 w-6 h-6 text-violet-500" />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    <Pagination className="self-center"
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="secondary"
                    />
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
