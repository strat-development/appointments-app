import { BusinessInfo } from "./BusinessInfo";
import { BusinessHero } from "./BusinessHero";



export const BusinessPageSection = () => {
    

    return (
        <div className="flex flex-col py-8 rounded-2xl w-full h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-8">
                    <BusinessHero />
                    <BusinessInfo />
                </div>
            </div>
        </div>
    );
}