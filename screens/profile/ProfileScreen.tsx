import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logoutUser } from '@/store/slices/authSlice';
import { clearFavourites } from '@/store/slices/favouritesSlice';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const { colors, theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logoutUser());
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearFavourites = () => {
    if (favourites.length === 0) {
      Alert.alert('No Favourites', 'You don\'t have any favourites to clear.');
      return;
    }

    Alert.alert(
      'Clear Favourites',
      `Are you sure you want to remove all ${favourites.length} favourites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            dispatch(clearFavourites());
            Alert.alert('Success', 'All favourites have been cleared.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={[styles.headerBackground, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary, borderColor: colors.primaryLight }]}>
              <MaterialCommunityIcons name="account" size={52} color="#FFF" />
            </View>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Guest'}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'No email'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <MaterialCommunityIcons name="heart" size={28} color={colors.error} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{favourites.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favourites</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <MaterialCommunityIcons name="dumbbell" size={28} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <MaterialCommunityIcons name="trophy" size={28} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Achievements</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Account</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Edit profile feature coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="account-edit" size={22} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Profile</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Change password feature coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="lock" size={22} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Change Password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App Settings</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Notifications settings coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="bell" size={22} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Notifications</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="moon-waning-crescent" size={22} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearFavourites}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="delete" size={22} color={colors.error} />
              <Text style={[styles.menuItemText, { color: colors.error }]}>
                Clear Favourites
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('FitBuddy', 'Version 1.0.0\n\nYour fitness companion app.')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="information" size={22} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>About App</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Privacy policy coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="shield-check" size={22} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.iconTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card, borderColor: colors.error }]} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={22} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textTertiary }]}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    paddingBottom: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  avatarContainer: {
    marginBottom: 18,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 5,
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 15,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    marginLeft: 48,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 40,
  },
});
