import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return { user, loading };
}