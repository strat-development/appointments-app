"use client"

import { Navbar } from "@/components/dashboard/Navbar";
import { BusinessPageSection } from "@/features/dashboard/business-page/BusinessPageSection";
export default function PageConstructorPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="w-full max-[480px]:p-0">
                <BusinessPageSection />
            </main>
        </div>
    );
}