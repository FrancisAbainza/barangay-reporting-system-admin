export interface ImageType {
  uri: string;
}

export interface ReplyType {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isAdmin?: boolean;
  likes?: string[];
  dislikes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentType {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isAdmin?: boolean;
  likes?: string[];
  dislikes?: string[];
  replies?: ReplyType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunitySentimentType {
  sentiment: 'supportive' | 'positive' | 'negative' | 'neutral';
  summary: string;
}
