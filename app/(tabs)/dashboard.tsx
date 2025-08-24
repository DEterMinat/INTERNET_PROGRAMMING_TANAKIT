import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppLayout from '../../components/AppLayout';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function Dashboard() {
  // Enhanced data with trends and insights
  const quickStats = [
    { 
      title: 'สินค้าทั้งหมด', 
      value: '1,247', 
      trend: '+12.5%', 
      trendUp: true,
      description: 'เพิ่มขึ้นจากเดือนที่แล้ว',
      icon: 'https://img.icons8.com/fluency/48/warehouse.png',
      gradient: ['#3B82F6', '#1E3A8A']
    },
    { 
      title: 'สินค้าใกล้หมด', 
      value: '23', 
      trend: '-18.2%', 
      trendUp: false,
      description: 'ลดลงจากการเติมสต๊อก',
      icon: 'https://img.icons8.com/fluency/48/close-box.png',
      gradient: ['#EF4444', '#B91C1C']
    },
    { 
      title: 'ออเดอร์วันนี้', 
      value: '89', 
      trend: '+24.7%', 
      trendUp: true,
      description: 'เพิ่มขึ้นจากสัปดาห์ที่แล้ว',
      icon: 'https://img.icons8.com/fluency/48/shopping-cart.png',
      gradient: ['#10B981', '#047857']
    },
    { 
      title: 'มูลค่าคลังสินค้า', 
      value: '2.4M', 
      trend: '+8.9%', 
      trendUp: true,
      description: 'บาท (THB)',
      icon: 'https://img.icons8.com/fluency/48/money-bag.png',
      gradient: ['#8B5CF6', '#5B21B6']
    }
  ];

  const topProducts = [
    { 
      id: 1, 
      name: 'เครื่องปรับอากาศ Samsung 18000 BTU', 
      category: 'เครื่องใช้ไฟฟ้า',
      stock: 45, 
      sold: 128,
      revenue: '฿384,000',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop'
    },
    { 
      id: 2, 
      name: 'โทรศัพท์มือถือ iPhone 15 Pro Max', 
      category: 'อิเล็กทรอนิกส์',
      stock: 12, 
      sold: 89,
      revenue: '฿890,000',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop'
    },
    { 
      id: 3, 
      name: 'เครื่องซักผ้า LG 12 กิโลกรัม', 
      category: 'เครื่องใช้ไฟฟ้า',
      stock: 28, 
      sold: 67,
      revenue: '฿268,000',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
    }
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'stock_in', 
      title: 'รับสินค้าเข้าคลัง', 
      description: 'เครื่องปรับอากาศ Samsung +50 ชิ้น',
      time: '2 นาทีที่แล้ว',
      icon: 'https://img.icons8.com/fluency/24/plus.png',
      color: '#10B981'
    },
    { 
      id: 2, 
      type: 'order', 
      title: 'ออเดอร์ใหม่', 
      description: 'คำสั่งซื้อ #ORD-2024-001247',
      time: '5 นาทีที่แล้ว',
      icon: 'https://img.icons8.com/fluency/24/shopping-cart.png',
      color: '#3B82F6'
    },
    { 
      id: 3, 
      type: 'low_stock', 
      title: 'แจ้งเตือนสต๊อกต่ำ', 
      description: 'iPhone 15 Pro Max เหลือ 12 ชิ้น',
      time: '12 นาทีที่แล้ว',
      icon: 'https://img.icons8.com/fluency/24/warning-shield.png',
      color: '#EF4444'
    },
    { 
      id: 4, 
      type: 'user', 
      title: 'ผู้ใช้งานใหม่', 
      description: 'พนักงานคลัง: สมชาย ใจดี',
      time: '1 ชั่วโมงที่แล้ว',
      icon: 'https://img.icons8.com/fluency/24/user-male-circle.png',
      color: '#8B5CF6'
    }
  ];

  const quickActions = [
    { 
      title: 'เพิ่มสินค้าใหม่', 
      description: 'เพิ่มรายการสินค้าใหม่เข้าสู่ระบบ',
      icon: 'https://img.icons8.com/fluency/32/plus.png',
      gradient: ['#10B981', '#047857'],
      route: '/inventory/add'
    },
    { 
      title: 'สร้างออเดอร์', 
      description: 'สร้างคำสั่งซื้อสำหรับลูกค้า',
      icon: 'https://img.icons8.com/fluency/32/shopping-cart.png',
      gradient: ['#3B82F6', '#1E3A8A'],
      route: '/orders/create'
    },
    { 
      title: 'ตรวจสอบสต๊อก', 
      description: 'ดูรายการสินค้าที่ใกล้หมด',
      icon: 'https://img.icons8.com/fluency/32/search.png',
      gradient: ['#EF4444', '#B91C1C'],
      route: '/inventory/check'
    },
    { 
      title: 'รายงานการขาย', 
      description: 'ดูรายงานยอดขายรายวัน',
      icon: 'https://img.icons8.com/fluency/32/bar-chart.png',
      gradient: ['#8B5CF6', '#5B21B6'],
      route: '/reports/sales'
    }
  ];

  return (
    <AppLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>สวัสดีครับ ธนกิตต์ แสงสว่าง 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              วันนี้ {new Date().toLocaleDateString('th-TH', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.welcomeDescription}>
              ระบบพร้อมใช้งาน • ข้อมูลอัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
              })} น.
            </Text>
          </View>
          <View style={styles.welcomeIcon}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency/64/dashboard-layout.png' }}
              style={styles.welcomeIconImage}
            />
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 สถิติภาพรวม</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <TouchableOpacity key={index} style={[styles.statCard, isTablet && styles.statCardTablet]}>
                <LinearGradient
                  colors={[stat.gradient[0], stat.gradient[1]] as const}
                  style={styles.statGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.statHeader}>
                    <View style={styles.statIconContainer}>
                      <Image source={{ uri: stat.icon }} style={styles.statIcon} />
                    </View>
                    <View style={[styles.trendBadge, { backgroundColor: stat.trendUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
                      <Text style={[styles.trendText, { color: stat.trendUp ? '#10B981' : '#EF4444' }]}>
                        {stat.trend}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statDescription}>{stat.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>⚡ การดำเนินการด่วน</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={[styles.actionCard, isTablet && styles.actionCardTablet]}>
                <LinearGradient
                  colors={[action.gradient[0], action.gradient[1], 'transparent'] as const}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.actionContent}>
                    <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                      <Image source={{ uri: action.icon }} style={styles.actionIcon} />
                    </View>
                    <View style={styles.actionTextContainer}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionDescription}>{action.description}</Text>
                    </View>
                    <View style={styles.actionArrow}>
                      <Image 
                        source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/right.png' }}
                        style={styles.arrowIcon}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Content Grid */}
        <View style={[styles.mainGrid, isTablet && styles.mainGridTablet]}>
          {/* Chart Section */}
          <View style={[styles.chartSection, isTablet && styles.chartSectionTablet]}>
            <Text style={styles.sectionTitle}>📈 ยอดขายรายสัปดาห์</Text>
            <View style={styles.chartPlaceholder}>
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency/64/combo-chart.png' }}
                style={styles.chartIcon}
              />
              <Text style={styles.chartPlaceholderText}>
                กราฟแสดงยอดขายรายสัปดาห์
              </Text>
              <Text style={styles.chartPlaceholderSubtext}>
                สัปดาห์นี้: +24.7% เทียบกับสัปดาห์ที่แล้ว
              </Text>
              <TouchableOpacity style={styles.viewReportButton}>
                <Text style={styles.viewReportButtonText}>ดูรายงานฉบับเต็ม</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Top Products */}
          <View style={[styles.topProductsSection, isTablet && styles.topProductsSectionTablet]}>
            <Text style={styles.sectionTitle}>🏆 สินค้าขายดี Top 3</Text>
            <View style={styles.productsList}>
              {topProducts.map((product, index) => (
                <TouchableOpacity key={product.id} style={styles.productItem}>
                  <View style={styles.productRank}>
                    <Text style={styles.rankNumber}>#{index + 1}</Text>
                  </View>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <View style={styles.productStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemLabel}>คงเหลือ</Text>
                        <Text style={[styles.statItemValue, { color: product.stock < 20 ? '#EF4444' : '#10B981' }]}>
                          {product.stock} ชิ้น
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemLabel}>ขายแล้ว</Text>
                        <Text style={styles.statItemValue}>{product.sold} ชิ้น</Text>
                      </View>
                    </View>
                    <Text style={styles.productRevenue}>{product.revenue}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 กิจกรรมล่าสุด</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>ดูทั้งหมด</Text>
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency-systems-filled/12/right.png' }}
                style={styles.viewAllIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <TouchableOpacity key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIconContainer, { backgroundColor: `${activity.color}20` }]}>
                  <Image 
                    source={{ uri: activity.icon }} 
                    style={[styles.activityIcon, { tintColor: activity.color }]} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View style={styles.activityArrow}>
                  <Image 
                    source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/right.png' }}
                    style={[styles.arrowIcon, { tintColor: '#94A3B8' }]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
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

  // Welcome Section Styles
  welcomeSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  welcomeDescription: {
    fontSize: 12,
    color: '#94A3B8',
  },
  welcomeIcon: {
    marginLeft: 16,
  },
  welcomeIconImage: {
    width: 48,
    height: 48,
  },

  // Stats Section Styles
  statsContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 44) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardTablet: {
    minWidth: (width - 80) / 4,
  },
  statGradient: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 24,
    height: 24,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Quick Actions Styles
  quickActionsSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardTablet: {
    flexDirection: 'row',
    flex: 1,
  },
  actionGradient: {
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionArrow: {
    marginLeft: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },

  // Main Grid Styles
  mainGrid: {
    marginHorizontal: 16,
    marginTop: 24,
    gap: 16,
  },
  mainGridTablet: {
    flexDirection: 'row',
  },

  // Chart Section Styles
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  chartSectionTablet: {
    flex: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginTop: 12,
  },
  chartIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  viewReportButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewReportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Top Products Styles
  topProductsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  topProductsSectionTablet: {
    flex: 1,
  },
  productsList: {
    marginTop: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 12,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statItem: {
    marginRight: 16,
  },
  statItemLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  statItemValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },

  // Activities Section Styles
  activitiesSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginRight: 4,
  },
  viewAllIcon: {
    width: 12,
    height: 12,
    tintColor: '#3B82F6',
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIcon: {
    width: 20,
    height: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  activityArrow: {
    marginLeft: 8,
  },

  // Utility Styles
  bottomSpacing: {
    height: 32,
  },
});
