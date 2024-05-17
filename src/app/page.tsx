"use client"

import { FavouriteBusinessesSection } from "@/components/landing-page/FavouriteBusinessesSection";
import { Navbar } from "@/components/landing-page/Navbar"
import { BusinessSearchComponent } from "@/features/business-search/BusinessSearchComponent";
import { BusinessTypeFilter } from "@/features/business-search/BusinessTypeFilter";

export default function Home() {
	return (
		<div>
			<Navbar />
			<main className="flex flex-col gap-8 max-w-[1200px] mt-20 mx-auto">
				<div className="flex flex-col justify-between h-[600px]">
					<div className="flex w-full justify-between items-center">
						<BusinessSearchComponent />
						<FavouriteBusinessesSection />
					</div>
					<BusinessTypeFilter />
				</div>
			</main>
		</div>
	);
}
