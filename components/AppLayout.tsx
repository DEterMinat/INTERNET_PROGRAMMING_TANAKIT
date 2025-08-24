import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const segments = useSegments();

  // Get current route name
  const getCurrentRoute = () => {
    if (segments.length <= 1) return 'หน้าแรก';
    
    const lastSegment = segments[segments.length - 1];
    
    // Map routes to display names
    const routeMap: { [key: string]: string } = {
      'index': 'หน้าแรก',
      'dashboard': 'แดชบอร์ด', 
      'inventory': 'คลังสินค้า',
      'alerts': 'แจ้งเตือน',
      'explore': 'สำรวจ',
      'backoffice': 'จัดการระบบ',
      'profile': 'โปรไฟล์',
      'login': 'เข้าสู่ระบบ',
      'register': 'สมัครสมาชิก',
    };
    
    return routeMap[lastSegment] || 'หน้าแรก';
  };

  const navItems = [
    { id: 'index', name: 'หน้าแรก', icon: '🏠', route: '/(tabs)/' },
    { id: 'dashboard', name: 'แดชบอร์ด', icon: '📊', route: '/(tabs)/dashboard' },
    { id: 'inventory', name: 'คลังสินค้า', icon: '📦', route: '/(tabs)/inventory' },
    { id: 'alerts', name: 'แจ้งเตือน', icon: '🔔', route: '/(tabs)/alerts' },
    { id: 'explore', name: 'สำรวจ', icon: '🔍', route: '/(tabs)/explore' },
    { id: 'backoffice', name: 'ระบบ', icon: '⚙️', route: '/(tabs)/backoffice' },
    { id: 'profile', name: 'โปรไฟล์', icon: '👤', route: '/(tabs)/profile' },
  ];

  const currentRoute = getCurrentRoute();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <View style={styles.logoSection}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>📦</Text>
            </View>
            <Text style={styles.appTitle}>Inventory System</Text>
          </View>
          
          <Text style={styles.currentPage}>{currentRoute}</Text>
          
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.content}>
        {children}
      </View>
      
      <View style={styles.bottomNav}>
        <View style={styles.tabContainer}>
          {navItems.map((item) => {
            const isActive = item.name === currentRoute;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => router.push(item.route as any)}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {item.icon}
                </Text>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  currentPage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#EFF6FF',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabIconActive: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabTextActive: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
    textAlign: 'center',
  },
});
