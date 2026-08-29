import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';
import { api } from '../api/apiClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  setActiveProject: (project: Project | null) => void;
  fetchProjects: () => Promise<void>;
  createProject: (name: string, key: string, description?: string) => Promise<Project | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    const saved = localStorage.getItem('task_active_project');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const handleSetActiveProject = (project: Project | null) => {
    setActiveProject(project);
    if (project) {
      localStorage.setItem('task_active_project', JSON.stringify(project));
    } else {
      localStorage.removeItem('task_active_project');
    }
  };

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await api.get<Project[]>('/projects');
      if (res.success && res.data) {
        setProjects(res.data);

        // Validasi & Sinkronisasi activeProject dengan data DB terbaru
        if (res.data.length === 0) {
          handleSetActiveProject(null);
        } else if (!activeProject) {
          handleSetActiveProject(res.data[0]);
        } else {
          // Cari apakah active project di local storage masih ada di daftar project DB
          const current = res.data.find((p) => p._id === activeProject._id);
          if (current) {
            handleSetActiveProject(current);
          } else {
            // Jika ID project kadaluarsa (DB baru / di-reset), otomatis ganti ke project pertama yang valid
            handleSetActiveProject(res.data[0]);
          }
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat daftar project', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProject, showToast]);

  const createProject = async (name: string, key: string, description?: string): Promise<Project | null> => {
    try {
      const res = await api.post<Project>('/projects', { name, key, description });
      if (res.success && res.data) {
        showToast(`Project ${res.data.name} [${res.data.key}] berhasil dibuat!`, 'success');
        await fetchProjects();
        handleSetActiveProject(res.data);
        return res.data;
      }
      return null;
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat project', 'error');
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setProjects([]);
      handleSetActiveProject(null);
    }
  }, [isAuthenticated]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        isLoading,
        setActiveProject: handleSetActiveProject,
        fetchProjects,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
