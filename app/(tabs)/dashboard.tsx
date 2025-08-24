import { apiConfig } from '@/config/environment';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Type definitions
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  sku: string;
  barcode: string;
  supplier: string;
  description: string;
  image: string;
  location: string;
  lastRestocked: string;
  status: string;
  warranty: string;
  unit: string;
  stockStatus?: string;
  totalValue?: number;
}

interface DashboardKPIs {
  totalStockItems: number;
  outOfStockItems: number;
  lowStockAlerts: number;
  totalValue: number;
  categoriesCount: number;
  totalSuppliers: number;
  avgStockLevel: number;
  totalMovements: number;
}

interface InventoryTrend {
  date: string;
  incoming: number;
  outgoing: number;
  total: number;
}

interface CategoryStats {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface StockAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring' | 'reorder';
  itemName: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

// API functions - Updated for Database API
const fetchDashboardData = async (): Promise<{
  items: InventoryItem[];
  trends: InventoryTrend[];
  alerts: StockAlert[];
}> => {
  try {
    console.log('🔄 Loading dashboard data from Database API...');
    
    // ใช้ API endpoint ใหม่ที่เชื่อมต่อ Database
    const inventoryUrl = apiConfig.buildUrl('dashboard', 'inventory');
    const response = await fetch(inventoryUrl);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Dashboard data loaded from database');
      
      // Extract data array from Database API response
      const data = result.success && Array.isArray(result.data) ? result.data : [];
      
      // Generate trends and alerts based on real data
      const trends = generateMockTrends();
      const alerts = generateStockAlerts(data);
      
      return { items: data, trends, alerts };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error loading dashboard data from database:', error);
    
    // Return empty data instead of mock fallback (DB-only approach)
    return {
      items: [],
      trends: [],
      alerts: [{
        id: 'db-error',
        type: 'low_stock',
        itemName: 'Database Connection',
        message: 'Unable to connect to database. Please check connection.',
        severity: 'high',
        timestamp: new Date().toISOString()
      }]
    };
  }
};

const generateMockTrends = (): InventoryTrend[] => {
  const trends: InventoryTrend[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    trends.push({
      date: date.toISOString().split('T')[0],
      incoming: Math.floor(Math.random() * 100) + 50,
      outgoing: Math.floor(Math.random() * 80) + 30,
      total: Math.floor(Math.random() * 1000) + 500
    });
  }
  
  return trends;
};

const generateStockAlerts = (items: InventoryItem[]): StockAlert[] => {
  const alerts: StockAlert[] = [];
  
  items.forEach(item => {
    if (item.stock === 0) {
      alerts.push({
        id: `out-${item.id}`,
        type: 'out_of_stock',
        itemName: item.name,
        message: `${item.name} is out of stock`,
        severity: 'high',
        timestamp: new Date().toISOString()
      });
    } else if (item.stock <= item.minStock) {
      alerts.push({
        id: `low-${item.id}`,
        type: 'low_stock',
        itemName: item.name,
        message: `${item.name} is running low (${item.stock} left)`,
        severity: 'medium',
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return alerts;
};

export default function DashboardScreen() {
  const [kpis, setKpis] = useState<DashboardKPIs>({
    totalStockItems: 0,
    outOfStockItems: 0,
    lowStockAlerts: 0,
    totalValue: 0,
    categoriesCount: 0,
    totalSuppliers: 0,
    avgStockLevel: 0,
    totalMovements: 0
  });
  
  const [trends, setTrends] = useState<InventoryTrend[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { items, trends, alerts } = await fetchDashboardData();
      
      // Calculate KPIs
      const totalStockItems = items.length;
      const outOfStockItems = items.filter(item => item.stock === 0).length;
      const lowStockAlerts = items.filter(item => item.stock > 0 && item.stock <= item.minStock).length;
      const totalValue = items.reduce((sum, item) => sum + (item.stock * item.cost), 0);
      const categoriesCount = [...new Set(items.map(item => item.category))].length;
      const totalSuppliers = [...new Set(items.map(item => item.supplier))].length;
      const avgStockLevel = items.reduce((sum, item) => sum + item.stock, 0) / items.length;
      
      setKpis({
        totalStockItems,
        outOfStockItems,
        lowStockAlerts,
        totalValue,
        categoriesCount,
        totalSuppliers,
        avgStockLevel,
        totalMovements: 156 // Mock data
      });
      
      // Calculate category statistics
      const categoryMap = new Map<string, { count: number; value: number }>();
      items.forEach(item => {
        const existing = categoryMap.get(item.category) || { count: 0, value: 0 };
        categoryMap.set(item.category, {
          count: existing.count + 1,
          value: existing.value + (item.stock * item.cost)
        });
      });
      
      const colors = ['#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#F56565', '#38B2AC'];
      const categoryStatsArray = Array.from(categoryMap.entries()).map(([name, data], index) => ({
        name,
        count: data.count,
        value: data.value,
        color: colors[index % colors.length]
      }));
      
      setTrends(trends);
      setCategoryStats(categoryStatsArray);
      setAlerts(alerts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#E53E3E';
      case 'medium': return '#F6AD55';
      default: return '#4299E1';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add_item':
        Alert.alert('Add New Item', 'Navigate to Add Item form');
        break;
      case 'import_csv':
        Alert.alert('Import CSV', 'Open CSV import dialog');
        break;
      case 'export_report':
        Alert.alert('Export Report', 'Generate and download report');
        break;
      case 'scan_barcode':
        Alert.alert('Scan Barcode', 'Open barcode scanner');
        break;
      default:
        Alert.alert('Action', `${action} clicked`);
    }
  };

  const renderKPICard = (title: string, value: string | number, icon: string, color: string, trend?: string) => (
    <View style={[styles.kpiCard, { borderLeftColor: color }]}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        {trend && (
          <Text style={[styles.kpiTrend, { color: trend.startsWith('+') ? '#38A169' : '#E53E3E' }]}>
            {trend}
          </Text>
        )}
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
    </View>
  );

  const renderQuickActionButton = (title: string, icon: string, color: string, action: string) => (
    <TouchableOpacity
      style={[styles.quickActionButton, { backgroundColor: color }]}
      onPress={() => handleQuickAction(action)}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderAlert = ({ item }: { item: StockAlert }) => (
    <TouchableOpacity style={styles.alertItem}>
      <View style={[styles.alertIndicator, { backgroundColor: getAlertColor(item.severity) }]} />
      <View style={styles.alertContent}>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <Text style={styles.alertTime}>
          {new Date(item.timestamp).toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      <TouchableOpacity style={styles.alertAction}>
        <Text style={styles.alertActionText}>🔧</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>📊 Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>📊 Dashboard</Text>
          <Text style={styles.headerSubtitle}>Inventory Overview</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          {alerts.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{alerts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* KPIs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Key Performance Indicators</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiContainer}>
            {renderKPICard("Total Items", kpis.totalStockItems, "📦", "#4299E1", "+5%")}
            {renderKPICard("Out of Stock", kpis.outOfStockItems, "❌", "#E53E3E", "-2%")}
            {renderKPICard("Low Stock Alerts", kpis.lowStockAlerts, "⚠️", "#F6AD55", "+3%")}
            {renderKPICard("Total Value", formatCurrency(kpis.totalValue), "💰", "#38A169", "+12%")}
            {renderKPICard("Categories", kpis.categoriesCount, "🏷️", "#9F7AEA")}
            {renderKPICard("Suppliers", kpis.totalSuppliers, "🏢", "#38B2AC")}
            {renderKPICard("Avg Stock Level", Math.round(kpis.avgStockLevel), "📊", "#ED8936")}
            {renderKPICard("Movements", kpis.totalMovements, "🔄", "#4C51BF", "+8%")}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {renderQuickActionButton("Add New Item", "➕", "#4299E1", "add_item")}
            {renderQuickActionButton("Import CSV", "📄", "#48BB78", "import_csv")}
            {renderQuickActionButton("Export Report", "📊", "#ED8936", "export_report")}
            {renderQuickActionButton("Scan Barcode", "📱", "#9F7AEA", "scan_barcode")}
          </View>
        </View>

        {/* Inventory Trends Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Inventory Trends (Last 7 Days)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.customChart}>
              <View style={styles.chartHeader}>
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#48BB78' }]} />
                    <Text style={styles.legendText}>Stock In</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F56565' }]} />
                    <Text style={styles.legendText}>Stock Out</Text>
                  </View>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chartBars}>
                  {trends.map((trend, index) => (
                    <View key={index} style={styles.barGroup}>
                      <View style={styles.barContainer}>
                        <View 
                          style={[
                            styles.bar, 
                            { 
                              height: Math.max((trend.incoming / 100) * 100, 10),
                              backgroundColor: '#48BB78' 
                            }
                          ]} 
                        />
                        <View 
                          style={[
                            styles.bar, 
                            { 
                              height: Math.max((trend.outgoing / 100) * 100, 10),
                              backgroundColor: '#F56565',
                              marginLeft: 4
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barLabel}>
                        {new Date(trend.date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' })}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏷️ Category Distribution</Text>
          <View style={styles.chartContainer}>
            <View style={styles.categoryChart}>
              {categoryStats.map((category, index) => {
                const percentage = categoryStats.length > 0 
                  ? (category.count / categoryStats.reduce((sum, c) => sum + c.count, 0)) * 100 
                  : 0;
                return (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryRow}>
                      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.categoryBar}>
                      <View 
                        style={[
                          styles.categoryBarFill, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: category.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.categoryValue}>
                      {category.count} items • {formatCurrency(category.value)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Recent Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.alertsContainer}>
            {alerts.length > 0 ? (
              <FlatList
                data={alerts.slice(0, 5)}
                renderItem={renderAlert}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.noAlertsContainer}>
                <Text style={styles.noAlertsText}>✅ No active alerts</Text>
                <Text style={styles.noAlertsSubtext}>All inventory levels are healthy</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Recent Activity</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#38A169' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Stock replenished: iPhone 15 Pro Max (+50 units)</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#E53E3E' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Stock adjustment: MacBook Air M3 (-5 units)</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#4299E1' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New item added: AirPods Pro 3rd Gen</Text>
                <Text style={styles.activityTime}>6 hours ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#E53E3E',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#4A5568',
    fontWeight: '500',
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  
  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#4299E1',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // KPI Cards
  kpiContainer: {
    marginBottom: 4,
  },
  kpiCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    borderLeftWidth: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  kpiIcon: {
    fontSize: 24,
  },
  kpiTrend: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#718096',
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  quickActionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  
  // Charts
  chartContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  customChart: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    paddingHorizontal: 8,
  },
  barGroup: {
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },
  bar: {
    width: 16,
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  categoryChart: {
    width: '100%',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: '#1A202C',
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: 'bold',
  },
  categoryBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 4,
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryValue: {
    fontSize: 12,
    color: '#718096',
  },
  
  // Alerts
  alertsContainer: {
    marginTop: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  alertIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#1A202C',
    fontWeight: '500',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#718096',
  },
  alertAction: {
    padding: 8,
  },
  alertActionText: {
    fontSize: 16,
  },
  noAlertsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noAlertsText: {
    fontSize: 16,
    color: '#38A169',
    fontWeight: '600',
    marginBottom: 4,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#718096',
  },
  
  // Activity
  activityContainer: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1A202C',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#718096',
  },
});
