import MenuNavigator from '@/components/MenuNavigator';
import { useRouter } from 'expo-router';
import React from 'react';

export default function TabTwoScreen() {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    switch (route) {
      case 'designers':
        router.push('/(tabs)');
        break;
      case 'login':
        router.push('/(tabs)/login');
        break;
      case 'products':
        router.push('/(tabs)/products');
        break;
      default:
        console.log(`Navigation to ${route} not implemented yet`);
    }
  };

  return <MenuNavigator onNavigate={handleNavigate} />;
}
