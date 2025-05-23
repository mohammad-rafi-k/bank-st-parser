import Link from 'next/link';
import GoogleSignInButton from '@/app/components/google-sign-in-button';
import EmailSignInForm from '@/app/components/email-sign-in-form';

export default function SignIn({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    {searchParams?.message && (
                        <div className="mt-3 text-center text-sm">
                            <p className="text-green-600">{searchParams.message}</p>
                        </div>
                    )}
                    {searchParams?.error && (
                        <div className="mt-3 text-center text-sm">
                            <p className="text-red-600">{searchParams.error}</p>
                        </div>
                    )}
                </div>

                <EmailSignInForm />

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <GoogleSignInButton />
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/signup"
                        className="font-medium text-indigo-600 hover:text-indigo-500">
                        Don&#39;t have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
