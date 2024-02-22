export const BusinessInfo = () => {
    return (
        <div className="relative">
            <div className="flex flex-col gap-8 w-[400px] sticky top-[32px]">
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl py-8">
                    LAST VISIT
                </div>
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl py-24">
                    ADDRESS
                </div>
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl py-24">
                    OPENING HOURS
                </div>
                <div className="flex items-center justify-center w-full border-[.5px] rounded-2xl py-16">
                    CONTACT
                </div>
                <div className="flex items-center justify-center w-full border-t-[.5px] py-4">
                    SOCIALS
                </div>
            </div>
        </div>

    );
}