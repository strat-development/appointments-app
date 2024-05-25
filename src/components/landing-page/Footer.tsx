import { ArchiveTick, Box2, Briefcase, Calendar, Call, Grid3, Instagram, MessageQuestion, Notification, ShieldSecurity, Star } from "iconsax-react"
import Image from "next/image"

export const Footer = () => {
    return (
        <>
            <footer className="max-w-[1200px] w-full flex flex-col gap-12 mt-36 mb-4">
                <Image src="/Visio_logo.svg" width={75} height={75} alt="logo" />
                <div className="flex justify-between">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-8">
                            <div className="flex gap-2 items-center">
                                <Star className="text-[#5100D6]" size="24" />
                                <h4 className="text-lg font-semibold text-black/70">Functionality</h4>
                            </div>
                            <ul className="flex flex-col gap-4">
                                <li className="flex gap-2 items-center">
                                    <Calendar className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Schedule</p>
                                </li>
                                <li className="flex gap-2 items-center">
                                    <Notification className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Notifications</p>
                                </li>
                                <li className="flex gap-2 items-center">
                                    <ArchiveTick className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">On-line appointments</p>
                                </li>
                                <li className="flex gap-2 items-center">
                                    <Briefcase className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Business management</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-8">
                            <div className="flex gap-2 items-center">
                                <Grid3 className="text-[#5100D6]" size="24" />
                                <h4 className="text-lg font-semibold text-black/70">Functionality</h4>
                            </div>
                            <ul className="flex flex-col gap-4">
                                <li className="flex gap-2 items-center">
                                    <MessageQuestion className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">FAQ</p>
                                </li>
                                <li className="flex gap-2 items-center">
                                    <Call className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Contact</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-8">
                            <div className="flex gap-2 items-center">
                                <Box2 className="text-[#5100D6]" size="24" />
                                <h4 className="text-lg font-semibold text-black/70">Functionality</h4>
                            </div>
                            <ul className="flex flex-col gap-4">
                                <li className="flex gap-2 items-center">
                                    <ShieldSecurity className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Privacy policy</p>
                                </li>
                                <li className="flex gap-2 items-center">
                                    <Instagram className="text-[#5100D6]" size="18" />
                                    <p className="text-black/70 text-sm">Instagram</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8">
                    <Image src="/business-page-images/APPSTORE.svg" width={124} height={150} alt="App Store" />
                    <Image src="/business-page-images/GOOGLEPLAY.svg" width={124} height={150} alt="Google Play" />
                </div>
            </footer>
        </>
    )
}