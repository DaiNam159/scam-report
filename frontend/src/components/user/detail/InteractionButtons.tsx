import { Plus, Copy, Share2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface InteractionButtonsProps {
  value: string;
  type: string;
}

export default function InteractionButtons({
  value,
  type,
}: InteractionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cảnh báo lừa đảo - ${value}`,
          text: `Đối tượng lừa đảo: ${value}`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Đã sao chép link!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5">
      <a
        href="/bao-cao"
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-md hover:scale-105"
      >
        <Plus className="w-4 h-4" />
        Gửi báo cáo mới
      </a>

      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:scale-105"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Đã sao chép!" : "Sao chép"}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-white transition-all rounded-lg shadow-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-md hover:scale-105"
      >
        <Share2 className="w-4 h-4" />
        Chia sẻ
      </button>
    </div>
  );
}
