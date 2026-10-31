import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Touchpad, Map, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Touchpad, label: "Interactions", href: "/interactions" },
  { icon: Map, label: "Zone Analytics", href: "/zones" },
  { icon: Video, label: "Video Insights", href: "/video" },
];

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <div className={cn("flex items-center gap-2 font-bold text-xl text-primary transition-opacity", collapsed && "opacity-0 hidden")}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            D
          </div>
          <span className="text-gray-900 tracking-tight">DecaLens</span>
        </div>
        {collapsed && (
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white mx-auto">
            D
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className={cn(isActive ? "text-blue-600" : "text-gray-500")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2"><ChevronLeft size={18} /> <span className="text-xs">Collapse</span></div>}
        </Button>
      </div>
    </aside>
  );
}

