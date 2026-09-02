import type { Project } from '@/sections/projects/projectsData';
import { PROJECTS as STATIC_PROJECTS } from '@/sections/projects/projectsData';
import { getMediaUrl } from '@/lib/utils/media';

export interface AuthUser {
  email: string;
  name?: string;
  picture?: string;
  isAdmin: boolean;
}

export function normalizeProjectMedia(project: Project): Project {
  if (!project) return project;
  return {
    ...project,
    previewImage: project.previewImage
      ? {
          ...project.previewImage,
          src: getMediaUrl(project.previewImage.src),
        }
      : undefined,
    previewVideo: project.previewVideo
      ? {
          ...project.previewVideo,
          src: getMediaUrl(project.previewVideo.src),
          poster: project.previewVideo.poster ? getMediaUrl(project.previewVideo.poster) : undefined,
        }
      : undefined,
    galleryImages: project.galleryImages?.map((img) => ({
      ...img,
      src: getMediaUrl(img.src),
    })),
  };
}

export async function fetchProjectsApi(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.projects) && data.projects.length > 0) {
      return data.projects.map(normalizeProjectMedia);
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
  return normalizeProjectMedia(data.project);
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
  return normalizeProjectMedia(data.project);
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

export async function loginWithGoogleApi(token: string, isAccessToken: boolean = false): Promise<AuthUser> {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(isAccessToken ? { accessToken: token } : { credential: token }),
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
