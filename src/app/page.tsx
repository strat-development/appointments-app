"use client"

import { CityBusinessesSection } from "@/components/landing-page/CityBusinessesSection";
import { FavouriteBusinessesSection } from "@/components/landing-page/FavouriteBusinessesSection";
import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar"
import { SuggestedBusinessesSection } from "@/components/sugessted-businesses/SuggestedBusinessesSection";
import { BusinessSearchComponent } from "@/features/business-search/BusinessSearchComponent";
import { BusinessTypeFilter } from "@/features/business-search/BusinessTypeFilter";
import { useCityContext } from "@/providers/cityContextProvider";
import { useUserContext } from "@/providers/userContextProvider";

export default function Home() {
	const { userId } = useUserContext();
	const { city } = useCityContext();

	return (
		<div className="overflow-hidden">
			<Navbar />
			<div className="flex flex-col items-center gap-8 px-4 mt-16 m-auto">
				<div className="flex flex-col justify-between items-center px-4 w-screen bg-violet-200/50 max-[1024px]:h-fit">
					<div className="flex gap-16 max-w-[1200px] max-[1024px]:p-4 w-full h-[500px] justify-between max-[1024px]:flex-col max-[1024px]:h-fit max-[1024px]:items-center max-[1024px]:justify-center max-[1024px]:gap-8">
						<BusinessSearchComponent city={city} />
						{userId && (
							<FavouriteBusinessesSection />
						)}
						{!userId && (
							<CityBusinessesSection city={city} />
						)}
					</div>
					<div className="flex justify-between max-w-[1200px] w-full max-[1024px]:py-8">
						<BusinessTypeFilter city={city} />
					</div>
				</div>
				<SuggestedBusinessesSection city={city} />
				<Footer />
			</div>
		</div>
	);
}
