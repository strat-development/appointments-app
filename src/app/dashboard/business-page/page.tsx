"use client"

import { Navbar } from "@/components/dashboard/Navbar";
import { ImagesCarousel } from "@/features/dashboard/business-page/ImagesCarousel";

export default function PageConstructorPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <ImagesCarousel />
            </main>
        </div>
    );
}