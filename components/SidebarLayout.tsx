import { useRouter, usePathname } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 70;

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Navigation items matching your design
  const navigationItems = [
    {
      id: 'dashboard',
      title: 'หน้าแรก',
      subtitle: 'ภาพรวมระบบ',
      icon: 'https://img.icons8.com/fluency/28/dashboard.png',
      route: '/',
      badge: null,
    },
    {
      id: 'inventory',
      title: 'คลังสินค้า',
      subtitle: 'จัดการสต็อก',
      icon: 'https://img.icons8.com/fluency/28/warehouse.png',
      route: '/inventory',
      badge: '156',
    },
    {
      id: 'products',
      title: 'สินค้า',
      subtitle: 'รายการสินค้า',
      icon: 'https://img.icons8.com/fluency/28/product.png',
      route: '/products',
      badge: null,
    },
    {
      id: 'orders',
      title: 'คำสั่งซื้อ',
      subtitle: 'ออเดอร์และการขาย',
      icon: 'https://img.icons8.com/fluency/28/shopping-cart.png',
      route: '/orders',
      badge: '12',
    },
    {
      id: 'customers',
      title: 'ลูกค้า',
      subtitle: 'ข้อมูลลูกค้า',
      icon: 'https://img.icons8.com/fluency/28/customer.png',
      route: '/customers',
      badge: null,
    },
    {
      id: 'reports',
      title: 'รายงาน',
      subtitle: 'วิเคราะห์และสถิติ',
      icon: 'https://img.icons8.com/fluency/28/combo-chart.png',
      route: '/reports',
      badge: null,
    },
    {
      id: 'alerts',
      title: 'แจ้งเตือน',
      subtitle: 'การแจ้งเตือนระบบ',
      icon: 'https://img.icons8.com/fluency/28/bell.png',
      route: '/alerts',
      badge: '5',
    },
  ];

  const bottomNavItems = [
    {
      id: 'settings',
      title: 'ตั้งค่า',
      subtitle: 'การตั้งค่าระบบ',
      icon: 'https://img.icons8.com/fluency/28/settings.png',
      route: '/settings',
    },
    {
      id: 'profile',
      title: 'โปรไฟล์',
      subtitle: 'ข้อมูลส่วนตัว',
      icon: 'https://img.icons8.com/fluency/28/user.png',
      route: '/profile',
    },
  ];

  const isActiveRoute = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/(tabs)/' || pathname === '/(tabs)' || pathname.endsWith('index');
    }
    return pathname.includes(route);
  };

  const navigateTo = (route: string) => {
    if (route === '/') {
      router.push('/(tabs)/' as any);
    } else {
      router.push(`(tabs)${route}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      <View style={styles.layout}>
        {/* Sidebar */}
        <View style={[
          styles.sidebar,
          { width: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }
        ]}>
          <LinearGradient
            colors={['#1F2937', '#111827']}
            style={styles.sidebarGradient}
          >
            {/* Header */}
            <View style={styles.sidebarHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoEmoji}>📊</Text>
                </View>
                {!sidebarCollapsed && (
                  <View style={styles.logoText}>
                    <Text style={styles.logoTitle}>StockPro</Text>
                    <Text style={styles.logoSubtitle}>Management</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.collapseButton}
                onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Image 
                  source={{ 
                    uri: sidebarCollapsed 
                      ? 'https://img.icons8.com/fluency-systems-filled/20/expand-arrow.png'
                      : 'https://img.icons8.com/fluency-systems-filled/20/collapse-arrow.png'
                  }}
                  style={styles.collapseIcon}
                />
              </TouchableOpacity>
            </View>

            {/* User Section */}
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' }}
                  style={styles.avatarImage}
                />
              </View>
              {!sidebarCollapsed && (
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>ธนกิตต์ แสงสว่าง</Text>
                  <Text style={styles.userRole}>ผู้ดูแลระบบ</Text>
                </View>
              )}
            </View>

            {/* Navigation */}
            <ScrollView style={styles.navigation} showsVerticalScrollIndicator={false}>
              <View style={styles.navSection}>
                {!sidebarCollapsed && (
                  <Text style={styles.navSectionTitle}>เมนูหลัก</Text>
                )}
                {navigationItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.navItem,
                      isActiveRoute(item.route) && styles.navItemActive,
                      sidebarCollapsed && styles.navItemCollapsed
                    ]}
                    onPress={() => navigateTo(item.route)}
                  >
                    <View style={styles.navItemContent}>
                      <Image source={{ uri: item.icon }} style={[
                        styles.navIcon,
                        isActiveRoute(item.route) && styles.navIconActive
                      ]} />
                      {!sidebarCollapsed && (
                        <View style={styles.navTextContainer}>
                          <Text style={[
                            styles.navTitle,
                            isActiveRoute(item.route) && styles.navTitleActive
                          ]}>
                            {item.title}
                          </Text>
                          <Text style={[
                            styles.navSubtitle,
                            isActiveRoute(item.route) && styles.navSubtitleActive
                          ]}>
                            {item.subtitle}
                          </Text>
                        </View>
                      )}
                      {item.badge && !sidebarCollapsed && (
                        <View style={styles.navBadge}>
                          <Text style={styles.navBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bottom Section */}
              <View style={styles.navBottomSection}>
                {!sidebarCollapsed && (
                  <Text style={styles.navSectionTitle}>ส่วนตัว</Text>
                )}
                {bottomNavItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.navItem,
                      isActiveRoute(item.route) && styles.navItemActive,
                      sidebarCollapsed && styles.navItemCollapsed
                    ]}
                    onPress={() => navigateTo(item.route)}
                  >
                    <View style={styles.navItemContent}>
                      <Image source={{ uri: item.icon }} style={[
                        styles.navIcon,
                        isActiveRoute(item.route) && styles.navIconActive
                      ]} />
                      {!sidebarCollapsed && (
                        <View style={styles.navTextContainer}>
                          <Text style={[
                            styles.navTitle,
                            isActiveRoute(item.route) && styles.navTitleActive
                          ]}>
                            {item.title}
                          </Text>
                          <Text style={[
                            styles.navSubtitle,
                            isActiveRoute(item.route) && styles.navSubtitleActive
                          ]}>
                            {item.subtitle}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={[
          styles.content,
          { marginLeft: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }
        ]}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },

  // Sidebar Styles
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: height,
    zIndex: 1000,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  sidebarGradient: {
    flex: 1,
    paddingTop: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 20,
  },
  logoText: {
    flex: 1,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  logoSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  collapseButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapseIcon: {
    width: 16,
    height: 16,
    tintColor: 'rgba(255, 255, 255, 0.8)',
  },

  // User Section
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Navigation
  navigation: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navSection: {
    marginBottom: 24,
  },
  navBottomSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
    marginBottom: 20,
  },
  navSectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  navItem: {
    marginBottom: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  navItemCollapsed: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: 48,
    height: 48,
    alignSelf: 'center',
    marginBottom: 8,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: 'rgba(255, 255, 255, 0.6)',
  },
  navIconActive: {
    tintColor: '#3B82F6',
  },
  navTextContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  navTitleActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  navSubtitleActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  navBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  navBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
