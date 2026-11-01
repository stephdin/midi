import type { ReactNode } from "react";
import { Activity, PlugZap, Route, type LucideIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Screen = "performance" | "routing" | "configuration";

const screens: { id: Screen; label: string; icon: LucideIcon }[] = [
  { id: "performance", label: "Performance", icon: Activity },
  { id: "routing", label: "Routing", icon: Route },
  { id: "configuration", label: "Configuration", icon: PlugZap },
];

type Props = {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  status: ReactNode;
  children: ReactNode;
};

export function Shell({ screen, onNavigate, status, children }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-wider">MIDI Patcher</h1>
        {status}
      </div>
      <Tabs value={screen} onValueChange={(v) => onNavigate(v as Screen)}>
        <TabsList variant="line" className="w-full justify-start border-b">
          {screens.map(({ id, label, icon: ScreenIcon }) => (
            <TabsTrigger key={id} value={id} className="flex-none px-3">
              <ScreenIcon />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="pt-8">{children}</div>
    </div>
  );
}
