import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Save, X, Upload, User, BarChart3 } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import BookReaderLoader from '../components/Loaders/BookReaderLoader';
import { getAdminHeaders, authFetch } from '../utils/api';
import { buildSlugPreview, isValidSlug } from '../utils/blog';
import { useMemo } from 'react';
import {
  ContentCard, PageHeader, PrimaryButton, AdminInput, AdminSelect,
  StatCard, EmptyState, ErrorState
} from '../components/admin/ui';

interface BlogSection {
  heading: string;
  content: string;
  image: string;
  imageAlt?: string;
}

interface BlogPost {
  _id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt?: string;
  author: {
    name: string;
    email: string;
    image: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views?: number;
  likes?: number;
  publishedAt?: string;
  createdAt?: string;
  sections: BlogSection[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
  readTime?: string;
}

const emptySeo = () => ({
  metaTitle: '',
  metaDescription: '',
  keywords: [] as string[],
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: ''
});

const BlogAdmin: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalBlogs: 0, totalViews: 0, categoryStats: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = ['Technology', 'Design', 'Mobile Development', 'Web Development', 'AI/ML', 'Cybersecurity', 'Business', 'Tutorial'];

  const initialBlogState: BlogPost = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    imageAlt: '',
    author: {
      name: 'Admin User',
      email: 'admin@sosapient.com',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    category: 'Technology',
    tags: [],
    status: 'published',
    featured: false,
    sections: [
      { heading: '', content: '', image: '', imageAlt: '' }
    ],
    seo: emptySeo(),
    readTime: ''
  };

  const [listError, setListError] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('All');

  const filteredBlogs = useMemo(() => {
    let list = blogs;
    if (blogStatusFilter !== 'all') list = list.filter((b) => b.status === blogStatusFilter);
    if (blogCategoryFilter !== 'All') list = list.filter((b) => b.category === blogCategoryFilter);
    const q = blogSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        (b.author?.name || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [blogs, blogSearch, blogStatusFilter, blogCategoryFilter]);

  useEffect(() => {
    fetchBlogs();
    fetchStats();
    // Dashboard quick action: /admin/blog-admin?new=1 opens the create form
    try {
      if (new URLSearchParams(window.location.search).get('new') === '1') {
        handleNew();
      }
    } catch {
      // ignore malformed query
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save functionality for long content
  useEffect(() => {
    if (!editingBlog || !editingBlog.content) return;
    
    const autoSaveTimer = setTimeout(() => {
      // Save to localStorage as backup for very long content
      const backupData = {
        title: editingBlog.title,
        excerpt: editingBlog.excerpt,
        content: editingBlog.content,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('sosapient_blog_backup', JSON.stringify(backupData));
      console.log('Content auto-saved to localStorage');
    }, 10000); // Auto-save every 10 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [editingBlog?.content, editingBlog?.title, editingBlog?.excerpt]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setListError(null);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/blogs/admin?limit=50`);
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      if (data.success) {
        setBlogs(Array.isArray(data.data) ? data.data : []);
      } else {
        setListError(data.message || 'Failed to load blog posts.');
      }
    } catch {
      setListError('Failed to load blog posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/blogs/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch {
      // stats are optional
    }
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editingBlog) return;
    setSaveError(null);

    if (!editingBlog.title.trim() || !editingBlog.excerpt.trim() || !editingBlog.content.trim()) {
      setSaveError('Title, excerpt and content are required.');
      return;
    }
    if (!editingBlog.author?.name.trim() || !editingBlog.author?.email.trim()) {
      setSaveError('Author name and email are required.');
      return;
    }
    if (editingBlog.slug && editingBlog.slug.trim() && !isValidSlug(editingBlog.slug.trim().toLowerCase())) {
      setSaveError('Slug may contain lowercase letters, numbers and single hyphens only (max 160 characters).');
      return;
    }
    if (editingBlog.slug) {
      editingBlog.slug = editingBlog.slug.trim().toLowerCase();
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Always append tags and seo fields, even if empty - ensure we have the latest state
      const tagsToSend = Array.isArray(editingBlog.tags) ? editingBlog.tags : [];
      const seoToSend = editingBlog.seo || { metaTitle: '', metaDescription: '', keywords: [] };
      const keywordsToSend = Array.isArray(seoToSend.keywords) ? seoToSend.keywords : [];

      // Create clean SEO object with proper keywords array
      const cleanSeoToSend = {
        ...seoToSend,
        keywords: keywordsToSend
      };

      formData.append('tags', JSON.stringify(tagsToSend));
      formData.append('seo', JSON.stringify(cleanSeoToSend));
      // CSV fallbacks to improve robustness
      formData.append('tagsCsv', tagsToSend.join(','));
      formData.append('seoKeywordsCsv', keywordsToSend.join(','));

      // Only append other fields that have values and are not internal MongoDB fields
      Object.keys(editingBlog).forEach(key => {
        const value = editingBlog[key as keyof BlogPost];

        // Skip internal MongoDB fields, undefined/null values, and tags/seo/readTime (already handled above)
        if (key.startsWith('_') || key === '__v' || value === undefined || value === null || key === 'tags' || key === 'seo' || key === 'readTime') {
          return;
        }

        if (key === 'author' || key === 'sections') {
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'string' && value !== '') {
            formData.append(key, value);
          }
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== '' && typeof value === 'string') {
          formData.append(key, value);
        }
      });

      // Ensure readTime is always set, even if empty
      if (!editingBlog.readTime || editingBlog.readTime.trim() === '') {
        formData.append('readTime', calculateReadTime(editingBlog.content));
      } else {
        formData.append('readTime', editingBlog.readTime);
      }

      const url = editingBlog._id ? `${import.meta.env.VITE_BASE_URL}/api/blogs/${editingBlog._id}` : `${import.meta.env.VITE_BASE_URL}/api/blogs`;
      const method = editingBlog._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: formData as unknown as BodyInit
      });

      const data = await response.json();

      if (data.success) {
        await fetchBlogs();
        await fetchStats();
        // Clear backup on successful save
        localStorage.removeItem('sosapient_blog_backup');
        setIsEditing(false);
        setEditingBlog(null);
      } else {
        setSaveError(data.message || 'Failed to save blog post');
      }
    } catch {
      setSaveError('Network error occurred while saving the blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete?._id) return;

    try {
      setDeleting(true);
      setSaveError(null);
      const response = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/blogs/${blogToDelete._id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Update state immediately without refetching
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogToDelete._id));
        setStats(prevStats => ({
          ...prevStats,
          totalBlogs: prevStats.totalBlogs - 1
        }));
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        setSaveError(data.message || 'Failed to delete blog post');
      }
    } catch {
      setSaveError('Network error occurred while deleting the blog post');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const [slugCustomized, setSlugCustomized] = useState(false);

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog({
      ...blog,
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      sections: Array.isArray(blog.sections) ? blog.sections.map((s) => ({ heading: s.heading || '', content: s.content || '', image: s.image || '', imageAlt: s.imageAlt || '' })) : [],
      seo: { ...emptySeo(), ...(blog.seo || {}) },
      readTime: blog.readTime || calculateReadTime(blog.content)
    });
    // Existing posts already have a slug: treat as customized so title edits don't silently rewrite URLs
    setSlugCustomized(true);
    setIsEditing(true);
  };

  const handleNew = () => {
    // Check for backup content
    const backup = localStorage.getItem('sosapient_blog_backup');
    let newBlogState = {
      ...initialBlogState,
      seo: emptySeo(),
      readTime: ''
    };
    setSlugCustomized(false);
    
    if (backup) {
      try {
        const backupData = JSON.parse(backup);
        const backupTime = new Date(backupData.timestamp);
        const timeDiff = new Date().getTime() - backupTime.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        
        // If backup is less than 24 hours old and has substantial content
        if (hoursDiff < 24 && backupData.content && backupData.content.length > 100) {
          const restore = confirm(`Found unsaved content from ${backupTime.toLocaleString()}. Would you like to restore it?`);
          if (restore) {
            newBlogState = {
              ...newBlogState,
              title: backupData.title || '',
              excerpt: backupData.excerpt || '',
              content: backupData.content || ''
            };
          }
        }
      } catch (e) {
        console.error('Error parsing backup data:', e);
      }
    }
    
    setEditingBlog(newBlogState);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingBlog(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingBlog) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingBlog({
          ...editingBlog,
          image: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim()) {
      setEditingBlog(prev => {
        if (!prev) return prev;
        const currentTags = prev.tags || [];
        if (!currentTags.includes(tag.trim())) {
          return {
            ...prev,
            tags: [...currentTags, tag.trim()]
          };
        }
        return prev;
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditingBlog(prev => {
      if (!prev) return prev;
      const currentTags = prev.tags || [];
      return {
        ...prev,
        tags: currentTags.filter(tag => tag !== tagToRemove)
      };
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const wordCount = textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    return `${minutes} min read`;
  };

  if (isEditing && editingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingBlog._id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            {saveError && (
              <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditingBlog((prev) => {
                        if (!prev) return prev;
                        if (slugCustomized) return { ...prev, title };
                        return { ...prev, title, slug: buildSlugPreview(title) };
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter blog title... (Up to 500 characters)"
                  />
                  {/* Title character count */}
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{editingBlog.title.length}/500 characters</span>
                    <span className={`${editingBlog.title.length > 450 ? 'text-red-600' : editingBlog.title.length > 350 ? 'text-amber-600' : 'text-green-600'}`}>
                      {editingBlog.title.length > 500 ? 'Exceeds limit!' : 'Within limit'}
                    </span>
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingBlog.slug || ''}
                    onChange={(e) => {
                      setSlugCustomized(true);
                      const slug = e.target.value.toLowerCase();
                      setEditingBlog((prev) => (prev ? { ...prev, slug } : prev));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="auto-generated-from-title"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>
                      {(editingBlog.slug || '').length}/160 · {editingBlog.slug && isValidSlug(editingBlog.slug) ? 'Valid slug' : 'Lowercase letters, numbers and hyphens only'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSlugCustomized(false);
                        setEditingBlog((prev) => (prev ? { ...prev, slug: buildSlugPreview(prev.title) } : prev));
                      }}
                      className="text-primary-600 hover:underline"
                    >
                      Regenerate from title
                    </button>
                  </div>
                  {editingBlog._id && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Changing the slug changes the public URL. The old URL keeps working via automatic redirect.
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={editingBlog.excerpt}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    rows={4} // Increased from 3 to 4 rows for longer excerpts
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Brief description of the blog post... (Up to 1000 characters)"
                  />
                  {/* Excerpt character count */}
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{editingBlog.excerpt.length}/1000 characters</span>
                    <span className={`${editingBlog.excerpt.length > 900 ? 'text-red-600' : editingBlog.excerpt.length > 700 ? 'text-amber-600' : 'text-green-600'}`}>
                      {editingBlog.excerpt.length > 1000 ? 'Exceeds limit!' : 'Within limit'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <CKEditor
                      editor={ClassicEditor as unknown as any}
                      data={editingBlog.content}
                      config={{
                        toolbar: [
                          'heading',
                          '|',
                          'bold', 'italic', 'link', 'blockQuote',
                          'bulletedList', 'numberedList',
                          'insertTable',
                          '|',
                          'undo', 'redo'
                        ]
                      }}
                      onChange={(_, editor) => {
                        const data = editor.getData();
                        setEditingBlog({ ...editingBlog, content: data });
                      }}
                    />
                  </div>
                  {/* Character count feedback (no hard limit) */}
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Content length: {editingBlog.content.length.toLocaleString()} characters</span>
                    <span className={`${editingBlog.content.length > 500000 ? 'text-red-600' : editingBlog.content.length > 100000 ? 'text-amber-600' : 'text-green-600'}`}>
                      {editingBlog.content.length > 500000 ? 'Very long content' : editingBlog.content.length > 100000 ? 'Long content' : 'Normal length'}
                    </span>
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sections
                  </label>
                  {editingBlog.sections.map((section, idx) => (
                    <div key={idx} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Heading</label>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={e => {
                            const newSections = [...editingBlog.sections];
                            newSections[idx].heading = e.target.value;
                            setEditingBlog({ ...editingBlog, sections: newSections });
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                          placeholder="Section heading..."
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Content</label>
                        <div className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                          <CKEditor
                            editor={ClassicEditor as unknown as any}
                            data={section.content}
                            config={{
                              toolbar: [
                                'heading',
                                '|',
                                'bold', 'italic', 'link', 'blockQuote',
                                'bulletedList', 'numberedList',
                                'insertTable',
                                '|',
                                'undo', 'redo'
                              ]
                            }}
                            onChange={(_, editor) => {
                              const data = editor.getData();
                              const newSections = [...editingBlog.sections];
                              newSections[idx].content = data;
                              setEditingBlog({ ...editingBlog, sections: newSections });
                            }}
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={section.image}
                          onChange={e => {
                            const newSections = [...editingBlog.sections];
                            newSections[idx].image = e.target.value;
                            setEditingBlog({ ...editingBlog, sections: newSections });
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                          placeholder="Section image URL..."
                        />
                        {section.image && (
                          <img src={section.image} alt={section.imageAlt || section.heading || 'Section image'} className="mt-2 w-full h-32 object-cover rounded" />
                        )}
                        <div className="mt-2">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Image alt text</label>
                          <input
                            type="text"
                            value={section.imageAlt || ''}
                            onChange={e => {
                              const newSections = [...editingBlog.sections];
                              newSections[idx].imageAlt = e.target.value;
                              setEditingBlog({ ...editingBlog, sections: newSections });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                            placeholder="Describe the image…"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newSections = editingBlog.sections.filter((_, i) => i !== idx);
                          setEditingBlog({ ...editingBlog, sections: newSections });
                        }}
                        className="text-xs text-red-600 hover:underline mt-2"
                        disabled={editingBlog.sections.length === 1}
                      >
                        Remove Section
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlog({
                        ...editingBlog,
                        sections: [...editingBlog.sections, { heading: '', content: '', image: '', imageAlt: '' }]
                      });
                    }}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 text-xs"
                  >
                    + Add Section
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Information Panel for New Limits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 text-blue-500">
                        ℹ️
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Enhanced Limits for Long Blog Posts
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Title: Up to 500 characters (increased from 200)</li>
                          <li>Excerpt: Up to 1,000 characters (increased from 300)</li>
                          <li>Content: No character limit - write as much as you need!</li>
                          <li>Comments: Up to 5,000 characters (increased from 2,000)</li>
                          <li>File uploads: Up to 10MB for images (increased from 5MB)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Featured Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    {editingBlog.image ? (
                      <div className="relative">
                        <img
                          src={editingBlog.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setEditingBlog({ ...editingBlog, image: '' })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer text-primary-600 hover:text-primary-700"
                        >
                          Upload Image
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured image alt text
                    </label>
                    <input
                      type="text"
                      value={editingBlog.imageAlt || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, imageAlt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Describe the featured image…"
                    />
                  </div>
                </div>

                {/* Author Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author?.name || ''}
                    onChange={e => setEditingBlog({
                      ...editingBlog,
                      author: {
                        ...editingBlog.author,
                        name: e.target.value,
                        email: editingBlog.author?.email || 'admin@sosapient.com'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author Profile Image URL
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author?.image || ''}
                    onChange={e => setEditingBlog({
                      ...editingBlog,
                      author: {
                        ...editingBlog.author,
                        image: e.target.value,
                        name: editingBlog.author?.name || 'Admin User',
                        email: editingBlog.author?.email || 'admin@sosapient.com'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter author profile image URL"
                  />
                  {editingBlog.author?.image && (
                    <div className="mt-2">
                      <img
                        src={editingBlog.author.image}
                        alt="Author Preview"
                        className="w-16 h-16 object-cover rounded-full border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingBlog.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget as HTMLInputElement;
                        const value = input.value.trim();
                        if (value) {
                          addTag(value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as 'draft' | 'published' | 'archived' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Reading Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reading Time
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingBlog.readTime || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 5 min read"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Auto-calculated: {calculateReadTime(editingBlog.content)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingBlog({ ...editingBlog, readTime: calculateReadTime(editingBlog.content) })}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Use Auto
                      </button>
                    </div>
                  </div>
                </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingBlog.featured}
                      onChange={(e) => setEditingBlog({ ...editingBlog, featured: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Featured Post
                    </span>
                  </label>
                </div>

                {/* SEO Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">SEO Settings</h4>
                  
                  {/* Meta Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={editingBlog.seo?.metaTitle || ''}
                      onChange={(e) => setEditingBlog({ 
                        ...editingBlog, 
                        seo: { 
                          ...editingBlog.seo, 
                          metaTitle: e.target.value 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="SEO optimized title..."
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {editingBlog.seo?.metaTitle?.length || 0}/60 characters
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={editingBlog.seo?.metaDescription || ''}
                      onChange={(e) => setEditingBlog({ 
                        ...editingBlog, 
                        seo: { 
                          ...editingBlog.seo, 
                          metaDescription: e.target.value 
                        } 
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="SEO meta description..."
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {editingBlog.seo?.metaDescription?.length || 0}/160 characters
                      {(editingBlog.seo?.metaDescription?.length || 0) > 0 && (editingBlog.seo?.metaDescription?.length || 0) < 50 ? ' · Too short' : (editingBlog.seo?.metaDescription?.length || 0) > 160 ? ' · Too long' : ''}
                    </p>
                  </div>

                  {/* Canonical URL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Canonical URL <span className="font-normal text-gray-400">(optional — defaults to this post's URL)</span>
                    </label>
                    <input
                      type="url"
                      value={editingBlog.seo?.canonicalUrl || ''}
                      onChange={(e) => setEditingBlog({
                        ...editingBlog,
                        seo: {
                          ...editingBlog.seo,
                          canonicalUrl: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="https://sosapient.in/blog/my-post"
                    />
                  </div>

                  {/* Social sharing */}
                  <div className="mb-4 grid grid-cols-1 gap-4">
                    {([
                      ['ogTitle', 'OG Title', 'Defaults to SEO title, then post title'],
                      ['ogDescription', 'OG Description', 'Defaults to meta description, then excerpt'],
                      ['ogImage', 'OG Image URL', 'Defaults to featured image'],
                      ['twitterTitle', 'Twitter Title', 'Defaults to OG title'],
                      ['twitterDescription', 'Twitter Description', 'Defaults to OG description'],
                      ['twitterImage', 'Twitter Image URL', 'Defaults to OG image']
                    ] as const).map(([key, label, hint]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {label} <span className="font-normal text-gray-400">({hint})</span>
                        </label>
                        <input
                          type={key.endsWith('Image') ? 'url' : 'text'}
                          value={(editingBlog.seo?.[key] as string) || ''}
                          onChange={(e) => setEditingBlog({
                            ...editingBlog,
                            seo: {
                              ...editingBlog.seo,
                              [key]: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder={key.endsWith('Image') ? 'https://…' : `${label}…`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Search + social preview */}
                  <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Google search preview</p>
                    <p className="text-lg text-blue-800 dark:text-blue-300 truncate">
                      {editingBlog.seo?.metaTitle?.trim() || editingBlog.title || 'Post title'}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 truncate">
                      sosapient.in › blog › {editingBlog.slug || buildSlugPreview(editingBlog.title) || 'slug'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {editingBlog.seo?.metaDescription?.trim() || editingBlog.excerpt || 'Meta description preview…'}
                    </p>
                    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Social card preview</p>
                      {(editingBlog.seo?.ogImage?.trim() || editingBlog.image) && (
                        <img
                          src={editingBlog.seo?.ogImage?.trim() || editingBlog.image}
                          alt={editingBlog.imageAlt || editingBlog.title}
                          className="h-32 w-full rounded object-cover"
                        />
                      )}
                      <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {editingBlog.seo?.ogTitle?.trim() || editingBlog.seo?.metaTitle?.trim() || editingBlog.title || 'Post title'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {editingBlog.seo?.ogDescription?.trim() || editingBlog.seo?.metaDescription?.trim() || editingBlog.excerpt || 'Description preview…'}
                      </p>
                    </div>
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SEO Keywords
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(editingBlog.seo?.keywords || []).map(keyword => (
                        <span
                          key={keyword}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {keyword}
                          <button
                            onClick={() => {
                              const newKeywords = (editingBlog.seo?.keywords || []).filter(k => k !== keyword);
                              setEditingBlog({
                                ...editingBlog,
                                seo: {
                                  ...editingBlog.seo,
                                  keywords: newKeywords
                                }
                              });
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add SEO keyword and press Enter"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget as HTMLInputElement;
                          const keyword = input.value.trim();
                          if (keyword) {
                            setEditingBlog(prev => {
                              if (!prev) return prev;
                              const currentKeywords = prev.seo?.keywords || [];
                              if (!currentKeywords.includes(keyword)) {
                                return {
                                  ...prev,
                                  seo: {
                                    ...prev.seo,
                                    keywords: [...currentKeywords, keyword]
                                  }
                                };
                              }
                              return prev;
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Blog Management"
        subtitle="Create, edit and manage blog content"
        actions={
          <PrimaryButton onClick={handleNew}>
            <Plus className="w-4 h-4" /> New post
          </PrimaryButton>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Total posts" value={stats.totalBlogs} loading={loading} icon={<BarChart3 className="w-5 h-5" />} />
        <StatCard label="Total views" value={stats.totalViews} loading={loading} icon={<Eye className="w-5 h-5" />} />
        <StatCard label="Categories" value={stats.categoryStats.length} loading={loading} icon={<User className="w-5 h-5" />} />
      </div>

      {/* Blog List */}
      <ContentCard>
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 lg:flex-row">
          <AdminInput
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            placeholder="Search title, excerpt, author…"
            aria-label="Search blog posts"
            className="lg:max-w-xs"
          />
          <AdminSelect value={blogStatusFilter} onChange={(e) => setBlogStatusFilter(e.target.value as typeof blogStatusFilter)} aria-label="Filter by status" className="lg:w-44">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </AdminSelect>
          <AdminSelect value={blogCategoryFilter} onChange={(e) => setBlogCategoryFilter(e.target.value)} aria-label="Filter by category" className="lg:w-52">
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </AdminSelect>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <BookReaderLoader label="Loading blog page..." />
          </div>
        ) : listError && blogs.length === 0 ? (
          <ErrorState title="Unable to load posts" body={listError} onRetry={() => { fetchBlogs(); fetchStats(); }} />
        ) : filteredBlogs.length === 0 ? (
          <EmptyState
            title="No blog posts found"
            body={blogs.length === 0 ? 'Create your first post to get started.' : 'No posts match your filters.'}
            action={<PrimaryButton onClick={handleNew}><Plus className="w-4 h-4" /> New post</PrimaryButton>}
          />
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Read Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                              {blog.title}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              /blog/{blog.slug}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {blog.excerpt?.slice(0, Math.ceil(blog.excerpt.length * 0.1))}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {blog.author?.image && (
                            <img
                              src={blog.author.image}
                              alt={blog.author.name || 'Author'}
                              className="w-8 h-8 rounded-full object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {blog.author?.name || 'Unknown Author'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {blog.author?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : blog.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 
                            ? blog.tags.slice(0, 3).join(', ') + (blog.tags.length > 3 ? '...' : '')
                            : 'No tags'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>{blog.views || 0} views</div>
                        <div>{blog.likes || 0} likes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {blog.readTime || calculateReadTime(blog.content)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </ContentCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Blog Post
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {blogToDelete && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={blogToDelete.image}
                    alt={blogToDelete.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                      {blogToDelete.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {blogToDelete.category} • {blogToDelete.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this blog post? This will permanently remove the post and all associated data.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;
