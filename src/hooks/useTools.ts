import { useState, useEffect, useMemo } from 'react';
import { Tool } from '../types/Tool';
import { toolsApi } from '../services/api';

export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const data = await toolsApi.fetchAllTools();
        setTools(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tools');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  return { tools, loading, error };
};

export const useFilteredTools = (searchTerm: string, category: string) => {
  const { tools, loading, error } = useTools();

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tool.best_for && tool.best_for.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !category || tool.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchTerm, category]);

  return { tools: filteredTools, loading, error };
};