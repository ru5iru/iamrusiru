import { Info, AlertTriangle, Lightbulb } from "lucide-react";

interface CalloutBlockProps {
  variant: "info" | "warning" | "tip";
  text: string;
}

const variantConfig = {
  info: {
    border: "border-blue-500",
    icon: Info,
    iconColor: "text-blue-500",
    label: "Information",
  },
  warning: {
    border: "border-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    label: "Warning",
  },
  tip: {
    border: "border-green-500",
    icon: Lightbulb,
    iconColor: "text-green-500",
    label: "Tip",
  },
} as const;

const CalloutBlock = ({ variant, text }: CalloutBlockProps) => {
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;
  return (
    <div
      role="note"
      aria-label={cfg.label}
      className={`my-6 flex gap-3 rounded-r-lg border-l-4 ${cfg.border} bg-muted/50 p-4`}
    >
      <Icon size={20} className={`${cfg.iconColor} flex-shrink-0 mt-0.5`} aria-hidden="true" />
      <p className="text-foreground text-base leading-relaxed m-0">{text}</p>
    </div>
  );
};

export default CalloutBlock;
