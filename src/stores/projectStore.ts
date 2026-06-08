import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";

export interface Project {
  name: string;
  path: string;
  sessionCount: number;
  lastModified: string | null;
}

interface ProjectState {
  projects: Project[];
  selectedProject: string | null;
  isLoading: boolean;

  loadProjects: () => Promise<void>;
  selectProject: (path: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await invoke<Project[]>("list_projects");
      set({ projects, isLoading: false });
    } catch (error) {
      console.error("Failed to load projects:", error);
      set({ isLoading: false });
    }
  },

  selectProject: (path: string) => {
    set({ selectedProject: path });
  },
}));
