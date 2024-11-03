import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import AuthForm from "@/app/(site)/_components/AuthForm";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[90%]  sm:w-[400px] md:w-[450px] min-h-[450px] ">
        <CardHeader className="flex items-center gap-4 flex-col justify-center bg-gray-100 mb-3">
          <Image
            src="facebook-messenger-icon.svg"
            alt="messenger-icon"
            width={50}
            height={50}
            className="translate-y-1"
          />
          <p className="text-2xl font-bold">Sign In to your account</p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading</div>}>
            <AuthForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
