import { Mail, Phone, Globe, Building, Wallet, User } from "lucide-react";

interface ExtendedInfoProps {
  type: string;
  value: string;
}

export default function ExtendedInfo({ type, value }: ExtendedInfoProps) {
  const getExtendedInfo = () => {
    switch (type) {
      case "email_address":
        const domain = value.split("@")[1] || "";
        return {
          icon: <Mail className="w-5 h-5" />,
          title: "Thông tin Email",
          items: [
            { label: "Email", value: value },
            { label: "Tên miền", value: domain },
            {
              label: "Loại",
              value:
                domain.includes("gmail") || domain.includes("yahoo")
                  ? "Email cá nhân"
                  : "Email tổ chức",
            },
          ],
        };

      case "phone":
        const prefix = value.substring(0, 4);
        let carrier = "Không xác định";
        if (prefix.startsWith("09")) carrier = "Viettel/Mobifone/Vinaphone";
        else if (prefix.startsWith("08")) carrier = "Viettel/Vinaphone";
        else if (prefix.startsWith("07")) carrier = "Mobifone/Vietnamobile";

        return {
          icon: <Phone className="w-5 h-5" />,
          title: "Thông tin Số điện thoại",
          items: [
            { label: "Số điện thoại", value: value },
            { label: "Đầu số", value: prefix },
            { label: "Nhà mạng", value: carrier },
          ],
        };

      case "website":
        try {
          const url = new URL(
            value.startsWith("http") ? value : `http://${value}`
          );
          return {
            icon: <Globe className="w-5 h-5" />,
            title: "Thông tin Website",
            items: [
              { label: "URL", value: value },
              { label: "Tên miền", value: url.hostname },
              { label: "Giao thức", value: url.protocol.replace(":", "") },
            ],
          };
        } catch {
          return {
            icon: <Globe className="w-5 h-5" />,
            title: "Thông tin Website",
            items: [{ label: "URL", value: value }],
          };
        }

      case "bank_account":
        return {
          icon: <Building className="w-5 h-5" />,
          title: "Thông tin Tài khoản Ngân hàng",
          items: [
            { label: "Số tài khoản", value: value },
            { label: "Loại", value: "Tài khoản ngân hàng" },
          ],
        };

      case "e_wallet":
        return {
          icon: <Wallet className="w-5 h-5" />,
          title: "Thông tin Ví điện tử",
          items: [
            { label: "Tài khoản", value: value },
            { label: "Loại", value: "Ví điện tử" },
          ],
        };

      case "person_org":
        return {
          icon: <User className="w-5 h-5" />,
          title: "Thông tin Cá nhân/Tổ chức",
          items: [
            { label: "Tên", value: value },
            { label: "Loại", value: "Cá nhân/Tổ chức" },
          ],
        };

      default:
        return {
          icon: <User className="w-5 h-5" />,
          title: "Thông tin mở rộng",
          items: [{ label: "Giá trị", value: value }],
        };
    }
  };

  const info = getExtendedInfo();

  return (
    <div className="p-4 mb-5 bg-white/80 backdrop-blur-sm border border-white/50 shadow-md rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-sm">
          <div className="text-white drop-shadow">{info.icon}</div>
        </div>
        <h3 className="text-base font-bold text-gray-800">{info.title}</h3>
      </div>
      <div className="space-y-2">
        {info.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-1.5 p-2.5 bg-gray-50 rounded-lg"
          >
            <span className="text-xs font-semibold text-gray-600 min-w-[100px]">
              {item.label}:
            </span>
            <span className="text-sm text-gray-800 font-medium break-all">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
