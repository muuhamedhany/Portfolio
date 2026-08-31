import type { Project } from '@/sections/projects/projectsData';
import { PROJECTS as STATIC_PROJECTS } from '@/sections/projects/projectsData';

export interface AuthUser {
  email: string;
  name?: string;
  picture?: string;
  isAdmin: boolean;
}

export async function fetchProjectsApi(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.projects) && data.projects.length > 0) {
      return data.projects;
    }
    return STATIC_PROJECTS;
  } catch (err) {
    console.warn('Could not fetch projects from API, falling back to static data:', err);
    return STATIC_PROJECTS;
  }
}

export async function createProjectApi(project: Partial<Project>): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create project');
  }
  return data.project;
}

export async function updateProjectApi(id: string, project: Partial<Project>): Promise<Project> {
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update project');
  }
  return data.project;
}

export async function deleteProjectApi(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete project');
  }
}

export async function loginWithGoogleApi(credential: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Google login failed');
  }
  return data.user;
}

export async function checkAuthStatusApi(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const data = await res.json();
    return data.authenticated ? data.user : null;
  } catch {
    return null;
  }
}

export async function logoutApi(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}
