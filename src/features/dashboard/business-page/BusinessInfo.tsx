import { BusinessSlugIdProps } from "@/types/types";
import { ContactInfo } from "./ContactInfo";
import { OpeningHours } from "./OpeningHours";
import { Socials } from "./Socials";

export const BusinessInfo = ({businessSlugId}: BusinessSlugIdProps) => {
    return (
        <div className="relative z-[22222222]">
            <div className="flex flex-col gap-8 sticky top-[128px]">
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl p-4">
                    <OpeningHours businessSlugId={businessSlugId} />
                </div>
                <div className="flex flex-col items-start justify-start w-full">
                    <h3 className="border-b-[.5px] w-full text-xl font-semibold pb-2">Contact</h3>
                    <ContactInfo businessSlugId={businessSlugId} />
                </div>
                <div className="flex items-center justify-center w-full border-t-[.5px] p-4">
                    <Socials businessSlugId={businessSlugId} />
                </div>
            </div>
        </div>
    );
}