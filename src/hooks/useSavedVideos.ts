import { useState, useEffect } from "react";

export function useSavedVideos() {
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("ent_saved_videos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ent_saved_videos", JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id: number) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isSaved = (id: number) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}
