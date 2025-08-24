import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';

const { width } = Dimensions.get('window');

export default function Index() {
  const quickActions = [
    { title: 'เพิ่มสินค้าใหม่', icon: '📦', color: '#3B82F6', route: '/inventory' },
    { title: 'ดูรายงาน', icon: '📊', color: '#10B981', route: '/dashboard' },
    { title: 'จัดการผู้ใช้', icon: '👥', color: '#F59E0B', route: '/register' },
    { title: 'ตั้งค่า', icon: '⚙️', color: '#8B5CF6', route: '/profile' }
  ];

  const recentActivities = [
    { action: 'เพิ่มสินค้า', item: 'แล็ปท็อป Dell XPS 13', time: '2 นาทีที่แล้ว', type: 'add' },
    { action: 'แก้ไขสต็อก', item: 'เมาส์ Logitech MX Master', time: '15 นาทีที่แล้ว', type: 'edit' },
    { action: 'ลบสินค้า', item: 'คีย์บอร์ดเก่า', time: '1 ชั่วโมงที่แล้ว', type: 'delete' },
    { action: 'เพิ่มผู้ใช้', item: 'สมชาย ใจดี', time: '2 ชั่วโมงที่แล้ว', type: 'user' }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'add': return '➕';
      case 'edit': return '✏️';
      case 'delete': return '🗑️';
      case 'user': return '👤';
      default: return '📋';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'add': return '#10B981';
      case 'edit': return '#F59E0B';
      case 'delete': return '#EF4444';
      case 'user': return '#3B82F6';
      default: return '#64748B';
    }
  };

  return (
    <SidebarLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#3B82F6', '#1E40AF']}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>ยินดีต้อนรับสู่ระบบจัดการคลังสินค้า</Text>
            <Text style={styles.heroSubtitle}>จัดการสินค้า สต็อก และรายงานได้อย่างมีประสิทธิภาพ</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>เริ่มต้นใช้งาน</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroIllustration}>
            <Text style={styles.heroEmoji}>📊</Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
                <Text style={styles.statEmoji}>📦</Text>
              </View>
              <Text style={styles.statValue}>1,245</Text>
              <Text style={styles.statLabel}>สินค้าทั้งหมด</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.statEmoji}>✅</Text>
              </View>
              <Text style={styles.statValue}>1,198</Text>
              <Text style={styles.statLabel}>สินค้าพร้อมขาย</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
                <Text style={styles.statEmoji}>⚠️</Text>
              </View>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>สินค้าใกล้หมด</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
                <Text style={styles.statEmoji}>❌</Text>
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>สินค้าหมดสต็อก</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>การดำเนินการด่วน</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <LinearGradient
                  colors={[action.color + '20', action.color + '10']}
                  style={styles.actionGradient}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '30' }]}>
                    <Text style={styles.actionEmoji}>{action.icon}</Text>
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>กิจกรรมล่าสุด</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesContainer}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: getActionColor(activity.type) + '20' }]}>
                  <Text style={styles.activityEmoji}>{getActionIcon(activity.type)}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityItem}>{activity.item}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลระบบ</Text>
          <View style={styles.systemInfoContainer}>
            <View style={styles.systemInfoCard}>
              <View style={styles.systemInfoRow}>
                <Text style={styles.systemInfoLabel}>เวอร์ชันระบบ</Text>
                <Text style={styles.systemInfoValue}>v2.1.0</Text>
              </View>
              <View style={styles.systemInfoRow}>
                <Text style={styles.systemInfoLabel}>อัปเดตล่าสุด</Text>
                <Text style={styles.systemInfoValue}>15 ส.ค. 2567</Text>
              </View>
              <View style={styles.systemInfoRow}>
                <Text style={styles.systemInfoLabel}>สถานะเซิร์ฟเวอร์</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>ออนไลน์</Text>
                </View>
              </View>
              <View style={styles.systemInfoRow}>
                <Text style={styles.systemInfoLabel}>ผู้ใช้ออนไลน์</Text>
                <Text style={styles.systemInfoValue}>5 คน</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 32,
    margin: 20,
    borderRadius: 16,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  heroIllustration: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 60,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  activitiesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  systemInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  systemInfoCard: {
    padding: 20,
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  systemInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  bottomSpacing: {
    height: 24,
  },
});
