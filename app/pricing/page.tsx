import Link from 'next/link';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    price: '0',
    features: [
      '50 pages per month',
      'Basic AI parsing',
      'CSV export',
      'Email support'
    ],
    description: 'Get started with basic statement parsing.',
    href: '/signin',
    cta: 'Start for free',
    mostPopular: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    price: '29',
    features: [
      '500 pages per month',
      'Dual AI verification',
      'Priority processing',
      'CSV, JSON, XLSX exports',
      'Priority email support',
      'API access'
    ],
    description: 'Perfect for businesses with regular parsing needs.',
    href: '/signin',
    cta: 'Get started',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: '99',
    features: [
      'Unlimited pages',
      'Dual AI verification',
      'Custom AI model training',
      'All export formats',
      'Dedicated support',
      'API access',
      'Custom integrations',
      'SSO & team management'
    ],
    description: 'For organizations with high-volume requirements.',
    href: '/signin',
    cta: 'Contact sales',
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PricingPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for businesses of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose the perfect plan for your needs. All plans include unlimited secure storage.
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h2
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h2>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">${tier.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                  'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              <div className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  How accurate is the AI parsing?
                </dt>
                <dd className="mt-3 text-base leading-7 text-gray-600">
                  Our dual AI verification system achieves over 99% accuracy by cross-referencing results from two independent AI models. In case of any discrepancies, you'll be notified to review the results manually.
                </dd>
              </div>
              <div className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  What file formats are supported?
                </dt>
                <dd className="mt-3 text-base leading-7 text-gray-600">
                  We support PDF bank statements and scanned images (JPG, PNG). The AI models can process both digital PDFs and scanned documents with high accuracy.
                </dd>
              </div>
              <div className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  How secure is my data?
                </dt>
                <dd className="mt-3 text-base leading-7 text-gray-600">
                  We use enterprise-grade encryption for all uploaded files and processed data. Your documents are stored in secure cloud storage with strict access controls, and we never share your data with third parties.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
