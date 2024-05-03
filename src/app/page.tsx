"use client"

import { Navbar } from "@/components/landing-page/Navbar"
import { BusinessSearchComponent } from "@/features/business-search/BusinessSearchComponent";
import { BusinessTypeFilter } from "@/features/business-search/BusinessTypeFilter";

export default function Home() {
	return (
		<div>
			<Navbar />
			<main className="flex flex-col gap-8 p-16">
				<BusinessSearchComponent />
				<BusinessTypeFilter />
			</main>
		</div>
	);
}
