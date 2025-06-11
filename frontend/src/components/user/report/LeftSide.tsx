import { ShieldAlert } from "lucide-react";
interface FAQItem {
  q: string;
  a: string;
}

interface Props {
  FAQS: FAQItem[];
}
export default function LeftSide({ FAQS }: Props) {
  return (
    <>
      <div className="hidden w-full md:block md:w-1/3">
        <div className="p-5 bg-white border border-gray-100 shadow rounded-2xl">
          <h2 className="text-lg font-bold mb-4 text-[#e53935] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#e53935]" />
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4 text-sm">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="">
                <p className="mb-1 font-semibold text-gray-800">{faq.q}</p>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
