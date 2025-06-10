interface DetailHeaderProps {
  value: string;
  type: string;
}

export default function DetailHeader({ value, type }: DetailHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#e53935]">Chi tiết đối tượng</h1>
      <p className="mt-2 text-gray-700">Loại: {type.replace(/_/g, " ")}</p>
      <p className="mt-1 font-semibold text-gray-900 break-all">
        Giá trị: {value}
      </p>
    </div>
  );
}
