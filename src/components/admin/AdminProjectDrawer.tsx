import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Save,
  Trash2,
  Plus,
  Layers,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  Loader2,
  Check,
} from 'lucide-react';
import { useProjects } from '@/lib/context/ProjectsContext';
import type {
  Project,
  ProjectCategory,
  ProjectStackGroup,
  ProjectStackIcon,
  ProjectLink,
  ProjectGalleryImage,
} from '@/sections/projects/projectsData';

const CATEGORIES: ProjectCategory[] = ['mobile & full-stack', 'web', 'design'];
const STACK_ICONS: ProjectStackIcon[] = [
  'frontend',
  'backend',
  'mobile',
  'web',
  'deploy',
  'design',
  'portal',
  'publish',
];

export function AdminProjectDrawer() {
  const { isDrawerOpen, editingProject, closeDrawer, createProject, updateProject, deleteProject } =
    useProjects();

  const [activeTab, setActiveTab] = useState<'info' | 'stack' | 'media' | 'links'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [id, setId] = useState('');
  const [index, setIndex] = useState('01');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('web');
  const [shortBlurb, setShortBlurb] = useState('');
  const [blurb, setBlurb] = useState('');
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [note, setNote] = useState('');

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Stack Groups
  const [stackGroups, setStackGroups] = useState<ProjectStackGroup[]>([]);

  // Links
  const [links, setLinks] = useState<ProjectLink[]>([]);

  // Media
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const [previewImageAlt, setPreviewImageAlt] = useState('');
  const [previewVideoSrc, setPreviewVideoSrc] = useState('');
  const [previewVideoTitle, setPreviewVideoTitle] = useState('');
  const [galleryImages, setGalleryImages] = useState<ProjectGalleryImage[]>([]);

  useEffect(() => {
    if (editingProject) {
      setId(editingProject.id || editingProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      setIndex(editingProject.index || '01');
      setName(editingProject.name || '');
      setCategory(editingProject.category || 'web');
      setShortBlurb(editingProject.shortBlurb || '');
      setBlurb(editingProject.blurb || '');
      setFeatured(Boolean(editingProject.featured));
      setSortOrder(editingProject.sortOrder ?? (parseInt(editingProject.index) || 1));
      setNote(editingProject.note || '');
      setTags(editingProject.tags || []);
      setStackGroups(editingProject.stackGroups || []);
      setLinks(editingProject.links || []);
      setPreviewImageSrc(editingProject.previewImage?.src || '');
      setPreviewImageAlt(editingProject.previewImage?.alt || '');
      setPreviewVideoSrc(editingProject.previewVideo?.src || '');
      setPreviewVideoTitle(editingProject.previewVideo?.title || '');
      setGalleryImages(editingProject.galleryImages || []);
    } else {
      // Defaults for new project
      setId(`proj-${Date.now()}`);
      setIndex('07');
      setName('');
      setCategory('web');
      setShortBlurb('');
      setBlurb('');
      setFeatured(false);
      setSortOrder(7);
      setNote('');
      setTags([]);
      setStackGroups([
        {
          label: 'Frontend Core',
          icon: 'frontend',
          items: [{ name: 'React 19', shortName: 'React' }],
        },
      ]);
      setLinks([{ label: 'Live', href: '', icon: 'live' }]);
      setPreviewImageSrc('');
      setPreviewImageAlt('');
      setPreviewVideoSrc('');
      setPreviewVideoTitle('');
      setGalleryImages([]);
    }
    setError(null);
    setShowDeleteConfirm(false);
    setActiveTab('info');
  }, [editingProject, isDrawerOpen]);

  if (!isDrawerOpen) return null;

  // Tag helper
  const addTag = () => {
    const val = newTagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setNewTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  // Stack helper
  const addStackGroup = () => {
    setStackGroups([
      ...stackGroups,
      {
        label: 'New Group',
        icon: 'frontend',
        items: [{ name: 'Technology', shortName: 'Tech' }],
      },
    ]);
  };

  const updateStackGroup = (index: number, updated: Partial<ProjectStackGroup>) => {
    const next = [...stackGroups];
    next[index] = { ...next[index], ...updated };
    setStackGroups(next);
  };

  const removeStackGroup = (index: number) => {
    setStackGroups(stackGroups.filter((_, i) => i !== index));
  };

  const addStackItem = (groupIndex: number) => {
    const group = stackGroups[groupIndex];
    updateStackGroup(groupIndex, {
      items: [...group.items, { name: 'Item', shortName: 'Item' }],
    });
  };

  const updateStackItem = (groupIndex: number, itemIndex: number, field: 'name' | 'shortName', val: string) => {
    const group = stackGroups[groupIndex];
    const items = [...group.items];
    items[itemIndex] = { ...items[itemIndex], [field]: val };
    updateStackGroup(groupIndex, { items });
  };

  const removeStackItem = (groupIndex: number, itemIndex: number) => {
    const group = stackGroups[groupIndex];
    updateStackGroup(groupIndex, {
      items: group.items.filter((_, i) => i !== itemIndex),
    });
  };

  // Links helper
  const addLink = () => {
    setLinks([...links, { label: 'GitHub', href: '', icon: 'github' }]);
  };

  const updateLink = (index: number, updated: Partial<ProjectLink>) => {
    const next = [...links];
    next[index] = { ...next[index], ...updated };
    setLinks(next);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Gallery helper
  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, { src: '', alt: 'Gallery Image', title: '' }]);
  };

  const updateGalleryImage = (index: number, updated: Partial<ProjectGalleryImage>) => {
    const next = [...galleryImages];
    next[index] = { ...next[index], ...updated };
    setGalleryImages(next);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setIsSaving(true);
    setError(null);

    const projectPayload: Partial<Project> = {
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      index,
      name,
      category,
      shortBlurb,
      blurb,
      tags,
      stackGroups,
      links,
      previewImage: previewImageSrc ? { src: previewImageSrc, alt: previewImageAlt || name } : undefined,
      previewVideo: previewVideoSrc ? { src: previewVideoSrc, title: previewVideoTitle || name, type: 'video/mp4' } : undefined,
      galleryImages,
      featured,
      note: note || undefined,
      sortOrder: Number(sortOrder),
    };

    try {
      if (editingProject && editingProject.id) {
        await updateProject(editingProject.id, projectPayload);
      } else {
        await createProject(projectPayload);
      }
      closeDrawer();
    } catch (err: any) {
      setError(err.message || 'Failed to save project to Neon database.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!editingProject || !editingProject.id) return;
    setIsDeleting(true);
    try {
      await deleteProject(editingProject.id);
      closeDrawer();
    } catch (err: any) {
      setError(err.message || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l-2 border-[var(--pixel-frame)] bg-card shadow-[-8px_0_32px_rgba(0,0,0,0.8)]"
          style={{
            boxShadow:
              'inset 2px 0 0 var(--pixel-edge-light), -8px 0 32px rgba(0,0,0,0.9)',
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b-2 border-border p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center border border-[var(--pixel-frame)] bg-[var(--pixel-active)] font-mono text-xs font-bold text-white shadow-[1px_1px_0_var(--pixel-shadow)]">
                {index}
              </span>
              <div>
                <h3 className="font-display text-2xl tracking-wide text-foreground">
                  {editingProject ? 'EDIT PROJECT' : 'NEW PROJECT'}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  NEON DATABASE CMS
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="flex h-8 w-8 items-center justify-center border border-[var(--pixel-frame)] bg-background text-foreground transition-colors hover:bg-[var(--pixel-active)] hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-background/50 px-5">
            {[
              { id: 'info', label: 'GENERAL INFO', icon: FileText },
              { id: 'stack', label: 'TECH STACK', icon: Layers },
              { id: 'links', label: 'LINKS', icon: LinkIcon },
              { id: 'media', label: 'MEDIA & ASSETS', icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[var(--accent-to)] text-[var(--accent-to)]'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: GENERAL INFO */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Index (e.g. 01)
                    </label>
                    <input
                      type="text"
                      value={index}
                      onChange={(e) => setIndex(e.target.value)}
                      className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-[var(--accent-to)] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nokhba, CarKit"
                      className="w-full border-2 border-border bg-background px-3 py-2 font-sans text-sm font-semibold text-foreground focus:border-[var(--accent-to)] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                      className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-[var(--accent-to)] focus:outline-none uppercase"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Sort Order / Priority
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full border-2 border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-[var(--accent-to)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Short Blurb (1-2 Sentences Value Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={shortBlurb}
                    onChange={(e) => setShortBlurb(e.target.value)}
                    placeholder="Concise business-first description..."
                    className="w-full border-2 border-border bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-[var(--accent-to)] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Full Blurb / In-Depth Case Details
                  </label>
                  <textarea
                    rows={4}
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                    placeholder="Full case details..."
                    className="w-full border-2 border-border bg-background px-3 py-2 font-sans text-xs text-foreground focus:border-[var(--accent-to)] focus:outline-none"
                    required
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-3 border border-border bg-background/50 p-3">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 accent-[var(--accent-to)] cursor-pointer"
                  />
                  <label
                    htmlFor="featured-checkbox"
                    className="font-mono text-xs uppercase tracking-wider text-foreground cursor-pointer"
                  >
                    FEATURED PROJECT (HIGHLIGHT IN HERO/SHOWCASE)
                  </label>
                </div>

                {/* Tags Editor */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Tags (Technologies / Topics)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add a tag e.g. React 19..."
                      className="flex-1 border-2 border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-[var(--accent-to)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] px-3 py-1.5 font-mono text-xs text-white uppercase"
                    >
                      ADD
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 border border-border bg-card px-2 py-1 font-mono text-[10px] text-foreground"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="text-muted-foreground hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TECH STACK GROUPS */}
            {activeTab === 'stack' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    PROJECT ARCHITECTURE STACKS
                  </span>
                  <button
                    type="button"
                    onClick={addStackGroup}
                    className="flex items-center gap-1 border border-border bg-background px-2.5 py-1 font-mono text-[10px] uppercase text-[var(--accent-to)] hover:border-[var(--accent-to)]"
                  >
                    <Plus className="h-3 w-3" /> ADD GROUP
                  </button>
                </div>

                {stackGroups.map((group, gIdx) => (
                  <div key={gIdx} className="border-2 border-border bg-background/50 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div>
                          <label className="block font-mono text-[9px] uppercase text-muted-foreground mb-1">
                            Group Label
                          </label>
                          <input
                            type="text"
                            value={group.label}
                            onChange={(e) => updateStackGroup(gIdx, { label: e.target.value })}
                            className="w-full border border-border bg-background px-2 py-1 font-mono text-xs text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase text-muted-foreground mb-1">
                            Icon Role
                          </label>
                          <select
                            value={group.icon}
                            onChange={(e) =>
                              updateStackGroup(gIdx, { icon: e.target.value as ProjectStackIcon })
                            }
                            className="w-full border border-border bg-background px-2 py-1 font-mono text-xs text-foreground uppercase"
                          >
                            {STACK_ICONS.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeStackGroup(gIdx)}
                        className="text-muted-foreground hover:text-red-400 p-1"
                        title="Delete Group"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Group Items */}
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase text-muted-foreground">
                          CHIPS / ITEMS
                        </span>
                        <button
                          type="button"
                          onClick={() => addStackItem(gIdx)}
                          className="font-mono text-[9px] uppercase text-[var(--accent-to)] hover:underline"
                        >
                          + ADD CHIP
                        </button>
                      </div>

                      {group.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateStackItem(gIdx, iIdx, 'name', e.target.value)}
                            placeholder="Full Name (e.g. Next.js 16)"
                            className="flex-1 border border-border bg-card px-2 py-1 font-mono text-[11px] text-foreground"
                          />
                          <input
                            type="text"
                            value={item.shortName || ''}
                            onChange={(e) => updateStackItem(gIdx, iIdx, 'shortName', e.target.value)}
                            placeholder="Chip (e.g. Next 16)"
                            className="w-24 border border-border bg-card px-2 py-1 font-mono text-[11px] text-foreground"
                          />
                          <button
                            type="button"
                            onClick={() => removeStackItem(gIdx, iIdx)}
                            className="text-muted-foreground hover:text-red-400 px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: LINKS */}
            {activeTab === 'links' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    PROJECT EXTERNAL LINKS
                  </span>
                  <button
                    type="button"
                    onClick={addLink}
                    className="flex items-center gap-1 border border-border bg-background px-2.5 py-1 font-mono text-[10px] uppercase text-[var(--accent-to)] hover:border-[var(--accent-to)]"
                  >
                    <Plus className="h-3 w-3" /> ADD LINK
                  </button>
                </div>

                {links.map((link, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-2 border border-border bg-background p-3">
                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(lIdx, { icon: e.target.value as any })}
                      className="border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground uppercase"
                    >
                      <option value="live">LIVE WEB</option>
                      <option value="github">GITHUB</option>
                      <option value="behance">BEHANCE</option>
                    </select>

                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLink(lIdx, { label: e.target.value })}
                      placeholder="Label (e.g. Live / App / Admin)"
                      className="w-24 border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground"
                    />

                    <input
                      type="url"
                      value={link.href}
                      onChange={(e) => updateLink(lIdx, { href: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 border border-border bg-card px-2 py-1.5 font-mono text-xs text-foreground"
                    />

                    <button
                      type="button"
                      onClick={() => removeLink(lIdx)}
                      className="text-muted-foreground hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: MEDIA & ASSETS */}
            {activeTab === 'media' && (
              <div className="space-y-5">
                {/* Preview Image */}
                <div className="border border-border bg-background p-4 space-y-3">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-to)]">
                    PRIMARY PREVIEW IMAGE
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-muted-foreground mb-1">
                      Image URL / Path (Cloudflare R2 or /projects/...)
                    </label>
                    <input
                      type="text"
                      value={previewImageSrc}
                      onChange={(e) => setPreviewImageSrc(e.target.value)}
                      placeholder="/projects/Nokhba-Hero.png"
                      className="w-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-muted-foreground mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={previewImageAlt}
                      onChange={(e) => setPreviewImageAlt(e.target.value)}
                      placeholder="Screenshot preview..."
                      className="w-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                    />
                  </div>
                </div>

                {/* Preview Video (Optional) */}
                <div className="border border-border bg-background p-4 space-y-3">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-to)]">
                    PREVIEW VIDEO (OPTIONAL)
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-muted-foreground mb-1">
                      Video MP4 URL
                    </label>
                    <input
                      type="text"
                      value={previewVideoSrc}
                      onChange={(e) => setPreviewVideoSrc(e.target.value)}
                      placeholder="/projects/CarKitVid-optimized.mp4"
                      className="w-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase text-muted-foreground mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={previewVideoTitle}
                      onChange={(e) => setPreviewVideoTitle(e.target.value)}
                      placeholder="Project Demo Video"
                      className="w-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                    />
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="border border-border bg-background p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-to)]">
                      GALLERY MODAL SLIDES ({galleryImages.length})
                    </span>
                    <button
                      type="button"
                      onClick={addGalleryImage}
                      className="font-mono text-[10px] uppercase text-[var(--accent-to)] hover:underline"
                    >
                      + ADD SLIDE
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {galleryImages.map((img, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2 border border-border/70 p-2 bg-card">
                        <span className="font-mono text-[10px] text-muted-foreground w-5">{iIdx + 1}.</span>
                        <input
                          type="text"
                          value={img.src}
                          onChange={(e) => updateGalleryImage(iIdx, { src: e.target.value })}
                          placeholder="Image URL"
                          className="flex-1 border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground"
                        />
                        <input
                          type="text"
                          value={img.title || ''}
                          onChange={(e) => updateGalleryImage(iIdx, { title: e.target.value })}
                          placeholder="Slide Caption"
                          className="w-32 border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(iIdx)}
                          className="text-muted-foreground hover:text-red-400 px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Bottom Bar: Action Buttons */}
          <div className="flex items-center justify-between border-t-2 border-border p-5 bg-card">
            {editingProject ? (
              <div>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="border-2 border-red-500 bg-red-950 px-3 py-1.5 font-mono text-xs font-bold uppercase text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                    >
                      {isDeleting ? 'DELETING...' : 'CONFIRM DELETE'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 border border-red-500/40 bg-red-950/20 px-3 py-2 font-mono text-xs uppercase text-red-400 hover:border-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>DELETE</span>
                  </button>
                )}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeDrawer}
                className="border-2 border-border bg-background px-4 py-2 font-mono text-xs uppercase text-muted-foreground hover:text-foreground cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 border-2 border-[var(--pixel-frame)] bg-[var(--pixel-active)] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_var(--pixel-shadow)] hover:brightness-110 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>SAVING TO NEON...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>SAVE PROJECT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
