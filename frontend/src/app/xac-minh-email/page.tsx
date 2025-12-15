import { Suspense } from "react";
import VerifyEmailComponent from "@/components/common/EmailVerifyPage";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Đang xác minh email...</div>}
    >
      <VerifyEmailComponent />
    </Suspense>
  );
}
