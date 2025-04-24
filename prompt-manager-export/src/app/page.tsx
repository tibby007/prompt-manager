import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PromptCard from '@/components/PromptCard';
import SearchBar from '@/components/SearchBar';
import { Prompt, Tag } from '@/lib/db';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptTags, setPromptTags] = useState<Record<string, Tag[]>>({});

  // Fetch prompts and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch prompts
        const promptsRes = await fetch('/api/prompts');
        if (!promptsRes.ok) throw new Error('Failed to fetch prompts');
        const promptsData = await promptsRes.json();
        
        // Fetch tags
        const tagsRes = await fetch('/api/tags');
        if (!tagsRes.ok) throw new Error('Failed to fetch tags');
        const tagsData = await tagsRes.json();
        
        setPrompts(promptsData.prompts || []);
        setTags(tagsData.tags || []);
        
        // Fetch tags for each prompt
        const tagsMap: Record<string, Tag[]> = {};
        for (const prompt of promptsData.prompts || []) {
          const promptTagsRes = await fetch(`/api/prompts/${prompt.id}/tags`);
          if (promptTagsRes.ok) {
            const promptTagsData = await promptTagsRes.json();
            tagsMap[prompt.id] = promptTagsData.tags || [];
          }
        }
        setPromptTags(tagsMap);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async (promptId: string) => {
    try {
      const res = await fetch(`/api/prompts/${promptId}/favorite`, {
        method: 'POST',
      });
      
      if (res.ok) {
        // Update the prompt in state
        setPrompts(prompts.map(p => 
          p.id === promptId ? { ...p, is_favorite: !p.is_favorite } : p
        ));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      
      const data = await res.json();
      setPrompts(data.prompts || []);
      
      // Fetch tags for search results
      const tagsMap: Record<string, Tag[]> = {};
      for (const prompt of data.prompts || []) {
        const promptTagsRes = await fetch(`/api/prompts/${prompt.id}/tags`);
        if (promptTagsRes.ok) {
          const promptTagsData = await promptTagsRes.json();
          tagsMap[prompt.id] = promptTagsData.tags || [];
        }
      }
      setPromptTags(tagsMap);
      
    } catch (err) {
      console.error('Error searching:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Prompts</h2>
        
        <SearchBar onSearch={handleSearch} />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No prompts found</p>
            <p className="text-sm text-gray-400">
              Click the + button to add your first prompt
            </p>
          </div>
        ) : (
          <div>
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                tags={promptTags[prompt.id] || []}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
