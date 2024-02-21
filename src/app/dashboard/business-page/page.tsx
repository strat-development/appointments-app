import { Navbar } from "@/components/dashboard/Navbar";
import { UploadImagesButton } from "@/features/dashboard/business-page/UploadImagesButton";


export default function PageConstructorPage() {
    return (
        <div className="flex gap-16 items-center">
            <Navbar />
            <main>
                <UploadImagesButton />
            </main>
        </div>
    );
}