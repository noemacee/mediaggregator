import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'savedArticles';

export const useSavedArticles = () => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load saved articles from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setSavedIds(saved);
  }, []);

  // Check if an article is saved
  const isSaved = useCallback((articleId: string) => {
    return savedIds.includes(articleId);
  }, [savedIds]);

  // Save an article
  const saveArticle = useCallback((articleId: string) => {
    if (!savedIds.includes(articleId)) {
      const newSaved = [...savedIds, articleId];
      setSavedIds(newSaved);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
      return true; // Successfully saved
    }
    return false; // Already saved
  }, [savedIds]);

  // Remove an article from saved
  const removeArticle = useCallback((articleId: string) => {
    const newSaved = savedIds.filter((id) => id !== articleId);
    setSavedIds(newSaved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
  }, [savedIds]);

  // Toggle save state
  const toggleSave = useCallback((articleId: string) => {
    if (isSaved(articleId)) {
      removeArticle(articleId);
      return false; // Now unsaved
    } else {
      saveArticle(articleId);
      return true; // Now saved
    }
  }, [isSaved, saveArticle, removeArticle]);

  return {
    savedIds,
    isSaved,
    saveArticle,
    removeArticle,
    toggleSave
  };
};

