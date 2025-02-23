"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  TrendingUp,
  PieChart,
  Briefcase,
  BarChart2,
  Settings,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Markets", href: "/markets", icon: TrendingUp },
  // { name: "Watchlist", href: "/watchlist", icon: PieChart },

  // { name: "AI Insights", href: "/ai-insights", icon: BarChart2 },
  { name: "Comparison", href: "/comparison", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-background lg:block lg:w-60">
      <ScrollArea className="h-full py-2">
        <div className="space-y-4 py-4">
          {sidebarItems.map((item) => (
            <div key={item.name} className="px-3 py-2">
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-muted"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
