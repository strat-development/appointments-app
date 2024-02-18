import { Navbar } from "@/components/dashboard/Navbar";
import { ServicesSection } from "@/components/dashboard/services/ServicesSection";

export default function ServicesPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="p-8 w-full max-[480px]:p-0">
                <ServicesSection />
            </main>
        </div>
    );
}