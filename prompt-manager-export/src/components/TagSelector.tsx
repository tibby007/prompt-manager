import { useState } from 'react';
import { Tag } from '@/lib/db';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTagIds: string[];
  onTagToggle: (tagId: string) => void;
  onCreateTag?: (name: string, color?: string) => Promise<void>;
}

export default function TagSelector({ 
  availableTags, 
  selectedTagIds, 
  onTagToggle,
  onCreateTag
}: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagColor, setNewTagColor] = useState('#E2E8F0'); // Default light gray

  // Predefined colors for quick selection
  const colorOptions = [
    '#E2E8F0', // Light gray
    '#FEF3C7', // Light yellow
    '#DBEAFE', // Light blue
    '#D1FAE5', // Light green
    '#FEE2E2', // Light red
    '#E9D5FF', // Light purple
  ];

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !onCreateTag) return;
    
    try {
      await onCreateTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setIsCreatingTag(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {availableTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTagIds.includes(tag.id)
                ? 'ring-2 ring-offset-1 ring-primary'
                : ''
            }`}
            style={{
              backgroundColor: tag.color || '#E2E8F0',
              color: getContrastColor(tag.color || '#E2E8F0'),
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {!isCreatingTag ? (
        <button
          onClick={() => setIsCreatingTag(true)}
          className="text-sm text-primary hover:text-primary-dark flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create new tag
        </button>
      ) : (
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => setNewTagColor(color)}
                className={`w-6 h-6 rounded-full ${
                  newTagColor === color ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleCreateTag}
              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreatingTag(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove the hash if it exists
  hexColor = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors and white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
