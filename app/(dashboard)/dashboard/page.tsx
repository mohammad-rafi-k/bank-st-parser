import { getUser } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';
// Update the import path below to the correct relative path if the file exists elsewhere, for example:
import DocumentUploader from '@/app/components/document-uploader';
// Or use the correct path based on your project structure.
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    // console.log('User:', user);
    if (error || !user) {
        // Handle unauthenticated state or error
        return <div>User not found or error occurred.</div>;
    }

    return (
        <div className="py-10">
            <header>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="px-4 py-8 sm:px-0">
                        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                            {user && (
                                <div className="px-4 py-5 sm:p-6">
                                    <DocumentUploader userId={user.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
