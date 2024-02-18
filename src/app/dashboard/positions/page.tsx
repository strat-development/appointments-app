import { Navbar } from "@/components/dashboard/Navbar";
import { PositionsSection } from "@/components/dashboard/positions/PositionsSection";

export default function PositionsPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="p-8 w-full max-[480px]:p-0">
                <PositionsSection />
            </main>
        </div>
    );
}