import { DeletedVisitTemplate } from "@/emails/DeletedVisitTemplate";
import { EditedVisitTemplate } from "@/emails/EditedVisitTemplate";
import { NewAppointmentEmailTemplate } from "@/emails/NewVisitTemplate";
import { useState } from "react";

export const EmailTemplatesContainer = () => {
    const date = new Date().toISOString();
    const [selectedTemplate, setSelectedTemplate] = useState<string>('new-appointment');

    const getButtonClass = (template: string) => {
        return selectedTemplate === template
            ? "text-violet-500 text-decoration-underline font-semibold cursor-pointer"
            : "text-black/70 cursor-pointer";
    };


    return (
        <div className="flex gap-8 max-w-[800px] p-4">
            <div className="max-w-[560px] border-[1px] rounded-lg w-full p-4 hover:border-2 hover:border-violet-500 transition">
                {selectedTemplate === 'new-appointment' && (
                    <NewAppointmentEmailTemplate date={date}
                        firstName="John"
                    />
                )}
                {selectedTemplate === 'edited-appointment' && (
                    <EditedVisitTemplate date={date}
                        firstName="John"
                        status="Active"
                        business_name="Visio"
                    />
                )}
                {selectedTemplate === 'deleted-appointment' && (
                    <DeletedVisitTemplate firstName="John"
                        business_name="Visio"
                    />
                )}
            </div>
            <div className="flex flex-col gap-4">
                <button className={getButtonClass('new-appointment')} 
                onClick={() => setSelectedTemplate('new-appointment')}>New Appointment</button>
                <button className={getButtonClass('edited-appointment')}
                onClick={() => setSelectedTemplate('edited-appointment')}>Edited Appointment</button>
                <button className={getButtonClass('deleted-appointment')} 
                onClick={() => setSelectedTemplate('deleted-appointment')}>Deleted Appointment</button>
            </div>
        </div>
    );
}