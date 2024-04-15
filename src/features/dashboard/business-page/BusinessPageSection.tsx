import { BusinessInfo } from "./BusinessInfo";
import { BusinessHero } from "./BusinessHero";
import { BusinessServices } from "./BusinessServices";
import { BusinessOpinions } from "./BusinessOpinions";

export const BusinessPageSection = () => {

    return (
        <div className="flex flex-col py-8 rounded-2xl w-full h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-8">
                    <div className="flex flex-col gap-8">
                        <BusinessHero />
                        <BusinessServices />
                        <BusinessOpinions />
                    </div>
                    <BusinessInfo />
                </div>
            </div>
        </div>
    );
}