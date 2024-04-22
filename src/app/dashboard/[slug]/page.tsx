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
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="w-full max-[480px]:p-0">
                <BusinessPageSection businessSlugId={businessSlugId} />
            </main>
        </div>
    );
}