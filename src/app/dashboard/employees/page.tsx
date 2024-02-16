import { Navbar } from "@/components/dashboard/Navbar"

export default function EmployeesPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <h1>Employees</h1>
            </main>
        </div>
    );
}