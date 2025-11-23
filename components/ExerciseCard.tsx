import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Exercise } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const heartScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleFavoritePress = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
        tension: 150,
        friction: 3,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
    onToggleFavorite?.();
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return colors.beginner;
      case 'intermediate':
        return colors.intermediate;
      case 'expert':
        return colors.expert;
      default:
        return colors.textSecondary;
    }
  };

  const getExerciseIcon = (muscle: string, type: string) => {
    // Use muscle group for more variety - match exact API muscle names
    const normalizedMuscle = muscle.toLowerCase().replace(/[_\s-]/g, '');
    
    // Map available exercises to fitness-specific MaterialCommunityIcons
    if (normalizedMuscle === 'shoulders') {
      return 'weight-lifter';  // 🏋️ Weight lifter
    }
    if (normalizedMuscle === 'quadriceps' || normalizedMuscle === 'hamstrings') {
      return 'run';  // 🏃 Running person
    }
    if (normalizedMuscle === 'biceps') {
      return 'arm-flex';  // 💪 Flexed arm
    }
    if (normalizedMuscle === 'abdominals' || normalizedMuscle === 'abductors' || normalizedMuscle === 'adductors') {
      return 'yoga';  // 🧘 Yoga/core
    }
    if (normalizedMuscle === 'forearms') {
      return 'hand-back-right';  // ✋ Hand/forearm
    }
    if (normalizedMuscle === 'lats' || normalizedMuscle === 'middleback' || normalizedMuscle === 'lowerback') {
      return 'human-handsup';  // 🙆 Back stretch
    }
    if (normalizedMuscle === 'triceps') {
      return 'arm-flex-outline';  // 💪 Outlined arm
    }
    if (normalizedMuscle === 'calves') {
      return 'walk';  // 🚶 Walking
    }
    if (normalizedMuscle === 'glutes') {
      return 'seat';  // 🪑 Glutes/seat
    }
    if (normalizedMuscle === 'chest') {
      return 'weight';  // 🏋️ Weight
    }
    if (normalizedMuscle === 'traps' || normalizedMuscle === 'neck') {
      return 'neck';
    }
    
    // Default - use dumbbell for strength/general exercises
    return 'dumbbell';
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
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]} 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
      {/* Exercise Icon/Image */}
      <View style={[styles.imageContainer, { backgroundColor: getMuscleColor(exercise.muscle) + '20' }]}>
        <MaterialCommunityIcons 
          name={getExerciseIcon(exercise.muscle, exercise.type) as any}
          size={36} 
          color={getMuscleColor(exercise.muscle)} 
        />
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
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
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>\n                <MaterialCommunityIcons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={26}
                  color={isFavorite ? colors.error : colors.iconTertiary}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={[styles.detailItem, { backgroundColor: colors.primaryLight }]}>
            <Feather name="target" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>{exercise.muscle}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: colors.primaryLight }]}>
            <Feather name="activity" size={16} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>{exercise.type}</Text>
          </View>
          {exercise.equipment && (
            <View style={[styles.detailItem, { backgroundColor: colors.primaryLight }]}>
              <Feather name="tool" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{exercise.equipment}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arrow */}
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.iconTertiary} style={styles.arrow} />
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
});
