import { Prompt } from '@/lib/db';
import Link from 'next/link';

interface PromptCardProps {
  prompt: Prompt;
  tags?: { id: string; name: string; color: string | null }[];
  onFavoriteToggle?: (id: string) => void;
}

export default function PromptCard({ prompt, tags = [], onFavoriteToggle }: PromptCardProps) {
  // Format the date to a readable format
  const formattedDate = new Date(prompt.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-card p-4 mb-4">
      {/* Title (if available) */}
      {prompt.title && (
        <h3 className="text-gray-600 text-sm mb-2">{prompt.title}</h3>
      )}
      
      {/* Prompt content (main focus) */}
      <div className="text-gray-900 font-medium mb-3 whitespace-pre-wrap">
        {prompt.content}
      </div>
      
      {/* Bottom section with metadata */}
      <div className="flex flex-wrap items-center justify-between mt-2">
        {/* Tags section */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: tag.color || '#E2E8F0',
                color: getContrastColor(tag.color || '#E2E8F0'),
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        {/* Date and actions */}
        <div className="flex items-center justify-between w-full mt-2">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          
          <div className="flex space-x-2">
            {/* Favorite button */}
            <button
              onClick={() => onFavoriteToggle && onFavoriteToggle(prompt.id)}
              className="text-gray-400 hover:text-accent focus:outline-none"
              aria-label={prompt.is_favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill={prompt.is_favorite ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            
            {/* Edit link */}
            <Link
              href={`/prompts/${prompt.id}/edit`}
              className="text-gray-400 hover:text-primary focus:outline-none"
              aria-label="Edit prompt"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
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
