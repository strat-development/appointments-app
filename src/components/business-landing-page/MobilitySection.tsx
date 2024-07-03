import { Calendar, Edit, User } from "iconsax-react"
import Image from "next/image"

export const MobilitySection = () => {
    return (
        <>
            <div className="relative flex flex-col items-center gap-16">
                <h3 className="text-5xl text-center font-semibold tracking-wider text-transparent bg-gradient-to-b from-[#5100D6] to-[#A168FF] bg-clip-text max-lg:text-4xl max-md:text-3xl">
                    Everything you need to manage your business on the go
                </h3>
                <div className="relative flex justify-between gap-16 items-center h-screen max-md:flex-col">
                    <Image className="z-10 max-md:hidden max-[1200px]:w-[60%]"
                        src="/business-page-images/Mobility.png" width={600} height={500} alt="Mobility Section" />
                    <div className="flex flex-col gap-8 z-10 w-full">
                        <div className="flex flex-col p-4 gap-4 border-[1px] border-violet-500 rounded-xl bg-white w-full">
                            <div className="flex gap-2">
                                <Calendar className="text-[#5100D6]"
                                    size="24" />
                                <p className="text-xl font-medium text-black/70">Schedule</p>
                            </div>
                            <p className="text-black/50">
                                You can use our appointments schedule everywhere you go. Track your appointment or manage them quick and with ease
                            </p>
                        </div>
                        <div className="flex flex-col p-4 gap-4 border-[1px] border-violet-500 rounded-xl bg-white w-full">
                            <div className="flex gap-2">
                                <User className="text-[#5100D6]"
                                    size="24" />
                                <p className="text-xl font-medium text-black/70">Stay in touch</p>
                            </div>
                            <p className="text-black/50">
                                Using our email templates you will be able to always stay in touch with your clients and notify them about any appointments changes
                            </p>
                        </div>
                        <div className="flex flex-col p-4 gap-4 border-[1px] border-violet-500 rounded-xl bg-white w-full">
                            <div className="flex gap-2">
                                <Edit className="text-[#5100D6]"
                                    size="24" />
                                <p className="text-xl font-medium text-black/70">Easy management</p>
                            </div>
                            <p className="text-black/50">
                                Using our business dashboard you will be able track and manage every aspect of your business. Track your statistics, manage clients and employees on the go
                            </p>
                        </div>
                    </div>
                    <div className="absolute w-[1400px] h-[700px] blur-[100px] bg-[#A788FF]/30 rounded-full z-0"></div>
                </div>
            </div>
        </>
    )
}