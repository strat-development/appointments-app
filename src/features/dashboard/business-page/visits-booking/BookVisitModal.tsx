import { Modal } from "@/components/Modal"
import { BusinessSlugIdProps, ServicesData } from "@/types/types";
import { DatePickSlider } from "./DatePickSlider";

interface BookVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    selectedService?: ServicesData[];
}

export const BookVisitModal = ({ onClose, isOpen, businessSlugId, selectedService }: BookVisitModalProps) => {
    const bodyContent = (
        <div>
                <DatePickSlider businessSlugId={businessSlugId}
                    selectedService={selectedService}
                />
        </div>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={onClose}
            title='Book a visit'
            body={bodyContent}
        />
    )
}