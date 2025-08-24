import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  Switch
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import { LinearGradient } from 'expo-linear-gradient';

export default function Profile() {
  const [user] = useState({
    name: 'ธนกิตต์ แสงสว่าง',
    email: 'tanakit@example.com',
    role: 'ผู้ดูแลระบบ',
    department: 'แผนก IT',
    joinDate: '15 มีนาคม 2023',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '081-234-5678',
    location: 'กรุงเทพมหานคร',
    employeeId: 'EMP-2023-001'
  });

  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    autoBackup: true,
    twoFactor: false
  });

  const stats = [
    { 
      title: 'วันที่เข้าร่วม', 
      value: user.joinDate, 
      icon: 'https://img.icons8.com/fluency/32/calendar.png',
      gradient: ['#3B82F6', '#1E3A8A']
    },
    { 
      title: 'การแจ้งเตือนวันนี้', 
      value: '12', 
      icon: 'https://img.icons8.com/fluency/32/bell.png',
      gradient: ['#10B981', '#047857']
    },
    { 
      title: 'งานที่สำเร็จ', 
      value: '89%', 
      icon: 'https://img.icons8.com/fluency/32/task.png',
      gradient: ['#F59E0B', '#D97706']
    },
    { 
      title: 'ออนไลน์', 
      value: '247 ชม.', 
      icon: 'https://img.icons8.com/fluency/32/time.png',
      gradient: ['#8B5CF6', '#5B21B6']
    }
  ];

  const profileSections = [
    {
      id: 'account',
      title: '👤 บัญชีผู้ใช้',
      items: [
        { 
          id: 'edit', 
          title: 'แก้ไขข้อมูลส่วนตัว', 
          subtitle: 'ชื่อ, อีเมล, เบอร์โทร',
          icon: 'https://img.icons8.com/fluency/24/edit.png',
          action: () => Alert.alert('แก้ไขข้อมูล', 'ฟีเจอร์แก้ไขข้อมูลส่วนตัว')
        },
        { 
          id: 'security', 
          title: 'ความปลอดภัย', 
          subtitle: 'รหัสผ่าน, การยืนยันตัวตน',
          icon: 'https://img.icons8.com/fluency/24/security-checked.png',
          action: () => Alert.alert('ความปลอดภัย', 'ตั้งค่าความปลอดภัยบัญชี')
        },
        { 
          id: 'privacy', 
          title: 'ความเป็นส่วนตัว', 
          subtitle: 'การตั้งค่าความเป็นส่วนตัว',
          icon: 'https://img.icons8.com/fluency/24/privacy.png',
          action: () => Alert.alert('ความเป็นส่วนตัว', 'จัดการความเป็นส่วนตัว')
        }
      ]
    },
    {
      id: 'work',
      title: '💼 การทำงาน',
      items: [
        { 
          id: 'schedule', 
          title: 'ตารางงาน', 
          subtitle: 'ดูตารางและนัดหมาย',
          icon: 'https://img.icons8.com/fluency/24/planner.png',
          action: () => Alert.alert('ตารางงาน', 'ตารางการทำงานของคุณ')
        },
        { 
          id: 'performance', 
          title: 'ประสิทธิภาพการทำงาน', 
          subtitle: 'รายงานและสถิติ',
          icon: 'https://img.icons8.com/fluency/24/combo-chart.png',
          action: () => Alert.alert('ประสิทธิภาพ', 'ดูประสิทธิภาพการทำงาน')
        },
        { 
          id: 'history', 
          title: 'ประวัติการทำงาน', 
          subtitle: 'บันทึกกิจกรรมทั้งหมด',
          icon: 'https://img.icons8.com/fluency/24/time-machine.png',
          action: () => Alert.alert('ประวัติ', 'ประวัติการทำงานของคุณ')
        }
      ]
    },
    {
      id: 'system',
      title: '⚙️ ระบบ',
      items: [
        { 
          id: 'help', 
          title: 'ช่วยเหลือและสนับสนุน', 
          subtitle: 'คำถามที่พบบ่อย, ติดต่อฝ่ายสนับสนุน',
          icon: 'https://img.icons8.com/fluency/24/help.png',
          action: () => Alert.alert('ช่วยเหลือ', 'ศูนย์ช่วยเหลือ')
        },
        { 
          id: 'about', 
          title: 'เกี่ยวกับแอป', 
          subtitle: 'เวอร์ชัน 2.1.5',
          icon: 'https://img.icons8.com/fluency/24/info.png',
          action: () => Alert.alert('เกี่ยวกับ', 'Inventory Pro v2.1.5\n\nสร้างโดย: ทีมพัฒนา\nอัพเดทล่าสุด: 24 ส.ค. 2567')
        }
      ]
    }
  ];

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#3B82F6', '#1E3A8A']}
            style={styles.profileHeaderGradient}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEditButton}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/camera.png' }}
                  style={styles.avatarEditIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.userDepartment}>{user.department}</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/14/email.png' }}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{user.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/14/phone.png' }}
                  style={styles.contactIcon}
                />
                <Text style={styles.contactText}>{user.phone}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <LinearGradient colors={stat.gradient as any} style={styles.statGradient}>
                  <Image source={{ uri: stat.icon }} style={styles.statIcon} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>🔧 การตั้งค่าด่วน</Text>
          <View style={styles.settingsGrid}>
            {Object.entries(settings).map(([key, value]) => (
              <View key={key} style={styles.settingCard}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>
                    {key === 'notifications' ? 'การแจ้งเตือน' :
                     key === 'emailAlerts' ? 'อีเมลแจ้งเตือน' :
                     key === 'darkMode' ? 'โหมดมืด' :
                     key === 'autoBackup' ? 'สำรองข้อมูลอัตโนมัติ' :
                     key === 'twoFactor' ? 'การยืนยันตัวตน 2 ขั้นตอน' : key}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {value ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={() => toggleSetting(key as keyof typeof settings)}
                  trackColor={{ false: '#F1F5F9', true: '#3B82F6' }}
                  thumbColor={value ? '#FFFFFF' : '#64748B'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => (
                <TouchableOpacity key={item.id} style={styles.sectionItem} onPress={item.action}>
                  <View style={styles.itemLeft}>
                    <View style={styles.itemIconContainer}>
                      <Image source={{ uri: item.icon }} style={styles.itemIcon} />
                    </View>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <Image 
                    source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/right.png' }}
                    style={styles.itemArrow}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
              { text: 'ยกเลิก', style: 'cancel' },
              { text: 'ออกจากระบบ', style: 'destructive' }
            ])}
          >
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/exit.png' }}
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Profile Header
  profileHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileHeaderGradient: {
    padding: 24,
    alignItems: 'center',
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
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditIcon: {
    width: 16,
    height: 16,
    tintColor: '#3B82F6',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  contactInfo: {
    alignItems: 'center',
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 14,
    height: 14,
    tintColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
  },
  contactText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Stats Section
  statsSection: {
    marginTop: 20,
  },
  statsScroll: {
    paddingLeft: 16,
  },
  statCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 120,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Settings Section
  settingsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  settingsGrid: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748B',
  },

  // Sections
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.3)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemIcon: {
    width: 20,
    height: 20,
    tintColor: '#3B82F6',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  itemArrow: {
    width: 16,
    height: 16,
    tintColor: '#94A3B8',
  },

  // Logout Section
  logoutSection: {
    margin: 16,
    marginTop: 32,
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: '#EF4444',
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },

  // Utility
  bottomSpacing: {
    height: 32,
  },
});
