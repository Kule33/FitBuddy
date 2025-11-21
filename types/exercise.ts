// Exercise/Wellness Item types
export interface Exercise {
  id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  instructions: string;
  image?: string;
}

// Wellness tip type
export interface WellnessTip {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'mental-health' | 'fitness' | 'sleep' | 'general';
  image?: string;
  createdAt?: string;
}

// API Response types
export interface ExerciseResponse {
  success: boolean;
  data: Exercise[];
  message?: string;
  error?: string;
}

export interface SingleExerciseResponse {
  success: boolean;
  data: Exercise;
  message?: string;
  error?: string;
}

// API Query params
export interface ExerciseQueryParams {
  name?: string;
  type?: string;
  muscle?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}

// Favourites state
export interface FavouritesState {
  items: Exercise[];
  isLoading: boolean;
}
