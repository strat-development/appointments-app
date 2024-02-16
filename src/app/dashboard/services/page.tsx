import { Navbar } from "@/components/dashboard/Navbar";

export default function DashboardPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <h1>Dashboard</h1>
            </main>
        </div>
    );
}