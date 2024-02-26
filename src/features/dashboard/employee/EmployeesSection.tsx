"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import { Database } from "@/types/supabase"
import { useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { Edit } from "iconsax-react"
import { AddEmployeeModal } from "./AddEmployeeModal"
import { EditEmployeeModal } from "./EditEmployeeModal"
import { useBusinessContext } from "@/providers/businessContextProvider"

type Employees = Database["public"]["Tables"]["subordinates"]["Row"]

export const EmployeesSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<Employees[]>([])
    const queryClient = useQueryClient();
    const { userName, userId } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [employeeName, setEmployeeName] = useState<string>("");
    const [employeeId, setEmployeeId] = useState<number>(0);
    const [employeePhoneNumber, setEmployeePhoneNumber] = useState<string>("");
    const [employeeEmail, setEmployeeEmail] = useState<string>("");
    const filteredData = isData.filter(item => item.full_name && item.full_name.includes(searchPrompt));
    const { businessName } = useBusinessContext();

    useQuery(
        ['subordinates', businessName],
        async () => {
            const { data, error, status } = await supabase
                .from("subordinates")
                .select("*")
                .eq("employer_id", userId)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data)
                queryClient.invalidateQueries(['subordinates', employeeId]);
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
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">Here are your employees!</p>
                                )}

                                {isData.length === 0 && (
                                    <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No employees added</p>
                                )}
                                <div className="flex justify-between">
                                    <input
                                        className="px-4 py-2 outline-none border transition focus:border-violet-300 border-gray-300 rounded-full w-full min-[768px]:w-64"
                                        type="text"
                                        placeholder="Search"
                                        value={searchPrompt}
                                        onChange={(e) => setSearchPrompt(e.target.value)}
                                    />
                                    <button className="px-4 py-2 rounded-full min-w-40 hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white  min-[768px]:w-32"
                                        onClick={() => setIsModalOpen(true)}>
                                            New employee
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 w-fit min-[768px]:grid-cols-2 gap-4 min-[1024px]:grid-cols-4 grid-template-rows-1fr-1fr-1fr">
                        {filteredData.map((employee) => (
                            <div className="peer group cursor-pointer flex flex-col justify-center items-start p-4 w-full bg-white rounded-lg border-[1px] hover:border-violet-300 transition shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] gap-4"
                                key={employee.id}
                                onClick={() => {
                                    setIsEditModalOpen(true)
                                    setEmployeeName(employee.full_name || "")
                                    setEmployeeId(employee.id)
                                    setEmployeePhoneNumber(employee.phone_number || "")
                                    setEmployeeEmail(employee.email || "")
                                }
                                }>
                                <div className="flex justify-between w-full gap-4">
                                    <div className="flex flex-col">
                                        <p className="text-black/70 text-base font-semibold">
                                            {employee.full_name}
                                        </p>
                                        <p className="text-black/70 text-base">{employee.phone_number}</p>
                                        <p className="text-black/70 text-base">{employee.email}</p>
                                    </div>
                                    <Edit className="group-hover:opacity-100 opacity-0 duration-300 w-6 h-6 text-violet-500" />
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
            <EditEmployeeModal
                employeeName={employeeName}
                employeeId={employeeId}
                isOpen={isEditModalOpen}
                onClose={closeModal}
                employeePhoneNumber={employeePhoneNumber}
                employeeEmail={employeeEmail}
            />
        </>
    )
}
