import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';

/**
 * Auth Service
 * Handles authentication-related API calls
 * Note: Currently using mock data - replace with actual API calls when backend is ready
 */

class AuthService {
  /**
   * Login user
   * @param credentials User login credentials
   * @returns Promise with auth response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.post('/auth/login', credentials);
      
      // Mock response for now
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          token: 'mock-jwt-token-' + Date.now(),
        };

        // Store in AsyncStorage
        await AsyncStorage.setItem('userToken', mockUser.token || '');
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));

        return {
          success: true,
          message: 'Login successful',
          data: {
            user: mockUser,
            token: mockUser.token || '',
          },
        };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        error: error.message || 'Invalid email or password',
      };
    }
  }

  /**
   * Register new user
   * @param credentials User registration data
   * @returns Promise with auth response
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.post('/auth/register', credentials);
      
      // Mock response for now
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (credentials.email && credentials.password && credentials.name) {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: credentials.name,
          token: 'mock-jwt-token-' + Date.now(),
        };

        // Store in AsyncStorage
        await AsyncStorage.setItem('userToken', mockUser.token || '');
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));

        return {
          success: true,
          message: 'Registration successful',
          data: {
            user: mockUser,
            token: mockUser.token || '',
          },
        };
      } else {
        throw new Error('All fields are required');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        error: error.message || 'Could not create account',
      };
    }
  }

  /**
   * Logout user
   * Clears token and user data from storage
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user from storage
   * @returns Promise with user data or null
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns Promise with boolean
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get stored auth token
   * @returns Promise with token string or null
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
}

// Export singleton instance
export default new AuthService();
