import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';

export default function ProfileScreen() {
  const [user] = useState({
    name: 'ธนกฤษ ศิริธีรพันธ์',
    email: 'tanakit@example.com',
    role: 'ผู้ดูแลระบบ',
    department: 'แผนก IT',
    joinDate: '15 มีนาคม 2023',
    avatar: require('@/assets/images/profile1.png'),
  });

  const profileActions = [
    {
      id: 'edit',
      title: 'แก้ไขข้อมูลส่วนตัว',
      icon: '✏️',
      color: '#2563EB',
      onPress: () => Alert.alert('แก้ไขข้อมูล', 'ฟีเจอร์แก้ไขข้อมูลส่วนตัว'),
    },
    {
      id: 'security',
      title: 'ความปลอดภัย',
      icon: '🔒',
      color: '#059669',
      onPress: () => Alert.alert('ความปลอดภัย', 'ฟีเจอร์จัดการความปลอดภัย'),
    },
    {
      id: 'notifications',
      title: 'การแจ้งเตือน',
      icon: '🔔',
      color: '#F59E0B',
      onPress: () => Alert.alert('การแจ้งเตือน', 'ฟีเจอร์จัดการการแจ้งเตือน'),
    },
    {
      id: 'help',
      title: 'ความช่วยเหลือ',
      icon: '❓',
      color: '#7C3AED',
      onPress: () => Alert.alert('ความช่วยเหลือ', 'ฟีเจอร์ความช่วยเหลือ'),
    },
  ];

  const stats = [
    { label: 'สินค้าที่จัดการ', value: '147', color: '#2563EB' },
    { label: 'รายการใหม่', value: '23', color: '#059669' },
    { label: 'แจ้งเตือน', value: '5', color: '#F59E0B' },
    { label: 'รายงาน', value: '12', color: '#DC2626' },
  ];

  return (
    <SidebarLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={user.avatar} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.userDepartment}>{user.department}</Text>
            <Text style={styles.joinDate}>เข้าร่วมเมื่อ {user.joinDate}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>สถิติการใช้งาน</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>การจัดการบัญชี</Text>
          {profileActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <Text style={styles.actionIconText}>{action.icon}</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>จัดการ{action.title}</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>ข้อมูลบัญชี</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>อีเมล</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>แผนก</Text>
              <Text style={styles.infoValue}>{user.department}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>สิทธิการเข้าถึง</Text>
              <Text style={styles.infoValue}>ผู้ดูแลระบบ</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => Alert.alert('ออกจากระบบ', 'คุณแน่ใจหรือไม่ที่จะออกจากระบบ?')}
          >
            <Text style={styles.logoutText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editAvatarIcon: {
    fontSize: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 4,
  },
  userDepartment: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginLeft: 16,
  },
  statsContainer: {
    marginVertical: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 4,
    flex: 1,
    minWidth: '45%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsContainer: {
    marginVertical: 8,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionArrow: {
    fontSize: 24,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  infoContainer: {
    marginVertical: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  logoutContainer: {
    margin: 16,
    marginTop: 32,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
