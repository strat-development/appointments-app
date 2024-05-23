import { BusinessTopHeroSection } from "@/components/business-landing-page/BusinessTopHeroSection"
import { FeaturesSection } from "@/components/business-landing-page/FeaturesSection"
import { MobilitySection } from "@/components/business-landing-page/MobilitySection"
import { Navbar } from "@/components/landing-page/Navbar"

export default function BusinessLandingPage() {
    return (
        <>
            <Navbar />
            <div className="max-w-[1200px] w-full mx-auto flex flex-col justify-center mt-16">
                <BusinessTopHeroSection />
                <FeaturesSection />
                <MobilitySection />
            </div>
        </>
    )
}