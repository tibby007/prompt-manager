'use client';
import { useState } from 'react';
import Layout from '@/components/Layout';
import PromptForm from '@/components/PromptForm';
import { useRouter } from 'next/navigation';

export default function NewPrompt() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState([]);
  const router = useRouter();

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tags');
        if (!res.ok) throw new Error('Failed to fetch tags');
        
        const data = await res.json();
        setTags(data.tags || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    fetchTags();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: {
    content: string;
    title?: string;
    source?: string;
    tagIds: string[];
  }) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create the prompt
      const promptRes = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: values.content,
          title: values.title,
          source: values.source,
        }),
      });
      
      if (!promptRes.ok) throw new Error('Failed to create prompt');
      
      const promptData = await promptRes.json();
      const promptId = promptData.prompt.id;
      
      // Add tags to the prompt
      if (values.tagIds.length > 0) {
        for (const tagId of values.tagIds) {
          await fetch(`/api/prompts/${promptId}/tags`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tagId }),
          });
        }
      }
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Error creating prompt:', err);
      setError('Failed to save prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a new tag
  const handleCreateTag = async (name: string, color?: string) => {
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          color,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create tag');
      
      const data = await res.json();
      setTags([...tags, data.tag]);
      return data.tag.id;
    } catch (err) {
      console.error('Error creating tag:', err);
      throw err;
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Prompt</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-card p-4">
          <PromptForm
            availableTags={tags}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            onCreateTag={handleCreateTag}
          />
        </div>
      </div>
    </Layout>
  );
}
