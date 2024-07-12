import { BusinessInfo } from "./BusinessInfo";
import { BusinessServices } from "./BusinessServices";
import { BusinessOpinions } from "./BusinessOpinions";
import { BusinessSlugIdProps } from "@/types/types";
import { BusinessImages } from "./BusinessImages";
import { BusinessDescription } from "./BusinessDescription";


export const BusinessPageSection = ({ businessSlugId }: BusinessSlugIdProps) => {
    return (
        <div className="flex flex-col py-8 rounded-2xl mx-auto">
            <div className="flex gap-8 max-[1200px]:flex-col px-4 w-full max-[820px]:px-0 max-[820px]:max-w-[600px] max-[648px]:max-w-[480px] max-[524px]:max-w-[460px] max-[492px]:max-w-[400px] max-[440px]:max-w-[354px] max-[360px]:max-w-[296px]">
                <div className="flex flex-col gap-8">
                    <BusinessImages businessSlugId={businessSlugId} />
                    <BusinessDescription businessSlugId={businessSlugId} />
                    <BusinessServices businessSlugId={businessSlugId} />
                    <BusinessOpinions businessSlugId={businessSlugId} />
                </div>
                <BusinessInfo businessSlugId={businessSlugId} />
            </div>
        </div>
    );
}