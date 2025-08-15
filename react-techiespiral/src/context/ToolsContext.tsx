import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tool } from '../types/Tool';
import { toolsApi } from '../services/api';

interface ToolsContextType {
  tools: Tool[];
  loading: boolean;
  error: string | null;
  getToolById: (id: number) => Tool | null;
  refetch: () => Promise<void>;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

interface ToolsProviderProps {
  children: ReactNode;
}

export const ToolsProvider = ({ children }: ToolsProviderProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await toolsApi.fetchAllTools();
      setTools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const getToolById = (id: number): Tool | null => {
    return tools.find(tool => tool.Id === id) || null;
  };

  const refetch = async () => {
    await fetchTools();
  };

  const value: ToolsContextType = {
    tools,
    loading,
    error,
    getToolById,
    refetch
  };

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useToolsContext = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useToolsContext must be used within a ToolsProvider');
  }
  return context;
};