export type ENTVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
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
