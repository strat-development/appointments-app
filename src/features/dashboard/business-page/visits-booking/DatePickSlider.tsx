import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, ServicesData, VisitsData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { HoursPickerSlider } from "./HoursPickerSlider";

interface DatePickSliderProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    selectedService?: ServicesData[];
}

export const DatePickSlider = ({ businessSlugId, selectedService }: DatePickSliderProps) => {
    const today = new Date();
    const [currentPage, setCurrentPage] = useState(0);
    const [visits, setVisits] = useState<VisitsData[]>([]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const supabase = createClientComponentClient<Database>();

    console.log(selectedService);

    const getVisits = async () => {
        const { data, error } = await supabase
            .from('visits')
            .select('*')
            .eq('business_id', businessSlugId || "")
            .filter('start_time', 'gte', selectedDate + 'T00:00:00')
            .filter('start_time', 'lt', selectedDate + 'T23:59:59');
        if (error) {
            throw error;
        } else {
            setVisits(data);
        }
    }

    const sliderDates = Array.from({ length: 30 }, (_, i) => {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const dateString = futureDate.getFullYear() + '-' +
            String(futureDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(futureDate.getDate()).padStart(2, '0');
        return {
            date: dateString,
            available: true,
            month: futureDate.getMonth()
        };
    });

    const pages = Array.from({ length: Math.ceil(sliderDates.length / 5) }, (_, i) => sliderDates.slice(i * 5, i * 5 + 5));

    const handleScroll = () => {
        const visiblePages = pages.filter((_, i) => {
            const pageElement = sliderRef.current?.children[i] as HTMLDivElement;
            return pageElement.offsetLeft < (sliderRef.current?.scrollLeft ?? 0) + (sliderRef.current?.offsetWidth ?? 0);
        });
        const lastVisiblePage = visiblePages[visiblePages.length - 1];
        setCurrentPage(pages.indexOf(lastVisiblePage));
    };

    useEffect(() => {
        sliderRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            sliderRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [pages]);

    const handleNext = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, pages.length - 1));
    };

    const handlePrev = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    }

    useEffect(() => {
        getVisits();
    }, [selectedDate]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    return (
        <div className="flex flex-col items-center gap-8" ref={sliderRef}>
            <div className="text-xl capitalize">{new Date(today.getFullYear(), pages[currentPage][0].month).toLocaleString('default', { month: 'long' })}</div>
            <div className="flex items-center justify-center gap-8 max-[768px]:gap-4    ">
                {currentPage > 0 &&
                    <button onClick={handlePrev} className="text-black">
                        <ArrowLeft />
                    </button>
                }
                {pages[currentPage].map((date, index) => {
                    const day = new Date(date.date).getDate();
                    const isHiddenOnSmallScreen = index >= 3;
                    return (
                        <div key={index} className="flex flex-col items-center w-fit"
                            style={{ display: isHiddenOnSmallScreen && window.innerWidth < 480 ? 'none' : 'flex' }}
                        >
                            <div className={`flex items-center justify-center text-white w-[50px] h-[50px] rounded-full ${date.available ? "bg-violet-500" : "bg-red-500"}`}
                                onClick={() => handleDateSelect(date.date)}
                            >{day}</div>
                        </div>
                    )
                })}
                <button onClick={handleNext} className=" text-black">
                    <ArrowRight />
                </button>
            </div>
            <HoursPickerSlider selectedDate={selectedDate}
                businessSlugId={businessSlugId}
                visits={visits}
                selectedService={selectedService}
            />
        </div>
    )
}