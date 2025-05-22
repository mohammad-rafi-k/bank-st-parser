import { getUser } from '@/app/lib/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/types/supabase';
import Link from 'next/link';
import { redirect } from 'next/navigation';
// Make sure the path and export are correct; adjust if needed:
import { downloadData } from '@/app/lib/utils/download';
// If the file or export does not exist, create 'app/lib/utils.ts' and export 'downloadData' from it.

export default async function DocumentsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const user = await getUser();

  if (!user) {
    redirect('/signin');
  }

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Documents
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {documents?.map((doc) => (
                  <li key={doc.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {doc.file_type.startsWith('image/') ? (
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {doc.file_name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Uploaded on {formatDate(doc.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${
                              doc.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : doc.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {doc.status.charAt(0).toUpperCase() +
                              doc.status.slice(1)}
                          </span>
                          {doc.status === 'completed' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  downloadData(doc.parsed_data, 'json')
                                }
                                className="text-sm text-blue-600 hover:text-blue-500"
                              >
                                JSON
                              </button>
                              <button
                                onClick={() =>
                                  downloadData(doc.parsed_data, 'csv')
                                }
                                className="text-sm text-blue-600 hover:text-blue-500"
                              >
                                CSV
                              </button>
                              <button
                                onClick={() =>
                                  downloadData(doc.parsed_data, 'xlsx')
                                }
                                className="text-sm text-blue-600 hover:text-blue-500"
                              >
                                XLSX
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {doc.verification_status !== 'verified' &&
                        doc.status === 'completed' && (
                          <div className="mt-2">
                            <p className="text-sm text-yellow-600">
                              ⚠️ AI results require verification. Please review
                              the extracted data.
                            </p>
                          </div>
                        )}
                    </div>
                  </li>
                ))}
                {documents?.length === 0 && (
                  <li>
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-500">
                        No documents uploaded yet.
                      </p>
                      <div className="mt-4">
                        <Link
                          href="/dashboard"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Upload a document
                        </Link>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
