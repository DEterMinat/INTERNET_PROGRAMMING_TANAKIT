import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isLandscape = width > height;

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
      icon: '👥',
      iconType: 'emoji',
      color: '#4ECDC4',
      route: 'designers',
    },
    {
      id: '3',
      title: 'Login System',
      subtitle: 'User Authentication',
      icon: '🔐',
      iconType: 'emoji',
      color: '#45B7D1',
      route: 'login',
    },
    {
      id: '4',
      title: 'Products',
      subtitle: 'Show Products Catalog',
      icon: '🛍️',
      iconType: 'emoji',
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
    {
      id: '7',
      title: 'Dashboard',
      subtitle: 'Analytics & Overview',
      icon: '📊',
      iconType: 'emoji',
      color: '#FF8A80',
      route: 'dashboard',
    },
    {
      id: '8',
      title: 'Inventory',
      subtitle: 'Stock Management',
      icon: '📦',
      iconType: 'emoji',
      color: '#90CAF9',
      route: 'inventorylist',
    },
  ];

  const handleItemPress = (item: MenuItem) => {
    if (item.route && onNavigate) {
      onNavigate(item.route);
    }
  };

  const getColumns = () => {
    if (isTablet) {
      return isLandscape ? 4 : 3;
    }
    return isLandscape ? 3 : 2;
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem, 
        { 
          backgroundColor: item.color,
          width: isTablet 
            ? (width - 48 - (getColumns() - 1) * 16) / getColumns()
            : (width - 48 - (getColumns() - 1) * 16) / getColumns()
        }
      ]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.menuContent}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>NEW</Text>
          </View>
        </View>
        <Text style={[styles.menuTitle, { fontSize: isTablet ? 18 : 16 }]}>
          {item.title}
        </Text>
        <Text style={[styles.menuSubtitle, { fontSize: isTablet ? 14 : 12 }]}>
          {item.subtitle}
        </Text>
        <View style={styles.menuFooter}>
          <Text style={[styles.learnMore, { fontSize: isTablet ? 14 : 12 }]}>
            Learn More →
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: isTablet ? 32 : 28 }]}>
          React UI & Navigation
        </Text>
        <Text style={[styles.headerSubtitle, { fontSize: isTablet ? 18 : 16 }]}>
          Study Menu Navigator
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.menuContainer,
          { paddingHorizontal: isTablet ? 32 : 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { fontSize: isTablet ? 24 : 20 }]}>
          Topics Outline
        </Text>
        
        <View style={[
          styles.menuGrid,
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 16,
          }
        ]}>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={[styles.footer, { marginTop: isTablet ? 60 : 40 }]}>
          <Text style={[styles.footerText, { fontSize: isTablet ? 16 : 14 }]}>
            Explore modern React Native UI patterns and navigation techniques
          </Text>
          
          {/* Additional info for tablets */}
          {isTablet && (
            <View style={styles.tabletInfo}>
              <Text style={styles.tabletInfoText}>
                💡 Tip: This interface is optimized for both mobile and tablet views
              </Text>
              <Text style={styles.tabletInfoText}>
                📱 Current view: {isLandscape ? 'Landscape' : 'Portrait'} • {getColumns()} columns
              </Text>
            </View>
          )}
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
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6C757D',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  menuContainer: {
    paddingVertical: 20,
  },
  sectionTitle: {
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
    minHeight: isTablet ? 140 : 120,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: isTablet ? 36 : 32,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  menuFooter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  learnMore: {
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
  tabletInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabletInfoText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    marginVertical: 2,
  },
});
