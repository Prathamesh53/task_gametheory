import ErrorBoundary from "@/components/Error/Boundary";
import Loader from "@/components/Loader/Loader";
import React, { Suspense } from "react";
const Card = React.lazy(() => import("@/components/Card"));

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-800 h-[calc(100dvh-60px)]">
      <div className="w-full text-gray-800 dark:text-white text-center flex-col gap-3 pb-8">
        <h1 className=" pt-8 pb-2 text-6xl font-bold">BookMyGround</h1>
        <p className=" text-gray-500 text-center">An court booking plateform</p>
      </div>
      <div className="flex h-4/5">
        <div className="w-1/2">
          <Suspense fallback={<Loader />}>
            <ErrorBoundary>
              <Card
                data={{
                  route: "/main",
                  bg: "bg-blue-800",
                  imageClass: "scale-[1.5]",
                  src: "/customer.png",
                  text: "User",
                  supported: "Rent a Court",
                }}
              />
            </ErrorBoundary>
                <ErrorBoundary>
                  <Card
                    data={{
                      route: "/admin",
                      bg: "bg-gray-400",
                      imageClass: "scale-[1.75]",
                      src: "/admin.png",
                      text: "Captain",
                      supported: "Add courts",
                    }}
                  />
                </ErrorBoundary>
          </Suspense>
        </div>
        <div className="w-1/2 h-full relative">
          <img className="w-full h-full absolute" src="/playground.png" />
        </div>
      </div>
    </main>
  );
}
