import { Minimize2, Maximize2, X } from "lucide-react";

export function Header() {
  return (
    <div
      data-tauri-drag-region
      className="h-10 flex items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center gap-2" data-tauri-drag-region>
        <span className="text-sm text-muted-foreground">
          Claude Code Desktop
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
          <Minimize2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
