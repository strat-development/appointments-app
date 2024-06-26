"use client"

import { Navbar } from "@/components/dashboard/Navbar";
import { BusinessPageSection } from "@/features/dashboard/business-page/BusinessPageSection";

export default function BusinessPage({
    params
}: {
    params: {
        slug: string
    }
}) {
    const businessSlugId = params.slug

    return (
        <div className="flex gap-16 items-start">
            <Navbar />
            <main className="w-full max-w-[1200px] max-[1200px]:p-4">
                <BusinessPageSection businessSlugId={businessSlugId} />
            </main>
        </div>
    );
}