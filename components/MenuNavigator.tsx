import { Image } from 'expo-image';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconType: 'emoji' | 'url';
  color: string;
  route?: string;
}

interface MenuNavigatorProps {
  onNavigate?: (route: string) => void;
}

export default function MenuNavigator({ onNavigate }: MenuNavigatorProps) {
  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'GUI Design',
      subtitle: 'Graphic User Interface Design',
      icon: '🎨',
      iconType: 'emoji',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: 'Designers',
      subtitle: 'Browse Designer Profiles',
      icon: 'https://static.vecteezy.com/system/resources/previews/000/550/731/original/user-icon-vector.jpg',
      iconType: 'url',
      color: '#4ECDC4',
      route: 'designers',
    },
    {
      id: '3',
      title: 'Login System',
      subtitle: 'User Authentication',
      icon: 'https://th.bing.com/th/id/OIP.VDv2X_HrVRH3zxy6wjuG9wHaHa?w=181&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      iconType: 'url',
      color: '#45B7D1',
      route: 'login',
    },
    {
      id: '4',
      title: 'Products',
      subtitle: 'Show Products Catalog',
      icon: 'https://tse4.mm.bing.net/th/id/OIP.vPR0IyfGd-7m70OAqGuuKwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      iconType: 'url',
      color: '#96CEB4',
      route: 'products',
    },
    {
      id: '5',
      title: 'Navigation',
      subtitle: 'React UI & Navigation',
      icon: '🧭',
      iconType: 'emoji',
      color: '#FFEAA7',
    },
    {
      id: '6',
      title: 'Components',
      subtitle: 'Reusable UI Components',
      icon: '🔧',
      iconType: 'emoji',
      color: '#DDA0DD',
    },
  ];

  const handleItemPress = (item: MenuItem) => {
    if (item.route && onNavigate) {
      onNavigate(item.route);
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: item.color }]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.menuContent}>
        <View style={styles.menuHeader}>
          {item.iconType === 'url' ? (
            <Image 
              source={{ uri: item.icon }} 
              style={styles.menuIconImage}
            />
          ) : (
            <Text style={styles.menuIcon}>{item.icon}</Text>
          )}
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>NEW</Text>
          </View>
        </View>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        <View style={styles.menuFooter}>
          <Text style={styles.learnMore}>Learn More →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>React UI & Navigation</Text>
        <Text style={styles.headerSubtitle}>Study Menu Navigator</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Topics Outline</Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Explore modern React Native UI patterns and navigation techniques
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 20,
  },
  menuGrid: {
    gap: 16,
  },
  menuItem: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 4,
  },
  menuContent: {
    minHeight: 120,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 32,
  },
  menuIconImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#495057',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  menuFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  learnMore: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
  footer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
});
