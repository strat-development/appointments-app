"use client"

import { supabaseAdmin } from "@/libs/admin";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DocumentUpload } from "iconsax-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

export const UploadImagesButton = () => {
    const supabase = createClientComponentClient<Database>();
    const businessName = "Visio"
    const [files, setFiles] = useState<File[]>([]);
    const queryClient = useQueryClient();
    const uploadFiles = async (files: File[]) => {
        const uploadPromises = files.map((file) => {
            const path = `business-page-photos/${file.name}+${Math.random()}`;
            return supabaseAdmin.storage.from('business-page-photos').upload(path, file);
        });

        const responses = await Promise.all(uploadPromises);

        responses.forEach((response, index) => {
            if (response.error) {
                console.error(`Error uploading file ${files[index].name}:`, response.error.message);
            } else {
                console.log(`File ${files[index].name} uploaded successfully`);
            }
        });
    }

    const businessImagesMutation = useMutation(
        async (files: File[]) => {
            const results = await Promise.all(files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const filePath = `${businessName}/${Math.random()}.${fileExt}`;

                const { data, error } = await supabase
                    .from('business-images')
                    .upsert({
                        business_name: businessName,
                        image_url: filePath
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
                queryClient.invalidateQueries(['business-images']);
            },
            onError: () => {
                alert('Error updating the data!');
            },
        }
    );

    return (
        <>
            <div className="w-full border-[.5px] border-black/10">
                <div className='flex flex-col gap-2'>
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
                        <span>Select files</span>
                    </label>
                    {files.map((file, index) => <p key={index}>{file.name}</p>)}
                </div>
            </div>
            <button onClick={() => {
                if (files.length > 0) {
                    uploadFiles(files)
                        .then(() => console.log('All files uploaded'))
                        .catch((error) => console.error('Error uploading files:', error));
                } else {
                    toast.error('Please upload a file')
                }

                businessImagesMutation.mutateAsync(files)
            }}>
                Send
            </button >
        </>
    )
}