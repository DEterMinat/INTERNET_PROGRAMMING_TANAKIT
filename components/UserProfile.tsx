import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          },
        },
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInTitle}>Not Logged In</Text>
          <Text style={styles.notLoggedInText}>
            Please log in to view your profile
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Role:</Text>
            <Text style={styles.detailValue}>{user.role || 'User'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Member since:</Text>
            <Text style={styles.detailValue}>Recently joined</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#c471ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  details: {
    width: '100%',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  detailValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
