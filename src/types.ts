export type ENTVideo = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: "Ear" | "Nose" | "Throat" | "General";
  symptom: string[];
  publishDate: string;
  views: string;
  duration: string;
};

export type ENTNews = {
  id: number;
  title: string;
  description: string;
  image: string;
  publishDate: string;
  category: string;
};

export type AppState = {
  selectedVideoId: number | null;
  searchQuery: string;
  activeTab: "videos" | "news";
  savedVideos: number[];
  categoryFilter: string | "All";
  symptomFilter: string | "All";
};
