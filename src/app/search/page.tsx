'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PromptCard from '@/components/PromptCard';
import { Prompt, Tag } from '@/lib/db';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptTags, setPromptTags] = useState<Record<string, Tag[]>>({});

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      
      const data = await res.json();
      setSearchResults(data.prompts || []);
      
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

  // Handle favorite toggle
  const handleFavoriteToggle = async (promptId: string) => {
    try {
      const res = await fetch(`/api/prompts/${promptId}/favorite`, {
        method: 'POST',
      });
      
      if (res.ok) {
        // Update the prompt in state
        setSearchResults(searchResults.map(p => 
          p.id === promptId ? { ...p, is_favorite: !p.is_favorite } : p
        ));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Search Prompts</h2>
        
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search by keyword or phrase..."
        />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : hasSearched ? (
          searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              {searchResults.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  tags={promptTags[prompt.id] || []}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Enter keywords above to search your prompts
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
