"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { Database } from "@/types/supabase"
import { useMutation, useQuery, useQueryClient } from "react-query"
import "@/styles/schedule.css"
import { useUserContext } from "@/providers/userContextProvider"
import { Note } from "iconsax-react"
import { VisitsData } from "@/types/types"
import { Pagination } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

export const VisitsSection = () => {
    const supabase = createClientComponentClient<Database>();
    const [isData, setIsData] = useState<VisitsData[]>([])
    const { userName, userId } = useUserContext();
    const [searchPrompt, setSearchPrompt] = useState("");
    const filteredData = isData.filter(item => item.status && item.start_time?.includes(searchPrompt));
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);
    const serviceId = isData.map(item => item.service_id);


    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    useQuery(
        ['visits', userId],
        async () => {
            const { data, error, status } = await supabase
                .from("visits")
                .select("*")
                .eq("client_id", userId)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setIsData(data)
            }

            return data;
        },
    );

    const { data: servicesData } = useQuery(
        ['services', serviceId],
        async () => {
            const { data, error, status } = await supabase
                .from("services")
                .select("*")
                .in("service_id", serviceId)

            if (error && status !== 406) {
                throw error;
            }

            return data;
        },
        {
            enabled: serviceId.length > 0,
        }
    )

    const { data: images } = useQuery(
        ['business-images'],
        async () => {
            const { data, error } = await supabase
                .from('business-images')
                .select("*")

            if (error) {
                throw error;
            }

            return data || [];
        }
    )

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image: any) => {
                const { data: publicURL } = await supabase.storage
                    .from('business-page-photos')
                    .getPublicUrl(image.image_url)

                return { businessId: image.business_id, publicUrl: publicURL.publicUrl };
            }))
                .then((publicUrls) => {
                    const filteredUrls = publicUrls.filter(url => url.businessId !== null);
                    setImageUrls(filteredUrls as { businessId: string, publicUrl: string }[]);
                })
                .catch(console.error);
        }
    }, [images]);

    const cancelVisitMutation = useMutation(
        async (visitId: string) => {
            await supabase
                .from("visits")
                .update({ status: "Canceled" })
                .eq("visit_id", visitId)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['visits', userId]);
                toast.success('Visit cancelled successfully!')
            },

            onError: () => {
                toast.error('Error cancelling the visit!')
            }
        }
    )

    return (
        <>
            <div className="p-4 rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8 max-[1024px]:h-[90vh]">
                <div className="flex items-start justify-start self-start w-full border-b-[1px] pb-4 gap-2">
                    <Note className="w-6 h-6 text-violet-500" />
                    <p className="text-lg font-medium">Your Visits</p>
                </div>
                <div className="p-4 border-[1px] rounded-lg bg-white w-full h-[80vh] overflow-y-auto flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        {userName && (
                            <div className="flex flex-col justify-end">
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-4">
                                        <input className="px-4 py-2 outline-none border-[1px] transition focus:border-violet-300 rounded-lg w-full max-[768px]:w-[250px] min-[768px]:w-64"
                                            type="text"
                                            placeholder="Search..."
                                            value={searchPrompt}
                                            onChange={(e) => setSearchPrompt(e.target.value)}
                                        />
                                        <p className="w-[350px] max-[480px]:text-xs max-[480px]:max-w-[300px] min:[1024px]:max-w-[400px] text-sm text-black/70">
                                            In this section you can manage your visits. You check them and cancel at any time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {isData.length === 0 && (
                        <p className="text-lg font-semibold text-black/70 min-[768px]:text-xl">No visits booked</p>
                    )}

                    <div className="grid grid-cols-3 gap-8 max-[1460px]:grid-cols-2 max-[1360px]:grid-cols-1">
                        {filteredData.slice(startIndex, endIndex).map((item) => {
                            const service = servicesData?.find(service => service.service_id === item.service_id);
                            const imageUrl = imageUrls.find(url => url.businessId === item.business_id);

                            return (
                                <div className="flex gap-4 border-[1px] max-[480px]:flex-col max-[480px]:items-start p-4 rounded-lg"
                                key={item.visit_id}>
                                    <div className="relative">
                                        <Image alt=""
                                            src={imageUrl?.publicUrl as string}
                                            width={200}
                                            height={200}
                                            className="rounded-lg w-[164px] resize-none max-[480px]:w-full"

                                        />
                                    </div>
                                    <div className="flex flex-col justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <p className="max-[480px]:text-lg">{item.status}</p>
                                            <p className="text-xl font-semibold text-black/70 max-[480px]:text-2xl">{service?.title}</p>
                                            <div className="flex gap-4">
                                                <p className="text-base font-semibold text-black/70 max-[480px]:text-lg">{service?.price} zł</p>
                                                <p className="text-base font-semibold text-black/70 max-[480px]:text-lg">{service?.duration} min</p>
                                            </div>
                                            <p className="text-sm font-semibold text-black/50 max-[480px]:text-base">{item.start_time}</p>
                                        </div>
                                        <div className="flex gap-8">
                                            <Link href={`/business-page/${item.business_id}`}
                                                className="px-4 py-2 bg-violet-500 text-white rounded-lg max-[480px]:text-lg">Check</Link>
                                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg max-[480px]:text-lg"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Are you sure you want to cancel this visit?',
                                                        showCancelButton: true,
                                                        confirmButtonText: `Yes`,
                                                        cancelButtonText: `No`,
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            cancelVisitMutation.mutateAsync(item.visit_id.toString())
                                                        }
                                                    })
                                                }}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <Pagination className="self-center"
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="secondary"
                    />
                </div>
            </div>
        </>
    )
}
