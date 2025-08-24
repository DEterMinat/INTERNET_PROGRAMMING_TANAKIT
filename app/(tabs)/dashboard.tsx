import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import { apiService } from '../../services/apiService';

const { width } = Dimensions.get('window');

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูล dashboard จาก API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ดึงข้อมูลสถิติจาก API
      const overviewResponse = await apiService.dashboard.getOverview();

      if (overviewResponse.success && overviewResponse.data) {
        const data = overviewResponse.data as any; // Type assertion สำหรับ API response
        
        // แปลงข้อมูล API เป็น format ที่ใช้ใน UI
        const dashboardStats: StatCard[] = [
          {
            title: 'สินค้าทั้งหมด',
            value: data?.totalProducts?.toLocaleString() || '0',
            change: '+5.2%',
            changeType: 'up',
            icon: '📦',
            color: '#3B82F6'
          },
          {
            title: 'มูลค่าสินค้าคงเหลือ',
            value: `฿${data?.totalValue?.toLocaleString() || '0'}`,
            change: '+2.7%',
            changeType: 'up',
            icon: '💰',
            color: '#10B981'
          },
          {
            title: 'สินค้าใกล้หมด',
            value: data?.lowStockItems?.toString() || '0',
            change: '+12.3%',
            changeType: 'down',
            icon: '⚠️',
            color: '#EF4444'
          },
          {
            title: 'หมวดหมู่สินค้า',
            value: data?.totalCategories?.toString() || '0',
            change: '+8.1%',
            changeType: 'up',
            icon: '📊',
            color: '#8B5CF6'
          }
        ];
        
        setStats(dashboardStats);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setStats([]); // ไม่มีข้อมูล
    } finally {
      setLoading(false);
    }
  };

  const topProducts = [
    { name: 'แล็ปท็อปเกมมิ่ง XYZ ชุ Pro', price: '฿25,900', stock: 45, status: 'ขายดี' },
    { name: 'เมาส์เกมส์ ABC Ultra', price: '฿32,500', stock: 23, status: 'ปกติ' },
    { name: 'หูฟังไร้สาย DEF', price: '฿4,590', stock: 76, status: 'ขายดี' },
    { name: 'คีย์บอร์ดเกมส์ GHI Mark', price: '฿42,900', stock: 12, status: 'เหลือน้อย' },
    { name: 'หน้าจอโค้งระดับ JKL Match', price: '฿7,990', stock: 54, status: 'ปกติ' }
  ];

  const lowStockProducts = [
    { name: 'น้ำล้างจานราคาพิเศษ', stock: 5, status: 'เหลือ 5 ชิ้น' },
    { name: 'ผงซักฟอก XYZ ชุ Pro', stock: 8, status: 'เหลือ 8 ชิ้น' },
    { name: 'ครีม AA Double A', stock: 15, status: 'เหลือ 15 ชิ้น' },
    { name: 'ปุยป่นน้ำมัน HP 67B สีดำ', stock: 3, status: 'เหลือ 3 กล่อง' },
    { name: 'เสื้อเชิ้ตชาย XL', stock: 7, status: 'เหลือ 7 ชิ้น' },
    { name: 'กางเกงยีนส์สขปิด', stock: 6, status: 'เหลือ 6 ชิ้น' }
  ];

  const renderStatCard = (stat: StatCard, index: number) => (
    <View key={index} style={styles.statCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.statGradient}
      >
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
            <Text style={styles.statEmoji}>{stat.icon}</Text>
          </View>
          <View style={[styles.changeContainer, { 
            backgroundColor: stat.changeType === 'up' ? '#DCFCE7' : '#FEF2F2'
          }]}>
            <Text style={[styles.changeText, {
              color: stat.changeType === 'up' ? '#16A34A' : '#DC2626'
            }]}>
              {stat.change}
            </Text>
          </View>
        </View>
        <Text style={styles.statTitle}>{stat.title}</Text>
        <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
        <Text style={styles.statSubtitle}>อัปเดต 1 ชั่วโมงที่ผ่านมา</Text>
      </LinearGradient>
    </View>
  );

  return (
    <SidebarLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>แดชบอร์ดจัดการคลังสินค้า</Text>
            <Text style={styles.headerSubtitle}>ภาพรวมและสถิติของระบบ</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchDashboardData}>
            <Text style={styles.refreshText}>
              {loading ? 'โหลด...' : 'รีเฟรช'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && stats.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
              <Text style={styles.retryButtonText}>ลองใหม่อีกครั้ง</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => renderStatCard(stat, index))}
        </View>

        {/* Charts Section */}
        <View style={styles.chartsContainer}>
          {/* Sales Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>ยอดขายรายเดือน</Text>
              <View style={styles.chartTabs}>
                <TouchableOpacity style={[styles.chartTab, styles.activeTab]}>
                  <Text style={styles.activeTabText}>รายได้</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartTab}>
                  <Text style={styles.tabText}>จำนวน</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartTab}>
                  <Text style={styles.tabText}>กำไร</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>ไม่มีข้อมูลกราฟ</Text>
              <Text style={styles.noDataSubtext}>รอข้อมูลจาก API</Text>
            </View>
          </View>

          {/* Category Distribution */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>สัดส่วนหมวดหมู่สินค้า</Text>
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>ไม่มีข้อมูลกราฟวงกลม</Text>
              <Text style={styles.noDataSubtext}>รอข้อมูลจาก API</Text>
            </View>
          </View>
        </View>

        {/* Product Tables */}
        <View style={styles.tablesContainer}>
          {/* Top Products */}
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>สินค้าขายดี 5 อันดับ</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.tableHeaderText}>สินค้า</Text>
                <Text style={styles.tableHeaderText}>ราคา</Text>
                <Text style={styles.tableHeaderText}>คงเหลือ</Text>
                <Text style={styles.tableHeaderText}>สถานะ</Text>
              </View>
              {topProducts.map((product, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCellText} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.tableCellText}>{product.price}</Text>
                  <Text style={styles.tableCellText}>{product.stock}</Text>
                  <View style={[styles.statusBadge, {
                    backgroundColor: product.status === 'ขายดี' ? '#DCFCE7' : 
                                   product.status === 'เหลือน้อย' ? '#FEF2F2' : '#F1F5F9'
                  }]}>
                    <Text style={[styles.statusText, {
                      color: product.status === 'ขายดี' ? '#16A34A' : 
                           product.status === 'เหลือน้อย' ? '#DC2626' : '#64748B'
                    }]}>
                      {product.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Low Stock Products */}
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>สินค้าใกล้หมดสต๊อก</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.table}>
              {lowStockProducts.map((product, index) => (
                <View key={index} style={styles.lowStockRow}>
                  <View style={styles.alertIcon}>
                    <Text style={styles.alertEmoji}>⚠️</Text>
                  </View>
                  <View style={styles.lowStockInfo}>
                    <Text style={styles.lowStockName}>{product.name}</Text>
                    <Text style={styles.lowStockStatus}>{product.status}</Text>
                  </View>
                  <Text style={styles.lowStockCount}>{product.stock}</Text>
                </View>
              ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 24,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  chartsContainer: {
    padding: 16,
    gap: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  chartTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
  },
  chartTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
  },
  activeTabText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  mockChart: {
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  mockPieChart: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockChartText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  mockChartSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  noDataContainer: {
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  noDataText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#64748B',
  },
  tablesContainer: {
    padding: 16,
    gap: 16,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableCellText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lowStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertEmoji: {
    fontSize: 20,
  },
  lowStockInfo: {
    flex: 1,
  },
  lowStockName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  lowStockStatus: {
    fontSize: 12,
    color: '#EF4444',
  },
  lowStockCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 24,
  },
  // Loading และ Error States
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
