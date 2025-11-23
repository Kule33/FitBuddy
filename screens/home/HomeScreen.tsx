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
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavourite, saveFavourites, loadFavourites } from '@/store/slices/favouritesSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { Exercise } from '@/types';
import { exerciseService } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const { colors } = useTheme();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const logoutScale = React.useRef(new Animated.Value(1)).current;

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
      <View style={[styles.header, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            <MaterialCommunityIcons name="account" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.greeting, { color: colors.text }]}>Hello, {user?.name || 'Guest'}! 👋</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Let&apos;s crush your goals today</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={handleLogout} 
          onPressIn={() => {
            Animated.spring(logoutScale, {
              toValue: 0.9,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(logoutScale, {
              toValue: 1,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }).start();
          }}
          activeOpacity={1}
        >
          <Animated.View style={[styles.logoutButton, { backgroundColor: colors.primary, shadowColor: colors.primary, transform: [{ scale: logoutScale }] }]}>
            <MaterialCommunityIcons name="logout" size={22} color="#FFF" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchWrapper}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
        <MaterialCommunityIcons name="magnify" size={22} color={colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search exercises..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={22} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="dumbbell" size={64} color={colors.iconTertiary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No exercises found</Text>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        Try adjusting your search or pull to refresh
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading exercises...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  headerContainer: {
    marginBottom: 20,
    marginHorizontal: -16,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    paddingBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  searchWrapper: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
