import { BusinessInfo } from "./BusinessInfo";
import { BusinessServices } from "./BusinessServices";
import { BusinessOpinions } from "./BusinessOpinions";
import { BusinessSlugIdProps } from "@/types/types";
import { BusinessImages } from "./BusinessImages";
import { BusinessDescription } from "./BusinessDescription";


export const BusinessPageSection = ({businessSlugId}: BusinessSlugIdProps) => {
    return (
        <div className="flex flex-col py-8 rounded-2xl mx-auto">
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-8 max-[1200px]:flex-col">
                    <div className="flex flex-col gap-8">
                        <BusinessImages businessSlugId={businessSlugId} />
                        <BusinessDescription businessSlugId={businessSlugId} />
                        <BusinessServices businessSlugId={businessSlugId} />
                        <BusinessOpinions businessSlugId={businessSlugId} />
                    </div>
                    <BusinessInfo businessSlugId={businessSlugId} />
                </div>
            </div>
        </div>
    );
}