import { Navbar } from "@/components/dashboard/Navbar";
import { FavoritesSection } from "@/features/dashboard/favorites/page";

export default function FavoritesPage() {
    return (
        <>
            <div className="flex gap-16 items-center">
                <Navbar />
                <main className="p-8 w-full max-[480px]:p-0">
                    <FavoritesSection />
                </main>
            </div>

        </>
    )
}