'use client'

import Image from 'next/image'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <Image
                src="/logo_original_noLabel.png"
                alt="Nuristani Cultural Foundation"
                width={100}
                height={100}
                className="mx-auto"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Application Error
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                A critical error has occurred. Please try refreshing the page.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={reset}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}