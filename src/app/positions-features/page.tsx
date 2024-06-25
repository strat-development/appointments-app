import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar";
import Image from "next/image";

export default function PositionsFeaturesPage() {
    return (
        <div className="overflow-hidden">
            <Navbar />
            <div className="flex flex-col items-center gap-32 mt-32 px-16 m-auto">
                <div className="flex justify-between gap-8 items-center">
                    <Image className="w-[55%] shadow-xl rounded-xl"
                        src="/Positions/positions-view.png" width={2000} height={2000} alt="positions" />
                    <div className="flex justify-start w-full">
                        <div className="flex flex-col gap-4 justify-self-center w-fit">
                            <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Positions view</h1>
                            <p className="text-black/70 w-[500px]">
                                Show your clients the capabilities of your business by simply adding the positions you have
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-8 items-center">
                    <div className="flex justify-end w-full">
                        <div className="flex flex-col gap-4 justify-self-center w-fit">
                            <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Business statistics</h1>
                            <p className="text-black/70 w-[500px]">
                                Track your business statistics and make data-driven decisions to improve your business
                            </p>
                        </div>
                    </div>
                    <Image className="w-[55%] shadow-xl rounded-xl"
                        src="/Positions/stats-view.png" width={2000} height={2000} alt="calendar" />
                </div>
                <div className="flex justify-between gap-8 items-center">
                    <Image className="w-[55%] shadow-xl rounded-xl"
                        src="/Positions/services-view.png" width={2000} height={2000} alt="positions" />
                    <div className="flex justify-start w-full">
                        <div className="flex flex-col gap-4 justify-self-center w-fit">
                            <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Services view</h1>
                            <p className="text-black/70 w-[500px]">
                                Manage your services and prices to make it as convinient as possible for you
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-8 items-center">
                    <div className="flex justify-end w-full">
                        <div className="flex flex-col gap-4 justify-self-center w-fit">
                            <h1 className="text-4xl tracking-wider font-bold text-[#5100D6]">Employees view</h1>
                            <p className="text-black/70 w-[500px]">
                                Manage your employees and their schedules to make it as convinient as possible for you
                            </p>
                        </div>
                    </div>
                    <Image className="w-[55%] shadow-xl rounded-xl"
                        src="/Positions/employees-view.png" width={2000} height={2000} alt="calendar" />
                </div>
            </div>
            <Footer />
        </div>
    )
}