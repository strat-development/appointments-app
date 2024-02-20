'use client'
import { Navbar } from "@/components/dashboard/Navbar";
import { Schedule } from "@/components/dashboard/schedule/Schedule";
import { useBusinessContext } from "@/providers/businessContextProvider";

export default function SchedulePage() {
    const {userName}=useBusinessContext();
      if(!userName){

      }
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main className="p-8 w-full max-[320px]:p-4">
                <Schedule />
            </main>
        </div>
    );
}