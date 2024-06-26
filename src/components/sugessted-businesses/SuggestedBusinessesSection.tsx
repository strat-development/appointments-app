import { RandomBusinessInCity } from "../landing-page/RandomBusinessInCity";
import { BusinessesInCity } from "../sugessted-businesses/BusinessesInCity";


interface SuggestedBusinessesSectionProps {
    city: string | null;
}

export const SuggestedBusinessesSection = ({ city }: SuggestedBusinessesSectionProps) => {
    return (
        <div className="max-w-[1200px] m-auto w-full flex flex-col items-start justify-start gap-16 overflow-hidden">
            <BusinessesInCity city={city} />
            <RandomBusinessInCity city={city} />
        </div>
    );
}