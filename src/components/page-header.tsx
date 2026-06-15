import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  badges: { text: string; color: string; live?: boolean }[];
  title: string;
  description: string;
}

export function PageHeader({ badges, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {badges.map((b) => (
          <Badge
            key={b.text}
            style={{ backgroundColor: b.color, color: "#fff" }}
            className="text-[10px] uppercase tracking-wider"
          >
            {b.live && (
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            )}
            {b.text}
          </Badge>
        ))}
      </div>
      <h1 className="text-2xl font-bold tracking-tight gradient-text">{title}</h1>
      <div className="accent-bar mt-2" />
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
