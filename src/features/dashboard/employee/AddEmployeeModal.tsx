import { useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { EmployeesData } from "@/types/types";

interface NewEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddEmployeeModal = ({ isOpen, onClose }: NewEmployeeModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const [employeeNames, setEmployeeNames] = useState<string[]>(['']);
    const [emails, setEmails] = useState<string[]>(['']);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
    const { userId } = useUserContext();
    const { businessName } = useBusinessContext();

    const clearStates = () => {
        setEmployeeNames(['']);
        setEmails(['']);
        setPhoneNumbers(['']);
    }

    const handleClose = () => {
        clearStates();
        onClose();
    }

    const addNewEmployee = useMutation(
        async (newEmployee: EmployeesData[]) => {
            await supabase
                .from("employees")
                .upsert(newEmployee)
                .eq("employer_id", userId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['employees', businessName]);
                toast.success('Employee added successfully!')
            },

            onError: () => {
                toast.error('Error adding the employee!')
            }
        }
    );

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                {employeeNames.map((employeeName, index) => (
                    <div key={index}>
                        <label htmlFor={`Employee ${index + 1}`}>Employee {index + 1}</label>
                        <Input
                            id={`employee ${index + 1}`}
                            label={`Employee ${index + 1}`}
                            type="text"
                            placeholder="Employee's name..."
                            onChange={(e) => {
                                const employee = [...employeeNames];
                                employee[index] = e.target.value;
                                setEmployeeNames(employee);
                            }}
                            value={employeeName}
                        />
                        <Input
                            id={`email ${index + 1}`}
                            label={`Email ${index + 1}`}
                            type="text"
                            placeholder="Email"
                            onChange={(e) => {
                                const newEmails = [...emails];
                                newEmails[index] = e.target.value;
                                setEmails(newEmails);
                            }}
                            value={emails[index] || ''}
                        />
                        <Input
                            id={`phone number ${index + 1}`}
                            label={`Phone number ${index + 1}`}
                            type="text"
                            placeholder="Phone number"
                            onChange={(e) => {
                                const newPhoneNumber = [...phoneNumbers];
                                newPhoneNumber[index] = e.target.value;
                                setPhoneNumbers(newPhoneNumber);
                            }}
                            value={phoneNumbers[index] || ''}
                        />
                    </div>
                ))}
                <button onClick={() => {
                    setEmployeeNames([...employeeNames, '']);
                    setEmails([...emails, '']);
                }}>
                    Add more
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addNewEmployee.mutateAsync(
                            employeeNames.map((employee, index) => ({
                                full_name: employee,
                                email: emails[index],
                                business_name: businessName,
                                phone_number: phoneNumbers[index],
                                employer_id: userId
                            } as EmployeesData))
                        );
                        handleClose();
                    }}>
                    Add employee
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={handleClose}
            title='New employee'
            body={bodyContent}
        />
    );
}