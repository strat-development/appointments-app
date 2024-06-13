"use client"

import { CityBusinessesSection } from "@/components/landing-page/CityBusinessesSection";
import { FavouriteBusinessesSection } from "@/components/landing-page/FavouriteBusinessesSection";
import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar"
import { SuggestedBusinessesSection } from "@/components/landing-page/SuggestedBusinessesSection";
import { BusinessSearchComponent } from "@/features/business-search/BusinessSearchComponent";
import { BusinessTypeFilter } from "@/features/business-search/BusinessTypeFilter";
import { useUserContext } from "@/providers/userContextProvider";
import { useEffect, useState } from "react";

export default function Home() {
	const geoKey = process.env.NEXT_PUBLIC_GEO_CODE_API_KEY;
	const [city, setCity] = useState<string | null>(null);
	const { userId } = useUserContext();

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				const { latitude, longitude } = position.coords;

				const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoKey}&language=en`);
				const data = await response.json();
				const city = data.results[0].components.city;

				setCity(city);
			}, (error) => {
				console.error("Error occurred while getting geolocation: ", error);
			});
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}, []);

	return (
		<div className="overflow-hidden">
			<Navbar />
			<div className="flex flex-col items-center gap-8 mt-16 m-auto">
				<div className="flex flex-col justify-between items-center w-screen bg-violet-200/50">
					<div className="flex gap-16 max-w-[1200px] w-full h-[500px] justify-between">
						<BusinessSearchComponent />
						{userId && (
							<FavouriteBusinessesSection />
						)}
						{!userId && (
							<CityBusinessesSection city={city} />
						)}
					</div>
					<div className="flex justify-between max-w-[1200px] w-full">
						<BusinessTypeFilter />
					</div>
				</div>
				<SuggestedBusinessesSection city={city} />
				<Footer />
			</div>
		</div>
	);
}
