'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { uploadPdfToR2 } from '../lib/r2';

export default function DocumentUploader({ userId }: { userId: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        await handleFiles(files);
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            await handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        setIsUploading(true);
        const file = files ? files[0] : null;
        if (!file) {
            alert('No file selected');
            setIsUploading(false);
            return;
        }
        // Max file size check
        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB');
            setIsUploading(false);
            return;
        }

        if (file.type != 'application/pdf' && !file.type.startsWith('image/')) {
            alert('Please upload only PDF or image files');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async e => {
                const dataUri = e.target?.result as string;
                // await uploadPdfToR2(dataUri, userId, file.name);
                try {
                    const responseData = await fetch('/api/parser/process', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            fileUrl: 'publicUrl',
                            fileName: file.name,
                            fileType: file.type,
                            fileBuffer: dataUri,
                        }),
                    });
                    setIsUploading(false);
                    console.log('Response data : ', responseData);
                    router.refresh();
                } catch (error) {
                    console.log('Error uploading file:', error);
                    alert('Error uploading file. Please try again.');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please try again.');
            setIsUploading(false);
            return;
        }

        // try {
        //     // Upload to R2
        //     const timestamp = new Date().getTime();
        //     const fileName = `${userId}/${timestamp}-${file.name}`;
        //     const { error: uploadError } = await supabase.storage
        //         .from(process.env.NEXT_PUBLIC_R2_BUCKET_NAME!)
        //         .upload(fileName, file);

        //     if (uploadError) throw uploadError;

        //     // Get the public URL
        //     const {
        //         data: { publicUrl },
        //     } = supabase.storage
        //         .from(process.env.NEXT_PUBLIC_R2_BUCKET_NAME!)
        //         .getPublicUrl(fileName);

        //     // Create document record
        //     const { error: dbError } = await supabase.from('documents').insert({
        //         user_id: userId,
        //         file_name: file.name,
        //         file_url: publicUrl,
        //         file_type: file.type,
        //         status: 'processing',
        //         verification_status: 'pending',
        //     });

        //     if (dbError) throw dbError;

        //     // Trigger processing
        //     await fetch('/api/parser/process', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             fileUrl: publicUrl,
        //             fileName: file.name,
        //             fileType: file.type,
        //         }),
        //     });
        // } catch (error) {
        //     console.error('Error uploading file:', error);
        //     alert('Error uploading file. Please try again.');
        // }
    };

    return (
        <div
            className={`max-w-xl mx-auto p-6 border-2 border-dashed rounded-lg ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
            onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}>
            <div className="text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
                <div className="mt-4 flex text-sm text-gray-600 justify-center items-center">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="application/pdf,image/*"
                            onChange={handleFileInput}
                            disabled={isUploading}
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF or Image up to 10MB</p>
            </div>
            {isUploading && (
                <div className="mt-4">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
