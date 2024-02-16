import { Navbar } from "@/components/dashboard/Navbar";

export default function ClientsPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <h1>Clients</h1>
            </main>
        </div>
    );
}