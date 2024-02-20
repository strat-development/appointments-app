'use client'
import { Navbar } from "@/components/dashboard/Navbar";
import { Schedule } from "@/components/dashboard/schedule/Schedule";

export default function SchedulePage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="p-8 w-full max-[320px]:p-4">
                <Schedule />
            </main>
        </div>
    );
}