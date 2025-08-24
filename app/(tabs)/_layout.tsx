import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าแรก',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'แดชบอร์ด',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'สินค้า',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'คลังสินค้า',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'สำรวจ',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'เข้าสู่ระบบ',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'สมัครสมาชิก',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ color, focused }) => <></>,
        }}
      />
    </Tabs>
  );
}
