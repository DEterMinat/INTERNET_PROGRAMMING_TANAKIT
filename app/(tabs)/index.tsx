import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usersApi } from '../../services/api';


function ProfileCard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 32; // 16px padding on each side

  // Generate random stats for each profile
  const generateRandomStats = () => ({
    points: Math.floor(Math.random() * 5000) + 1000, // 1000-6000
    global: Math.floor(Math.random() * 8000) + 2000, // 2000-10000
    local: Math.floor(Math.random() * 500) + 50,     // 50-550
  });

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        // Try to load from backend API first
        try {
          console.log('Attempting to load from API...');
          const response = await usersApi.getPublic(10);
          console.log('API Response:', response);
          if (response.success && response.data && Array.isArray(response.data)) {
            // Map the API response to match expected profile format
            const mappedProfiles = response.data.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              title: user.role || 'Member',
              image: user.avatar,
              username: user.username,
              createdAt: user.createdAt
            }));
            setProfiles(mappedProfiles);
            return;
          }
        } catch (apiError) {
          console.log('Backend API not available, falling back to remote data:', apiError);
        }
        
        // Fallback to remote JSON data
        const response = await fetch('https://gist.githubusercontent.com/DEterMinat/0c1ddda2293c7740f623013167f90445/raw/af3737e60967c76fac1c02b7a2efccfa4c7d7dd5/gistfile1.txt');
        const data = await response.json();
        setProfiles(data);
      } catch (err: any) {
        setError('Failed to load profiles' + (err.message ? `: ${err.message}` : ''));
      }
    };
    loadProfiles();
  }, []);

  // Gradient colors for each card
  const gradientColors = [
    '#74b9ff', // Blue 
    '#fd79a8', // Pink   
    '#fdcb6e', // Orange 
    '#a29bfe', // Purple 
    '#55efc4', // Green 
  ];

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }
  if (!profiles.length) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView 
      style={profileStyles.scrollContainer}
      contentContainerStyle={profileStyles.body}
      showsVerticalScrollIndicator={false}
    >
      {profiles.map((profile, idx) => {
        const stats = generateRandomStats();
        return (
        <View style={[profileStyles.card, { backgroundColor: gradientColors[idx % gradientColors.length], width: cardWidth }]} key={idx}>
          {/* Header with dots */}
          <View style={profileStyles.cardHeader}>
            <View style={profileStyles.leftContent}>
              <Image
                source={{ uri: profile.image }}
                style={profileStyles.profileImg}
              />
              <View style={profileStyles.profileInfo}>
                <Text style={profileStyles.name}>{profile.name}</Text>
                <Text style={profileStyles.title}>{profile.title}</Text>
              </View>
            </View>
            <View style={profileStyles.rightContent}>
              <Text style={profileStyles.dots}>⋯</Text>
            </View>
          </View>
          
          {/* Stats section */}
          <View style={profileStyles.statsContainer}>
            <View style={profileStyles.statItem}>
              <Text style={profileStyles.statNumber}>{stats.points}</Text>
              <Text style={profileStyles.statLabel}>Points</Text>
            </View>
            <View style={profileStyles.statItem}>
              <Text style={profileStyles.statNumber}>{stats.global}</Text>
              <Text style={profileStyles.statLabel}>Global</Text>
            </View>
            <View style={profileStyles.statItem}>
              <Text style={profileStyles.statNumber}>{stats.local}</Text>
              <Text style={profileStyles.statLabel}>Local</Text>
            </View>
          </View>
        </View>
        );
      })}
    </ScrollView>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navTabs}>
          <TouchableOpacity style={[styles.navTab, styles.activeTab]}>
            <Text style={[styles.navTabText, styles.activeTabText]}>Designer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <Text style={styles.navTabText}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <Text style={styles.navTabText}>Attention</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      
      {/* Profile Cards */}
      <ProfileCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c471ed',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#c471ed',
  },
  navTabs: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  navTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
  },
  navTabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const profileStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 10,
  },
  body: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    height: 180,
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImg: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    flexShrink: 1,
  },
  title: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  dots: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});
