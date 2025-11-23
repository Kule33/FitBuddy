import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavourite, saveFavourites, loadFavourites } from '@/store/slices/favouritesSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { Exercise } from '@/types';
import { exerciseService } from '@/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: favourites } = useAppSelector((state) => state.favourites);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load favourites on mount
  useEffect(() => {
    dispatch(loadFavourites());
  }, []);

  // Fetch exercises
  const fetchExercises = useCallback(async () => {
    try {
      setError(null);
      // Fetch exercises for specific muscle groups that have beautiful icons
      // Based on API availability: shoulders, quadriceps, biceps, abdominals, forearms, lats
      const muscleGroups = [
        'shoulders',  // sunrise icon ✓
        'quadriceps', // move icon ✓
        'biceps',     // arrow-up-circle ✓
        'abdominals', // grid icon ✓
        'forearms',   // aperture icon ✓
        'lats',       // shield icon ✓
        'triceps',    // arrow-down-circle
        'calves',     // battery icon
        'glutes',     // circle icon
      ];
      
      const exercisePromises = muscleGroups.map(muscle => 
        exerciseService.getExercises({ muscle, offset: 0 })
      );
      
      const results = await Promise.all(exercisePromises);
      
      // Log what we got for each muscle
      results.forEach((exercises, index) => {
        console.log(`${muscleGroups[index]}: ${exercises.length} exercises`);
        if (exercises.length > 0) {
          console.log(`  - First: ${exercises[0].name} (${exercises[0].muscle})`);
          if (exercises.length > 1) {
            console.log(`  - Second: ${exercises[1].name} (${exercises[1].muscle})`);
          }
        }
      });
      
      // Remove duplicates and take first 3 per muscle group for variety
      const uniqueExercises: Exercise[] = [];
      const seenNames = new Set<string>();
      
      results.forEach(muscleExercises => {
        let count = 0;
        for (const exercise of muscleExercises) {
          if (!seenNames.has(exercise.name) && count < 3) {
            uniqueExercises.push(exercise);
            seenNames.add(exercise.name);
            count++;
          }
        }
      });
      
      // Shuffle the exercises to mix up the icons
      const shuffledExercises = uniqueExercises.sort(() => Math.random() - 0.5);
      
      console.log(`Total unique exercises: ${shuffledExercises.length}`);
      
      setExercises(shuffledExercises);
      setFilteredExercises(shuffledExercises);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exercises');
      Alert.alert('Error', 'Failed to load exercises. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  }, [searchQuery, exercises]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchExercises();
  };

  const handleToggleFavourite = async (exercise: Exercise) => {
    dispatch(toggleFavourite(exercise));
    // Save to AsyncStorage
    const updatedFavourites = favourites.find((fav) => fav.id === exercise.id)
      ? favourites.filter((fav) => fav.id !== exercise.id)
      : [...favourites, exercise];
    await dispatch(saveFavourites(updatedFavourites));
  };

  const isFavourite = (exerciseId: string) => {
    return favourites.some((fav) => fav.id === exerciseId);
  };

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: '/details/[id]',
      params: { id: exercise.id, exercise: JSON.stringify(exercise) },
    });
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={22} color="#007AFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}! 👋</Text>
            <Text style={styles.subtitle}>Let&apos;s crush your goals today</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Feather name="x" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="search" size={64} color="#CCC" />
      <Text style={styles.emptyStateTitle}>No exercises found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or pull to refresh
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            onPress={() => handleExercisePress(item)}
            isFavorite={isFavourite(item.id)}
            onToggleFavorite={() => handleToggleFavourite(item)}
          />
        )}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderSearchBar()}
            <Text style={styles.sectionTitle}>
              Exercises ({filteredExercises.length})
            </Text>
          </>
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    marginHorizontal: -16,
    marginTop: -16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0051D5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
