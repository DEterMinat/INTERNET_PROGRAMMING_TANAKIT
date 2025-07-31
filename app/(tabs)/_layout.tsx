import { Tabs, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface MenuItem {
  name: string;
  title: string;
  emoji: string;
  description: string;
  isMain?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'dashboard', title: 'Dashboard', emoji: '📊', description: 'Overview & Analytics', isMain: true },
  { name: 'inventorylist', title: 'Inventory', emoji: '📦', description: 'Manage Stock Items', isMain: true },
  { name: 'addedit', title: 'Add/Edit', emoji: '➕', description: 'Add New Products', isMain: true },
  { name: 'stockmovement', title: 'Stock Movement', emoji: '🔄', description: 'Track Stock Changes', isMain: true },
  { name: 'alerts', title: 'Alerts', emoji: '🔔', description: 'Notifications & Warnings' },
  { name: 'backoffice', title: 'Back Office', emoji: '🏢', description: 'Management Hub' },
  { name: 'index', title: 'Home', emoji: '🏠', description: 'Main Menu' },
  { name: 'explore', title: 'Explore', emoji: '🧭', description: 'Discover Features' },
  { name: 'login', title: 'Login', emoji: '👤', description: 'User Authentication' },
  { name: 'products', title: 'Products', emoji: '🛍️', description: 'Product Catalog' },
  { name: 'profile', title: 'Profile', emoji: '👨‍💼', description: 'User Profile' },
  { name: 'register', title: 'Register', emoji: '📝', description: 'Create Account' },
];

function CustomTabBar() {
  const [showMenu, setShowMenu] = useState(false);
  const colorScheme = useColorScheme();

  const mainItems = menuItems.filter(item => item.isMain);
  const allItems = menuItems;

  const handleNavigate = (route: string) => {
    setShowMenu(false);
    router.push(`/(tabs)/${route}` as any);
  };

  const MenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => handleNavigate(item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.menuEmoji}>{item.emoji}</Text>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.title}
          </Text>
          <Text style={[styles.menuDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.customTabBar, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
          <Text style={[styles.menuButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Menu
          </Text>
        </TouchableOpacity>

        {/* Main Navigation Items for larger screens */}
        {isTablet && (
          <View style={styles.mainNavContainer}>
            {mainItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.mainNavItem}
                onPress={() => handleNavigate(item.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.mainNavEmoji}>{item.emoji}</Text>
                <Text style={[styles.mainNavText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Access (Mobile only) */}
        {!isTablet && (
          <View style={styles.quickAccessContainer}>
            {mainItems.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.quickAccessItem}
                onPress={() => handleNavigate(item.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickAccessEmoji}>{item.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Full Menu Modal */}
      <Modal
        visible={showMenu}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMenu(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Navigation Menu
            </Text>
            <TouchableOpacity onPress={() => setShowMenu(false)}>
              <Text style={[styles.closeButton, { color: Colors[colorScheme ?? 'light'].tint }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.menuScrollView}
            contentContainerStyle={styles.menuContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Main Functions
            </Text>
            {mainItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}

            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Other Pages
            </Text>
            {allItems.filter(item => !item.isMain).map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}>
        {menuItems.map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.title,
              tabBarIcon: () => <Text>{item.emoji}</Text>,
            }}
          />
        ))}
      </Tabs>
      <CustomTabBar />
    </>
  );
}

const styles = StyleSheet.create({
  customTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#007AFF',
    marginBottom: 2,
  },
  menuButtonText: {
    fontSize: 10,
    fontWeight: '600',
  },
  mainNavContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  mainNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  mainNavEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  mainNavText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickAccessItem: {
    padding: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  quickAccessEmoji: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuScrollView: {
    flex: 1,
  },
  menuContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  menuItem: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuEmoji: {
    fontSize: 24,
    marginRight: 16,
    width: 30,
    textAlign: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
});
