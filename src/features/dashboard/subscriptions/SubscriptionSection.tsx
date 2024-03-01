"use client"
import { useState } from "react";
import { BusinessDataModal } from "./BusinessDataModal";

export const SubscriptionSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const CloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <>
            <BusinessDataModal isOpen={isModalOpen}
                onClose={CloseModal} />
            <button onClick={() => { setIsModalOpen(true) }}>I have business</ button>
        </>
    );
}