import { useState } from 'react';
import { Tag } from '@/lib/db';

interface PromptFormProps {
  initialValues?: {
    content: string;
    title?: string;
    source?: string;
  };
  availableTags?: Tag[];
  selectedTagIds?: string[];
  onSubmit: (values: {
    content: string;
    title?: string;
    source?: string;
    tagIds: string[];
  }) => Promise<void>;
  onCancel?: () => void;
  onTagToggle?: (tagId: string) => void;
  onCreateTag?: (name: string, color?: string) => Promise<void>;
}

export default function PromptForm({
  initialValues = { content: '', title: '', source: '' },
  availableTags = [],
  selectedTagIds = [],
  onSubmit,
  onCancel,
  onTagToggle,
  onCreateTag,
}: PromptFormProps) {
  const [content, setContent] = useState(initialValues.content);
  const [title, setTitle] = useState(initialValues.title || '');
  const [source, setSource] = useState(initialValues.source || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        title: title.trim() || undefined,
        source: source.trim() || undefined,
        tagIds: selectedTags,
      });
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    onTagToggle?.(tagId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Content textarea (most important) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Prompt Content *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Paste or type your prompt here..."
          required
        />
      </div>

      {/* Title input (optional) */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Add a title to help identify this prompt"
        />
      </div>

      {/* Source input (optional) */}
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
          Source (Optional)
        </label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Where did you find this prompt?"
        />
      </div>

      {/* Tags section */}
      <div>
        <button
          type="button"
          onClick={() => setShowTagSelector(!showTagSelector)}
          className="text-sm text-primary hover:text-primary-dark flex items-center mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 mr-1 transition-transform ${showTagSelector ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {showTagSelector ? 'Hide Tags' : 'Add Tags'}
        </button>

        {showTagSelector && (
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag.id)
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

            {onCreateTag && (
              <button
                type="button"
                onClick={() => {
                  // This would typically open a modal or expand a form
                  // For simplicity, we'll just prompt for a tag name
                  const name = prompt('Enter new tag name:');
                  if (name?.trim()) {
                    onCreateTag(name.trim());
                  }
                }}
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
            )}
          </div>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Saving...' : 'Save Prompt'}
        </button>
      </div>
    </form>
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
