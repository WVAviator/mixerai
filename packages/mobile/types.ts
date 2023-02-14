export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Vote {
  userId: string;
  vote: 'like' | 'dislike';
}
export interface Recipe {
  id: string;
  title: string;
  user: string;
  description: string;
  ingredients: Ingredient[];
  directions: string;
  imageUrl: string;
  imagePrompt: string;
  prompt: string;
  votes: Vote[];
  likes: number;
  dislikes: number;
  shares: number;
  createdAt: Date;
}
