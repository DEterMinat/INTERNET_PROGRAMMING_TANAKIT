import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';


function ProfileCard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/DEterMinat/INTERNET_PROGRAMMING_TANAKIT/refs/heads/main/public/profiles.json');
        const data = await response.json();
        setProfiles(data);
      } catch (err: any) {
        setError('Failed to load profiles' + (err.message ? `: ${err.message}` : ''));
      }
    };
    loadProfiles();
  }, []);

  // Static image mapping by index
  const images = [
    require('../../assets/images/profile1.png'),
    require('../../assets/images/profile2.png'),
    require('../../assets/images/profile3.png'),
  ];

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }
  if (!profiles.length) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={profileStyles.body}>
      {profiles.map((profile, idx) => (
        <View style={profileStyles.card} key={idx}>
          <Image
            source={images[idx]}
            style={profileStyles.profileImg}
          />
          <Text style={profileStyles.name}>{profile.name}</Text>
          <Text style={profileStyles.title}>{profile.title}</Text>
          <Text style={profileStyles.detail}>Phone: {profile.phone}</Text>
          <Text style={profileStyles.detail}>Email: {profile.email}</Text>
        </View>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  return <ProfileCard />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

const profileStyles = StyleSheet.create({
  body: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    width: 250,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  profileImg: {
    borderRadius: 50,
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    color: '#555',
    marginBottom: 1,
  },
  detail: {
    color: '#555',
    fontSize: 12,
    marginBottom: 1,
  },
});
