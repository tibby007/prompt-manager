export async function getCurrentUserId() {
  // Mocked user ID for now
  return 'default_user';
}

export async function registerUser(email: string, password: string) {
  return {
    id: 'user123',
    email,
    created_at: new Date().toISOString()
  };
}

export async function loginUser(email: string, password: string) {
  return {
    id: 'user123',
    email,
    created_at: new Date().toISOString()
  };
}

export async function clearSession() {
  return { success: true };
}

  
    
