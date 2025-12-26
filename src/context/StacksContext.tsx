import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TechStack } from '../types/Tool';
import { stacksApi } from '../services/stacksApi';

interface StacksContextType {
  stacks: TechStack[];
  loading: boolean;
  error: string | null;
  getStackById: (id: number) => TechStack | null;
  refetch: () => Promise<void>;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

interface StacksProviderProps {
  children: ReactNode;
}

export const StacksProvider = ({ children }: StacksProviderProps) => {
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stacksApi.fetchAllStacks();
      setStacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStacks();
  }, []);

  const getStackById = (id: number): TechStack | null => {
    return stacks.find(stack => stack.id === id) || null;
  };

  const refetch = async () => {
    await fetchStacks();
  };

  const value: StacksContextType = {
    stacks,
    loading,
    error,
    getStackById,
    refetch
  };

  return (
    <StacksContext.Provider value={value}>
      {children}
    </StacksContext.Provider>
  );
};

export const useStacksContext = () => {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacksContext must be used within a StacksProvider');
  }
  return context;
};
