import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Exercise {
  id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface FavouritesState {
  items: Exercise[];
  isLoading: boolean;
}

const initialState: FavouritesState = {
  items: [],
  isLoading: false,
};

// Async thunk to load favourites from AsyncStorage
export const loadFavourites = createAsyncThunk('favourites/load', async () => {
  try {
    const favouritesString = await AsyncStorage.getItem('favourites');
    if (favouritesString) {
      return JSON.parse(favouritesString) as Exercise[];
    }
    return [];
  } catch (error) {
    console.error('Error loading favourites:', error);
    return [];
  }
});

// Async thunk to save favourites to AsyncStorage
export const saveFavourites = createAsyncThunk(
  'favourites/save',
  async (favourites: Exercise[]) => {
    try {
      await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
      return favourites;
    } catch (error) {
      console.error('Error saving favourites:', error);
      throw error;
    }
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleFavourite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavourites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavourites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadFavourites.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(loadFavourites.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(saveFavourites.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.items = action.payload;
      });
  },
});

export const { addFavourite, removeFavourite, toggleFavourite, clearFavourites } =
  favouritesSlice.actions;

export default favouritesSlice.reducer;
