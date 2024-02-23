import { ContactInfo } from "./ContactInfo";
import { OpeningHours } from "./OpeningHours";

export const BusinessInfo = () => {
    

    return (
        <div className="relative z-[999999]">
            <div className="flex flex-col gap-8 w-[400px] sticky top-[32px]">
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl py-8">
                    LAST VISIT
                </div>
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl py-24">
                    <OpeningHours />
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                    <h3 className="border-b-[.5px] w-full text-xl font-semibold pb-2">Contact</h3>
                    <ContactInfo />
                </div>
                <div className="flex items-center justify-center w-full border-t-[.5px] py-4">
                    SOCIALS
                </div>
            </div>
        </div>

    );
}