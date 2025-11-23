import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavourite, saveFavourites, loadFavourites } from '@/store/slices/favouritesSlice';
import { Exercise } from '@/types';

export default function FavouritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: favourites, isLoading } = useAppSelector((state) => state.favourites);

  // Load favourites on mount
  useEffect(() => {
    dispatch(loadFavourites());
  }, []);

  const handleToggleFavourite = async (exercise: Exercise) => {
    dispatch(toggleFavourite(exercise));
    const updatedFavourites = favourites.filter((fav) => fav.id !== exercise.id);
    await dispatch(saveFavourites(updatedFavourites));
  };

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: '/details/[id]',
      params: { id: exercise.id, exercise: JSON.stringify(exercise) },
    });
  };

  const handleBrowseExercises = () => {
    router.push('/(tabs)');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Favourites</Text>
        <Text style={styles.subtitle}>
          {favourites.length} {favourites.length === 1 ? 'exercise' : 'exercises'} saved
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <MaterialCommunityIcons name="heart-outline" size={64} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Favourites Yet</Text>
      <Text style={styles.emptyText}>
        Start adding exercises to your favourites by tapping the heart icon
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={handleBrowseExercises}
      >
        <MaterialCommunityIcons name="dumbbell" size={22} color="#FFF" />
        <Text style={styles.browseButtonText}>Browse Exercises</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            onPress={() => handleExercisePress(item)}
            isFavorite={true}
            onToggleFavorite={() => handleToggleFavourite(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    marginHorizontal: -16,
    marginTop: -16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: 50,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  headerSection: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
