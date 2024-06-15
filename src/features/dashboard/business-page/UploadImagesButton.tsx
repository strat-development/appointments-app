"use client"

import { supabaseAdmin } from "@/libs/admin";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DocumentUpload } from "iconsax-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

export const UploadImagesButton = () => {
    const supabase = createClientComponentClient<Database>();
    const { businessId } = useBusinessContext();
    const [files, setFiles] = useState<File[]>([]);
    const queryClient = useQueryClient();


    const uploadFiles = async (files: File[]) => {
        const uploadPromises = files.map((file) => {
            const path = `${businessId}${Math.random()}.${file.name.split('.').pop()}`;
            return { promise: supabaseAdmin.storage.from('business-page-photos').upload(path, file), path };
        });

        const responses = await Promise.all(uploadPromises.map(({ promise }) => promise));

        responses.forEach((response, index) => {
            if (response.error) {
                toast.error(`Error uploading file ${files[index].name}:`);
            } else {
                toast.success(`File ${files[index].name} uploaded successfully`);
            }
        });

        return uploadPromises.map(({ path }) => path);
    }

    const businessImagesMutation = useMutation(
        async (paths: string[]) => {
            const results = await Promise.all(paths.map(async (path) => {
                const { data, error } = await supabase
                    .from('business-images')
                    .upsert({
                        business_id: businessId,
                        image_url: path
                    });
                if (error) {
                    throw error;
                }
                return data;
            }));

            return results;
        },
        {
            onSuccess: () => {
                toast.success('Images uploaded successfully!');
                queryClient.invalidateQueries(['business-images']);
            },
            onError: () => {
                toast.error('Error uploading images');
            },
        }
    );

    return (
        <>
            <div className="flex gap-4">
                <div className='flex justify-center flex-col gap-2'>
                    <input
                        type="file"
                        id="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            if (e.target.files) {
                                setFiles([...files, ...Array.from(e.target.files)]);
                            }
                        }}
                    />
                    <label htmlFor="file" className="flex items-center gap-2 text-black cursor-pointer">
                        <DocumentUpload className='text-violet-600' />
                        <span className="max-[600px]:hidden">Select files</span>
                    </label>
                    {files.length > 0 && (
                        <div className="flex flex-col gap-2 border-[1px] p-2 rounded-lg">
                            {files.map((file, index) =>
                                <div key={index}
                                 className="border-b-[1px] text-black/70">
                                    <p className="w-[80%] truncate" 
                                    key={index}>{file.name}</p>
                                </div>
                            )}
                            <button onClick={() => setFiles([])} 
                            className="hover:text-red-500/70 transition">
                                Clear
                            </button>
                        </div>
                    )}
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-fit h-fit"
                    onClick={() => {
                        if (files.length > 0) {
                            uploadFiles(files)
                                .then((paths) => {
                                    return businessImagesMutation.mutateAsync(paths);
                                })
                                .catch((error) => console.error('Error uploading files:', error));
                        } else {
                            toast.error('Please upload a file')
                        }
                    }}>
                    Send
                </button >
            </div>
        </>
    )
}