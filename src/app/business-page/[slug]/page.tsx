"use client"

import { Footer } from "@/components/landing-page/Footer"
import { Navbar } from "@/components/landing-page/Navbar"
import { BusinessPageSection } from "@/features/dashboard/business-page/BusinessPageSection"

export default async function BusinessPage({
    params
}: {
    params: {
        slug: string
    }
}) {
    const businessSlugId = params.slug

    return (
        <div className="flex flex-col items-center">
            <Navbar />
            <div className="relative top-24">
                <BusinessPageSection businessSlugId={businessSlugId} />
            </div>
            <Footer />
        </div>
    )
}