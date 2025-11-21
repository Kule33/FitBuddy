import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';
import { AUTH_API_URL } from '@env';

/**
 * Auth Service
 * Uses DummyJSON API for authentication: https://dummyjson.com/docs/auth
 * 
 * Test credentials:
 * - username: emilys, password: emilyspass
 * - username: michaelw, password: michaelwpass
 */

class AuthService {
  /**
   * Login user with DummyJSON API
   * @param credentials User login credentials
   * @returns Promise with auth response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
        username: credentials.email.split('@')[0], // Use email prefix as username
        password: credentials.password,
        expiresInMins: 60, // Token expires in 60 minutes
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      const user: User = {
        id: data.id.toString(),
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        token: data.token,
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem('userToken', user.token || '');
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: user,
          token: user.token || '',
        },
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        error: error.response?.data?.message || 'Invalid username or password',
      };
    }
  }

  /**
   * Register new user
   * Note: DummyJSON doesn't have real registration, returns mock data
   * @param credentials User registration data
   * @returns Promise with auth response
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // DummyJSON doesn't have registration endpoint, so we simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      
      if (credentials.email && credentials.password && credentials.name) {
        const mockUser: User = {
          id: Date.now().toString(),
          email: credentials.email,
          name: credentials.name,
          token: 'mock-token-' + Date.now(),
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
   * Get current authenticated user from DummyJSON
   * @returns Promise with user or null
   */
  async getCurrentAuthUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return null;

      const response = await axios.get(`${AUTH_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = response.data;

      const user: User = {
        id: data.id.toString(),
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        token: token,
      };

      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Error getting current auth user:', error);
      // If token is invalid, clear storage
      await this.logout();
      return null;
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
