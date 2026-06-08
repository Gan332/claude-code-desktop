import { useEffect } from "react";
import {
  Plus,
  FolderOpen,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";
import { useSessionStore } from "@/stores/sessionStore";
import { useProjectStore } from "@/stores/projectStore";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { sessions, activeSessionId, setActiveSession, createSession } =
    useSessionStore();
  const { projects, loadProjects } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNewSession = async () => {
    if (projects.length > 0) {
      await createSession(projects[0].path);
    }
  };

  return (
    <div className="w-64 h-full bg-secondary/30 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">Claude Code</span>
        </div>
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sessions
          </div>
          {sessions.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No sessions yet
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors",
                  activeSessionId === session.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <div className="text-sm font-medium truncate">
                    {session.projectName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.messages.length} messages
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border">
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Projects
          </div>
          {projects.map((project) => (
            <button
              key={project.path}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left hover:bg-accent/50 transition-colors"
            >
              <FolderOpen className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <div className="text-sm font-medium truncate">
                  {project.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {project.sessionCount} sessions
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
