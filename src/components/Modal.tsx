"use client"

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    title?: string;
    body?: React.ReactElement;
    disabled?: boolean;
    isEditing?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    body,
    disabled
}) => {

    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300)
    }, [onClose, disabled]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[222222222222222222] outline-none focus:outline-none  bg-neutral-800/10">
                <div className="relative w-fit m-6 mx-auto h-fit lg:h-auto md:h-auto">
                    {/* Content */}
                    <div className={`translate duration-300 h-full ${showModal ? 'translate-y-0' : 'translate-y-full'} ${showModal ? 'opacity-100' : 'opacity-0'}`}>
                        <div className=" translate m-4 h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col gap-4 w-full bg-white outline-none focus:outline-none">
                            {/* Header */}
                            <div className="flex items-center p-6 rounded-t justify-center relative">
                                <button className="p-1 border-0 hover:opacity-70 text-lg transition absolute right-5"
                                    onClick={handleClose}>
                                    <IoMdClose />
                                </button>
                                <div className="text-lg font-semibold">
                                    {title}
                                </div>
                            </div>
                            {/* BODY */}
                            <div className="relative px-4 pb-4 flex-auto">
                                {body}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}