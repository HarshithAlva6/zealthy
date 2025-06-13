'use client'
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export type Config = {
  [key: string]: string[];
};

export const useConfig = () => {
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const configData = await api.get('/admin/config');
      setConfig(configData);
    } catch (error) {
      console.error('Failed to load config:', error);
      setConfig({
        page2: ['about','birthdate'],
        page3: ['address']
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: Config) => {
    try {
      await api.put('/admin/config', newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return { config, loading, updateConfig, refetch: loadConfig };
};