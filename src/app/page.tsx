"use client"

import { Navbar } from "@/components/landing-page/Navbar"
import { BusinessTypeFilter } from "@/features/business-type-filter/BusinessTypeFilter";

export default function Home() {
	return (
		<div>
			<Navbar />
			<main>
				<BusinessTypeFilter />
			</main>
		</div>
	);
}
