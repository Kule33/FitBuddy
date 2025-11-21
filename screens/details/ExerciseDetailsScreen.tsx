import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Exercise } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleFavourite, saveFavourites } from '@/store/slices/favouritesSlice';

export default function ExerciseDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: favourites } = useAppSelector((state) => state.favourites);

  // Parse exercise data from params
  const exercise: Exercise = params.exercise
    ? JSON.parse(params.exercise as string)
    : null;

  if (!exercise) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Exercise not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFavourite = favourites.some((fav) => fav.id === exercise.id);

  const handleToggleFavourite = async () => {
    dispatch(toggleFavourite(exercise));
    const updatedFavourites = isFavourite
      ? favourites.filter((fav) => fav.id !== exercise.id)
      : [...favourites, exercise];
    await dispatch(saveFavourites(updatedFavourites));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#34C759';
      case 'intermediate':
        return '#FF9500';
      case 'expert':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggleFavourite}
          style={styles.favoriteBtn}
        >
          <Feather
            name="heart"
            size={24}
            color={isFavourite ? '#FF3B30' : '#333'}
            fill={isFavourite ? '#FF3B30' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>{exercise.name}</Text>

        {/* Difficulty Badge */}
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(exercise.difficulty) },
          ]}
        >
          <Text style={styles.difficultyText}>
            {exercise.difficulty.toUpperCase()}
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Feather name="target" size={24} color="#007AFF" />
            </View>
            <Text style={styles.infoLabel}>Muscle</Text>
            <Text style={styles.infoValue}>{exercise.muscle}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Feather name="activity" size={24} color="#34C759" />
            </View>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{exercise.type}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Feather name="tool" size={24} color="#FF9500" />
            </View>
            <Text style={styles.infoLabel}>Equipment</Text>
            <Text style={styles.infoValue}>
              {exercise.equipment || 'None'}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>{exercise.instructions}</Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Feather name="check-circle" size={20} color="#34C759" />
              <Text style={styles.tipText}>Warm up before starting</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check-circle" size={20} color="#34C759" />
              <Text style={styles.tipText}>Focus on proper form</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check-circle" size={20} color="#34C759" />
              <Text style={styles.tipText}>Stay hydrated throughout</Text>
            </View>
            <View style={styles.tipItem}>
              <Feather name="check-circle" size={20} color="#34C759" />
              <Text style={styles.tipText}>Listen to your body</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backBtn: {
    padding: 8,
  },
  favoriteBtn: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  instructionsText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
  },
  tipsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 15,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
