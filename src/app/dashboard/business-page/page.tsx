import { Navbar } from "@/components/dashboard/Navbar";


export default function PageConstructorPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <h1>Page Constructor</h1>
            </main>
        </div>
    );
}