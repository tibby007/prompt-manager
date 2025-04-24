import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tag } from '@/lib/db';

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#E2E8F0'); // Default light gray
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Predefined colors for quick selection
  const colorOptions = [
    '#E2E8F0', // Light gray
    '#FEF3C7', // Light yellow
    '#DBEAFE', // Light blue
    '#D1FAE5', // Light green
    '#FEE2E2', // Light red
    '#E9D5FF', // Light purple
    '#0F3460', // Navy blue (primary)
    '#16A5A5', // Teal (secondary)
    '#E6B325', // Gold (accent)
  ];

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/tags');
        if (!res.ok) throw new Error('Failed to fetch tags');
        
        const data = await res.json();
        setTags(data.tags || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, []);

  // Create new tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTagName.trim(),
          color: newTagColor,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create tag');
      
      const data = await res.json();
      setTags([...tags, data.tag]);
      setNewTagName('');
      setNewTagColor('#E2E8F0');
      setIsCreatingTag(false);
    } catch (err) {
      console.error('Error creating tag:', err);
      setError('Failed to create tag. Please try again.');
    }
  };

  // Delete tag
  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This will remove it from all prompts.')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete tag');
      
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError('Failed to delete tag. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Manage Tags</h2>
        
        {/* Create new tag section */}
        <div className="bg-white rounded-lg shadow-card p-4 mb-6">
          <h3 className="text-lg font-medium mb-3">Create New Tag</h3>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name
              </label>
              <input
                type="text"
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter tag name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-8 h-8 rounded-full ${
                      newTagColor === color ? 'ring-2 ring-primary ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
              className={`w-full py-2 rounded-md ${
                newTagName.trim()
                  ? 'bg-secondary text-white hover:bg-secondary-dark'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Tag
            </button>
          </div>
        </div>
        
        {/* Tags list */}
        <div className="bg-white rounded-lg shadow-card p-4">
          <h3 className="text-lg font-medium mb-3">Your Tags</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No tags created yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tags.map((tag) => (
                <li key={tag.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full mr-3"
                      style={{ backgroundColor: tag.color || '#E2E8F0' }}
                    ></div>
                    <span>{tag.name}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label={`Delete ${tag.name} tag`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
