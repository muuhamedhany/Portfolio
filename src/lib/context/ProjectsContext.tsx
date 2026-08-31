import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Project } from '@/sections/projects/projectsData';
import { PROJECTS as STATIC_PROJECTS } from '@/sections/projects/projectsData';
import {
  fetchProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from '@/lib/api/projects';

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  editingProject: Project | null;
  isDrawerOpen: boolean;
  refreshProjects: () => Promise<void>;
  openCreateDrawer: () => void;
  openEditDrawer: (project: Project) => void;
  closeDrawer: () => void;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjectsApi();
      if (data && data.length > 0) {
        setProjects(data);
      }
    } catch (err) {
      console.warn('Failed to refresh projects from cloud:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const openCreateDrawer = () => {
    setEditingProject(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (project: Project) => {
    setEditingProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProject(null);
  };

  const createProject = async (data: Partial<Project>): Promise<Project> => {
    const newProj = await createProjectApi(data);
    await refreshProjects();
    return newProj;
  };

  const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
    const updated = await updateProjectApi(id, data);
    await refreshProjects();
    return updated;
  };

  const deleteProject = async (id: string): Promise<void> => {
    await deleteProjectApi(id);
    await refreshProjects();
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        editingProject,
        isDrawerOpen,
        refreshProjects,
        openCreateDrawer,
        openEditDrawer,
        closeDrawer,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
