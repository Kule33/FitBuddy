import apiClient from './apiClient';
import { Exercise, ExerciseQueryParams, ExerciseResponse } from '@/types';
import { API_KEY } from '@env';

/**
 * Exercise Service
 * Handles all API calls related to exercises and wellness data
 */

class ExerciseService {
  /**
   * Fetch exercises from API Ninjas
   * @param params Query parameters for filtering exercises
   * @returns Promise with exercise data
   */
  async getExercises(params?: ExerciseQueryParams): Promise<Exercise[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.name) queryParams.append('name', params.name);
      if (params?.type) queryParams.append('type', params.type);
      if (params?.muscle) queryParams.append('muscle', params.muscle);
      if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const response = await apiClient.get(`/exercises?${queryParams.toString()}`, {
        headers: {
          'X-Api-Key': API_KEY,
        },
      });

      // Transform API response to match our Exercise type
      const exercises: Exercise[] = response.data.map((item: any, index: number) => ({
        id: `${item.name}-${index}`,
        name: item.name,
        type: item.type,
        muscle: item.muscle,
        equipment: item.equipment,
        difficulty: item.difficulty,
        instructions: item.instructions,
      }));

      return exercises;
    } catch (error: any) {
      console.error('Error fetching exercises:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch exercises');
    }
  }

  /**
   * Get a single exercise by name
   * @param name Exercise name
   * @returns Promise with single exercise
   */
  async getExerciseByName(name: string): Promise<Exercise | null> {
    try {
      const exercises = await this.getExercises({ name, offset: 0 });
      return exercises.length > 0 ? exercises[0] : null;
    } catch (error) {
      console.error('Error fetching exercise by name:', error);
      throw error;
    }
  }

  /**
   * Get exercises by muscle group
   * @param muscle Muscle group name
   * @returns Promise with exercises for that muscle
   */
  async getExercisesByMuscle(muscle: string): Promise<Exercise[]> {
    try {
      return await this.getExercises({ muscle });
    } catch (error) {
      console.error('Error fetching exercises by muscle:', error);
      throw error;
    }
  }

  /**
   * Get exercises by difficulty
   * @param difficulty Difficulty level
   * @returns Promise with exercises of that difficulty
   */
  async getExercisesByDifficulty(difficulty: string): Promise<Exercise[]> {
    try {
      return await this.getExercises({ difficulty });
    } catch (error) {
      console.error('Error fetching exercises by difficulty:', error);
      throw error;
    }
  }

  /**
   * Search exercises by name
   * @param searchTerm Search term
   * @returns Promise with matching exercises
   */
  async searchExercises(searchTerm: string): Promise<Exercise[]> {
    try {
      return await this.getExercises({ name: searchTerm });
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ExerciseService();
