import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AppLayout from '../../components/AppLayout';

interface AlertItem {
  id: number;
  type: 'low_stock' | 'out_of_stock' | 'expired' | 'maintenance' | 'system' | 'order';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  productName?: string;
  currentStock?: number;
  minStock?: number;
  location?: string;
  actionRequired: boolean;
}

export default function Alerts() {
  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [selectedSeverity, setSelectedSeverity] = useState('ทั้งหมด');

  // Mock alerts data
  const alertsData: AlertItem[] = [
    {
      id: 1,
      type: 'low_stock',
      title: 'สินค้าใกล้หมดสต๊อก',
      description: 'โทรศัพท์มือถือ iPhone 15 Pro Max เหลือเพียง 8 ชิ้น',
      severity: 'high',
      timestamp: '5 นาทีที่แล้ว',
      isRead: false,
      productName: 'iPhone 15 Pro Max 256GB',
      currentStock: 8,
      minStock: 15,
      location: 'B2-05',
      actionRequired: true
    },
    {
      id: 2,
      type: 'out_of_stock',
      title: 'สินค้าหมดสต๊อก',
      description: 'เครื่องซักผ้า LG 12 กิโลกรัม หมดสต๊อกแล้ว',
      severity: 'high',
      timestamp: '15 นาทีที่แล้ว',
      isRead: false,
      productName: 'เครื่องซักผ้า LG 12 กิโลกรัม',
      currentStock: 0,
      minStock: 5,
      location: 'A2-03',
      actionRequired: true
    },
    {
      id: 3,
      type: 'order',
      title: 'ออเดอร์ใหม่รอดำเนินการ',
      description: 'คำสั่งซื้อ #ORD-2024-001248 รอการจัดส่ง',
      severity: 'medium',
      timestamp: '30 นาทีที่แล้ว',
      isRead: true,
      actionRequired: true
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'ระบบบำรุงรักษา',
      description: 'ระบบจะปิดบำรุงรักษาในวันอาทิตย์ที่ 25 ส.ค. 2567',
      severity: 'medium',
      timestamp: '2 ชั่วโมงที่แล้ว',
      isRead: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'expired',
      title: 'สินค้าใกล้หมดอายุ',
      description: 'ผลิตภัณฑ์ 3 รายการจะหมดอายุภายใน 30 วัน',
      severity: 'medium',
      timestamp: '3 ชั่วโมงที่แล้ว',
      isRead: true,
      actionRequired: true
    },
    {
      id: 6,
      type: 'system',
      title: 'อัพเดทระบบสำเร็จ',
      description: 'ระบบได้รับการอัพเดทเป็นเวอร์ชัน 2.1.5 แล้ว',
      severity: 'low',
      timestamp: '1 วันที่แล้ว',
      isRead: true,
      actionRequired: false
    }
  ];

  const filterOptions = ['ทั้งหมด', 'ยังไม่อ่าน', 'ต้องดำเนินการ', 'อ่านแล้ว'];
  const severityOptions = ['ทั้งหมด', 'สำคัญมาก', 'ปานกลาง', 'ต่ำ'];

  // Calculate stats
  const stats = {
    total: alertsData.length,
    unread: alertsData.filter(alert => !alert.isRead).length,
    high: alertsData.filter(alert => alert.severity === 'high').length,
    actionRequired: alertsData.filter(alert => alert.actionRequired).length
  };

  // Filter alerts
  const filteredAlerts = alertsData.filter(alert => {
    const matchesFilter = selectedFilter === 'ทั้งหมด' ||
                         (selectedFilter === 'ยังไม่อ่าน' && !alert.isRead) ||
                         (selectedFilter === 'ต้องดำเนินการ' && alert.actionRequired) ||
                         (selectedFilter === 'อ่านแล้ว' && alert.isRead);
    
    const matchesSeverity = selectedSeverity === 'ทั้งหมด' ||
                           (selectedSeverity === 'สำคัญมาก' && alert.severity === 'high') ||
                           (selectedSeverity === 'ปานกลาง' && alert.severity === 'medium') ||
                           (selectedSeverity === 'ต่ำ' && alert.severity === 'low');

    return matchesFilter && matchesSeverity;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return 'https://img.icons8.com/fluency/32/warning-shield.png';
      case 'out_of_stock': return 'https://img.icons8.com/fluency/32/close-box.png';
      case 'expired': return 'https://img.icons8.com/fluency/32/time.png';
      case 'maintenance': return 'https://img.icons8.com/fluency/32/maintenance.png';
      case 'system': return 'https://img.icons8.com/fluency/32/system-information.png';
      case 'order': return 'https://img.icons8.com/fluency/32/shopping-cart.png';
      default: return 'https://img.icons8.com/fluency/32/info.png';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'สำคัญมาก';
      case 'medium': return 'ปานกลาง';
      case 'low': return 'ต่ำ';
      default: return 'ปกติ';
    }
  };

  const renderAlert = ({ item }: { item: AlertItem }) => (
    <TouchableOpacity style={[styles.alertItem, !item.isRead && styles.alertItemUnread]}>
      <View style={styles.alertLeft}>
        <View style={[styles.alertIconContainer, { backgroundColor: `${getSeverityColor(item.severity)}20` }]}>
          <Image 
            source={{ uri: getAlertIcon(item.type) }} 
            style={[styles.alertIcon, { tintColor: getSeverityColor(item.severity) }]} 
          />
        </View>
      </View>
      
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={[styles.alertTitle, !item.isRead && styles.alertTitleUnread]}>
            {item.title}
          </Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
            <Text style={styles.severityText}>{getSeverityText(item.severity)}</Text>
          </View>
        </View>
        
        <Text style={styles.alertDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        {item.productName && (
          <View style={styles.productInfo}>
            <Text style={styles.productName}>📦 {item.productName}</Text>
            {item.location && (
              <Text style={styles.productLocation}>📍 {item.location}</Text>
            )}
            {item.currentStock !== undefined && (
              <Text style={styles.stockInfo}>
                คงเหลือ: {item.currentStock} ชิ้น (ขั้นต่ำ: {item.minStock} ชิ้น)
              </Text>
            )}
          </View>
        )}
        
        <View style={styles.alertFooter}>
          <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
          {item.actionRequired && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>ดำเนินการ</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.alertRight}>
        {!item.isRead && <View style={styles.unreadDot} />}
        <TouchableOpacity style={styles.moreButton}>
          <Image 
            source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/more-2.png' }} 
            style={styles.moreIcon} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Header Stats */}
        <View style={styles.statsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#3B82F6', '#1E3A8A']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/bell.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>การแจ้งเตือนทั้งหมด</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/important-mail.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.unread}</Text>
                <Text style={styles.statLabel}>ยังไม่อ่าน</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/warning-shield.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.high}</Text>
                <Text style={styles.statLabel}>สำคัญมาก</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#10B981', '#047857']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/task.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.actionRequired}</Text>
                <Text style={styles.statLabel}>ต้องดำเนินการ</Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <Text style={styles.filterLabel}>สถานะ:</Text>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.filterChip, selectedFilter === option && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(option)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedFilter === option && styles.filterChipTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <Text style={styles.filterLabel}>ความสำคัญ:</Text>
              {severityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.filterChip, selectedSeverity === option && styles.filterChipActive]}
                  onPress={() => setSelectedSeverity(option)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedSeverity === option && styles.filterChipTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Actions Bar */}
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.actionBarButton}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/checkmark.png' }} 
              style={styles.actionBarIcon} 
            />
            <Text style={styles.actionBarText}>อ่านทั้งหมด</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBarButton}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/delete-sign.png' }} 
              style={styles.actionBarIcon} 
            />
            <Text style={styles.actionBarText}>ลบที่อ่านแล้ว</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBarButton}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/settings.png' }} 
              style={styles.actionBarIcon} 
            />
            <Text style={styles.actionBarText}>ตั้งค่า</Text>
          </TouchableOpacity>
        </View>

        {/* Alerts List */}
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            <Text style={styles.resultCount}>
              พบ {filteredAlerts.length} รายการ
            </Text>
          </View>

          <FlatList
            data={filteredAlerts}
            renderItem={renderAlert}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Stats Section
  statsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  statsScroll: {
    paddingHorizontal: 16,
  },
  statCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 140,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Filters Section
  filtersSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 12,
    alignSelf: 'center',
    minWidth: 80,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Actions Bar
  actionsBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  actionBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  actionBarIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#64748B',
  },
  actionBarText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },

  // Content
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentHeader: {
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: '#64748B',
  },

  // List
  listContainer: {
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },

  // Alert Item
  alertItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  alertItemUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    backgroundColor: '#FAFBFF',
  },
  alertLeft: {
    marginRight: 12,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    width: 24,
    height: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  alertTitleUnread: {
    fontWeight: 'bold',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  alertDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  productInfo: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  productLocation: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  stockInfo: {
    fontSize: 12,
    color: '#64748B',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  alertRight: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginBottom: 8,
  },
  moreButton: {
    padding: 4,
  },
  moreIcon: {
    width: 16,
    height: 16,
    tintColor: '#94A3B8',
  },
});
