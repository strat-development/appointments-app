import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { EmployeesData } from "@/types/types";

interface NewEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeName: string;
    employeeId: string;
    employeePhoneNumber: string;
    employeeEmail: string;
}

export const EditEmployeeModal = ({ isOpen, onClose, employeeName, employeeId, employeeEmail, employeePhoneNumber }: NewEmployeeModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const [employeeNames, setEmployeeNames] = useState<string>(employeeName);
    const [phoneNumbers, setPhoneNumbers] = useState<string>(employeePhoneNumber);
    const [emails, setEmails] = useState<string>(employeeEmail);

    useEffect(() => {
        setEmployeeNames(employeeName);
    }, [employeeName]);

    const editEmployee = useMutation(
        async (newEmployee: EmployeesData) => {
            await supabase
                .from("employees")
                .update(newEmployee)
                .eq("employee_id", employeeId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['employees', employeeId]);

                toast.success('Visit added!')
            },

            onError: () => {
                toast.error('Error adding the visit!')
            }
        }
    );

    const deleteEmployeeMutation = useMutation(
        async () => {
            await supabase
                .from("employees")
                .delete()
                .eq("employee_id", employeeId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['employees', employeeId]);
                toast.success('Employee deleted successfully!')
            },
            onError: () => {
                toast.error('Error deleting the position!')
            }
        }
    );

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="Employee">Employee</label>
                    <Input
                        id="Employee"
                        label="Employee name"
                        type="text"
                        placeholder="Employee name"
                        onChange={(e) => {
                            setEmployeeNames(e.target.value);
                        }}
                        value={employeeNames}
                    />
                    <Input
                        id="phone number"
                        label="Phone number"
                        type="text"
                        placeholder="Employee phone number"
                        onChange={(e) => {
                            setPhoneNumbers(e.target.value);
                        }}
                        value={phoneNumbers}
                    />
                    <Input
                        id="email"
                        label="Email"
                        type="text"
                        placeholder="Employee email..."
                        onChange={(e) => {
                            setEmails(e.target.value);
                        }}
                        value={emails}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        editEmployee.mutateAsync({
                            full_name: employeeNames,
                        } as EmployeesData);
                        handleClose();
                    }}>
                    Edit
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-red-600 to-red-500 text-white w-full"
                    onClick={() => {
                        deleteEmployeeMutation.mutate();
                        handleClose();
                    }}>
                    Delete
                </button>
            </div>
        </>
    )

    const clearStates = () => {
        setEmployeeNames('');
    }

    const handleClose = () => {
        clearStates();
        onClose();
    }

    return (
        <Modal isOpen={isOpen}
            onClose={handleClose}
            title='Edit position'
            body={bodyContent}
        />
    );
}