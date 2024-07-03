"use client"

import { BusinessTopHeroSection } from "@/components/business-landing-page/BusinessTopHeroSection"
import { FeaturesSection } from "@/components/business-landing-page/FeaturesSection"
import { MobilitySection } from "@/components/business-landing-page/MobilitySection"
import QuestionsSection from "@/components/business-landing-page/QuestionsSection"
import { Footer } from "@/components/landing-page/Footer"
import { Navbar } from "@/components/landing-page/Navbar"

export default function BusinessLandingPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-[1200px] gap-32 w-full mx-auto flex flex-col justify-center mt-16 px-8 max-[1200px]:overflow-x-hidden max-lg:-mt-16 max-[600px]:-mt-32 max-[420px]:-mt-24">
                <BusinessTopHeroSection />
                <FeaturesSection />
                <MobilitySection />
                <QuestionsSection />
            </div>
            <Footer />
        </>
    )
}