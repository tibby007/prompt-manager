export function getCloudflareContext(req: any) {
  return {}; // Mocked CF context
}

export async function getPromptById(id: string) {
  return { id, title: 'Sample Prompt', content: 'Hello World' };
}

export async function toggleFavorite(promptId: string, userId: string) {
  return { success: true };
}

export async function removeTagFromPrompt(promptId: string, tagId: string) {
  return { success: true };
}

export async function getTagsForPrompt(promptId: string) {
  return [{ id: 'tag1', name: 'Example' }];
}

export async function getPromptsByUserId(userId: string) {
  return [{ id: 'p1', title: 'Prompt 1' }, { id: 'p2', title: 'Prompt 2' }];
}

export async function getTagsByUserId(userId: string) {
  return [{ id: 't1', name: 'Fun' }];
}

export async function getTagById(tagId: string) {
  return { id: tagId, name: 'Example Tag' };
}

export async function updateTag(tagId: string, data: any) {
  return { ...data, id: tagId };
}






   
