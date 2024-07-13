import { Navbar } from "@/components/dashboard/Navbar";
import { VisitsSection } from "@/features/dashboard/visits/VisitsSections";

export default function VisitsPage() {
    return (
        <>
            <div className="flex gap-16 items-center">
                <Navbar />
                <main className="p-8 w-full max-[480px]:p-0">
                    <VisitsSection />
                </main>
            </div>
        </>
    )
}