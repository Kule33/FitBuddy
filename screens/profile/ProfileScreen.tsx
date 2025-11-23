import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logoutUser } from '@/store/slices/authSlice';
import { clearFavourites } from '@/store/slices/favouritesSlice';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: favourites } = useAppSelector((state) => state.favourites);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.headerBackground}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={52} color="#FFF" />
            </View>
          </View>
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || 'No email'}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="heart" size={28} color="#FF3B30" />
          <Text style={styles.statNumber}>{favourites.length}</Text>
          <Text style={styles.statLabel}>Favourites</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="dumbbell" size={28} color="#34C759" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="trophy" size={28} color="#FF9500" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Edit profile feature coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="account-edit" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Change password feature coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="lock" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Notifications settings coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="bell" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Theme settings coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="moon-waning-crescent" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearFavourites}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="delete" size={22} color="#FF3B30" />
              <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>
                Clear Favourites
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('FitBuddy', 'Version 1.0.0\n\nYour fitness companion app.')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="information" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>About App</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'Privacy policy coming soon!')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="shield-check" size={22} color="#007AFF" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBackground: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
    shadowColor: '#000',
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
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F5F5F5',
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
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 48,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 40,
  },
});
