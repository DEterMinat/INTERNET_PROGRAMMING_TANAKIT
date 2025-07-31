import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Responsive breakpoints
  const isTablet = screenData.width >= 768;
  const isDesktop = screenData.width >= 1024;
  const isMobile = screenData.width < 768;

  // Tab configuration based on device type
  const getTabBarStyle = () => {
    if (isDesktop) {
      return {
        height: 70,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      };
    } else if (isTablet) {
      return {
        height: 65,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
      };
    } else {
      return Platform.select({
        ios: {
          position: 'absolute' as const,
          height: 60,
          paddingHorizontal: 8,
        },
        default: {
          height: 60,
          paddingHorizontal: 8,
        },
      });
    }
  };

  const getIconSize = () => {
    if (isDesktop) return 32;
    if (isTablet) return 30;
    return 26;
  };

  const getLabelStyle = () => {
    if (isDesktop) {
      return {
        fontSize: 14,
        fontWeight: '600' as const,
        marginTop: 2,
      };
    } else if (isTablet) {
      return {
        fontSize: 13,
        fontWeight: '500' as const,
        marginTop: 1,
      };
    } else {
      return {
        fontSize: 11,
        fontWeight: '500' as const,
      };
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: getTabBarStyle(),
        tabBarLabelStyle: getLabelStyle(),
        tabBarItemStyle: {
          minWidth: isMobile ? 70 : isTablet ? 100 : 120,
          paddingVertical: isMobile ? 4 : isTablet ? 6 : 8,
          flex: isMobile ? 0 : 1,
        },
        tabBarAllowFontScaling: false,
      }}>
      
      {/* Core Business Features - Always Visible */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: isDesktop ? 'Dashboard' : 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventorylist"
        options={{
          title: isDesktop ? 'Inventory List' : 'Stock',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="addedit"
        options={{
          title: isDesktop ? 'Add/Edit Item' : 'Add',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="plus.square.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stockmovement"
        options={{
          title: isDesktop ? 'Stock Movement' : 'Move',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="arrow.up.arrow.down" color={color} />,
        }}
      />

      {/* Secondary Features */}
      <Tabs.Screen
        name="products"
        options={{
          title: isDesktop ? 'Product Catalog' : 'Products',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="cube.box.fill" color={color} />,
        }}
      />

      {/* User & System */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: isDesktop ? 'Account' : 'Login',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="person.circle" color={color} />,
        }}
      />

      {/* Additional Features - Desktop Only */}
      {isDesktop && (
        <>
          <Tabs.Screen
            name="alerts"
            options={{
              title: 'Alerts',
              tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="bell.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="backoffice"
            options={{
              title: 'Back Office',
              tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="building.2.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="register"
            options={{
              title: 'Register',
              tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="person.badge.plus" color={color} />,
            }}
          />
        </>
      )}

      {/* Navigation */}
      <Tabs.Screen
        name="index"
        options={{
          title: isDesktop ? 'Team' : 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <IconSymbol size={getIconSize()} name="paperplane.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}
