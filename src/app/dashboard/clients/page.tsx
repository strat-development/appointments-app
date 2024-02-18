import { Navbar } from "@/components/dashboard/Navbar";
import { ClientsSection } from "@/components/dashboard/clients/ClientsSection";

export default function ClientsPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="p-8 w-full max-[480px]:p-0">
                <ClientsSection />
            </main>
        </div>
    );
}