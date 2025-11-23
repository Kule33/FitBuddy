import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
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

  const getExerciseIcon = (muscle: string, type: string) => {
    // Use muscle group for more variety - match exact API muscle names
    const normalizedMuscle = muscle.toLowerCase().replace(/[_\s-]/g, '');
    
    // Map available exercises to the beautiful icons
    if (normalizedMuscle === 'shoulders') {
      return 'sunrise';  // 🌅
    }
    if (normalizedMuscle === 'quadriceps' || normalizedMuscle === 'hamstrings') {
      return 'move';  // 🚶
    }
    if (normalizedMuscle === 'biceps') {
      return 'arrow-up-circle';  // ⬆️
    }
    if (normalizedMuscle === 'abdominals' || normalizedMuscle === 'abductors' || normalizedMuscle === 'adductors') {
      return 'grid';  // ⊞
    }
    if (normalizedMuscle === 'forearms') {
      return 'battery';  // 🔋
    }
    if (normalizedMuscle === 'lats' || normalizedMuscle === 'middleback' || normalizedMuscle === 'lowerback') {
      return 'heart';  // ❤️ (using heart for back/lats)
    }
    if (normalizedMuscle === 'triceps') {
      return 'arrow-down-circle';  // ⬇️
    }
    if (normalizedMuscle === 'calves') {
      return 'circle';  // ⚪
    }
    if (normalizedMuscle === 'glutes') {
      return 'user';  // 👤
    }
    if (normalizedMuscle === 'chest') {
      return 'shield';  // 🛡️
    }
    if (normalizedMuscle === 'traps' || normalizedMuscle === 'neck') {
      return 'aperture';
    }
    
    // Default - use trending-up for strength/general exercises
    return 'trending-up';
  };

  const getMuscleColor = (muscle: string) => {
    const colors = [
      '#007AFF', '#FF3B30', '#34C759', '#FF9500', 
      '#AF52DE', '#FF2D55', '#5AC8FA', '#FFCC00'
    ];
    const index = muscle.length % colors.length;
    return colors[index];
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Exercise Icon/Image */}
      <View style={[styles.imageContainer, { backgroundColor: getMuscleColor(exercise.muscle) + '20' }]}>
        <Feather 
          name={getExerciseIcon(exercise.muscle, exercise.type)} 
          size={32} 
          color={getMuscleColor(exercise.muscle)} 
        />
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name} numberOfLines={2}>
              {exercise.name}
            </Text>
            <View style={styles.badges}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getDifficultyColor(exercise.difficulty) },
                ]}
              >
                <Text style={styles.badgeText}>{exercise.difficulty}</Text>
              </View>
            </View>
          </View>
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={onToggleFavorite}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isFavorite ? (
                <Feather name="heart" size={24} color="#FF3B30" fill="#FF3B30" />
              ) : (
                <Feather name="heart" size={24} color="#CCC" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Feather name="target" size={16} color="#666" />
            <Text style={styles.detailText}>{exercise.muscle}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="activity" size={16} color="#666" />
            <Text style={styles.detailText}>{exercise.type}</Text>
          </View>
          {exercise.equipment && (
            <View style={styles.detailItem}>
              <Feather name="tool" size={16} color="#666" />
              <Text style={styles.detailText}>{exercise.equipment}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arrow */}
      <Feather name="chevron-right" size={20} color="#CCC" style={styles.arrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  favoriteButton: {
    padding: 4,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
});
