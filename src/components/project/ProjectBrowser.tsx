import { useEffect } from "react";
import { FolderOpen, RefreshCw } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useSessionStore } from "@/stores/sessionStore";

export function ProjectBrowser() {
  const { projects, isLoading, loadProjects, selectProject } =
    useProjectStore();
  const { createSession } = useSessionStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleOpenProject = async (path: string) => {
    selectProject(path);
    await createSession(path);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold">Projects</h2>
        <button
          onClick={loadProjects}
          disabled={isLoading}
          className="p-2 rounded-md hover:bg-accent transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No projects found</p>
            <p className="text-xs mt-1">
              Projects from ~/.claude/projects will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {projects.map((project) => (
              <button
                key={project.path}
                onClick={() => handleOpenProject(project.path)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-accent transition-colors"
              >
                <FolderOpen className="w-5 h-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {project.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {project.sessionCount} sessions
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
