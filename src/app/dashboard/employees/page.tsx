import { Navbar } from "@/components/dashboard/Navbar"
import { EmployeesSection } from "@/components/dashboard/employee/EmployeesSection";

export default function EmployeesPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="p-8 w-full max-[480px]:p-0">
                <EmployeesSection />
            </main>
        </div>
    );
}