"use client"

import { FavouriteBusinessesSection } from "@/components/landing-page/FavouriteBusinessesSection";
import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar"
import { BusinessSearchComponent } from "@/features/business-search/BusinessSearchComponent";
import { BusinessTypeFilter } from "@/features/business-search/BusinessTypeFilter";

export default function Home() {
	return (
		<div>
			<Navbar />
			<div className="flex flex-col items-center gap-8 max-w-[1200px] mt-16 m-auto">
				<div className="flex flex-col justify-between items-center w-screen bg-violet-200/50">
					<div className="flex gap-16 max-w-[1200px] w-full h-[500px] justify-between">
						<BusinessSearchComponent />
						<FavouriteBusinessesSection />
					</div>
					<div className="flex justify-between max-w-[1200px] w-full">
						<BusinessTypeFilter />
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}
