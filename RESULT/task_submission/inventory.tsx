import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  profit?: number;
  profitMargin?: string;
  stockStatus?: string;
  totalValue?: number;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoriesCount: number;
  averagePrice: number;
}

// API functions
const fetchInventoryFromAPI = async (): Promise<InventoryItem[]> => {
  try {
    // Try cloud API first
    const response = await fetch('https://nindam.sytes.net/api/inventory');
    if (response.ok) {
      const data = await response.json();
      return data.success ? data.data : [];
    }
  } catch (error) {
    console.log('Cloud API failed, trying direct JSON...');
  }
  
  try {
    // Fallback to direct JSON
    const response = await fetch('https://nindam.sytes.net/inventory_products.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Direct JSON failed, using mock data...');
  }
  
  // Final fallback to mock data
  return [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      category: "Electronics",
      price: 43900,
      cost: 35000,
      stock: 25,
      minStock: 5,
      maxStock: 100,
      sku: "IP15PM-256-TB",
      barcode: "1234567890123",
      supplier: "Apple Thailand",
      description: "iPhone 15 Pro Max 256GB Titanium Blue",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      location: "A-01-001",
      lastRestocked: "2024-12-01T10:00:00Z",
      status: "active",
      warranty: "1 year"
    }
  ];
};

const fetchInventoryStats = async (): Promise<InventoryStats | null> => {
  try {
    const response = await fetch('https://nindam.sytes.net/api/inventory/stats');
    if (response.ok) {
      const data = await response.json();
      return data.success ? data.data : null;
    }
  } catch (error) {
    console.log('Stats API failed');
  }
  return null;
};

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2; // 2 columns with margins

  const categories = ['All', 'Electronics', 'Gaming', 'Home Appliances', 'Toys', 'Fashion'];

  useEffect(() => {
    loadInventory();
    loadStats();
  }, []);

  useEffect(() => {
    const filterAndSort = () => {
      let filtered = [...inventory];

      // Filter by category
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.barcode.includes(searchQuery) ||
          item.description.toLowerCase().includes(query)
        );
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return b.price - a.price;
          case 'stock':
            return b.stock - a.stock;
          case 'lastRestocked':
            return new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime();
          default:
            return 0;
        }
      });

      setFilteredInventory(filtered);
    };
    
    filterAndSort();
  }, [inventory, searchQuery, selectedCategory, sortBy]);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const data = await fetchInventoryFromAPI();
      
      // Add computed fields
      const enhancedData = data.map(item => ({
        ...item,
        profit: item.price - item.cost,
        profitMargin: ((item.price - item.cost) / item.price * 100).toFixed(2),
        stockStatus: item.stock <= item.minStock ? 'low' : 
                     item.stock >= item.maxStock ? 'full' : 'normal',
        totalValue: item.stock * item.cost
      }));
      
      setInventory(enhancedData);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await fetchInventoryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventory();
    await loadStats();
    setRefreshing(false);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'low': return '#FF6B6B';
      case 'full': return '#4ECDC4';
      default: return '#51CF66';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderInventoryCard = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity
      style={[styles.inventoryCard, { width: viewMode === 'grid' ? cardWidth : '100%' }]}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <View style={[styles.stockBadge, { backgroundColor: getStockStatusColor(item.stockStatus || 'normal') }]}>
            <Text style={styles.stockBadgeText}>{item.stock}</Text>
          </View>
        </View>
        
        <Text style={styles.itemSku}>SKU: {item.sku}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
          <Text style={styles.itemProfit}>+{item.profitMargin}%</Text>
        </View>
        
        <View style={styles.stockInfo}>
          <Text style={styles.stockText}>Stock: {item.stock}/{item.maxStock}</Text>
          <Text style={styles.locationText}>📍 {item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatsCard = () => {
    if (!stats) return null;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatCurrency(stats.totalValue)}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalStock}</Text>
          <Text style={styles.statLabel}>Total Stock</Text>
        </View>
        <View style={[styles.statCard, stats.lowStockItems > 0 && styles.warningCard]}>
          <Text style={[styles.statValue, stats.lowStockItems > 0 && styles.warningText]}>
            {stats.lowStockItems}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </ScrollView>
    );
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Product Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>SKU:</Text>
                  <Text style={styles.detailValue}>{selectedItem.sku}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Barcode:</Text>
                  <Text style={styles.detailValue}>{selectedItem.barcode}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{selectedItem.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Supplier:</Text>
                  <Text style={styles.detailValue}>{selectedItem.supplier}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>{selectedItem.location}</Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Pricing & Stock</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Selling Price:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(selectedItem.price)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cost Price:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(selectedItem.cost)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Profit:</Text>
                  <Text style={[styles.detailValue, styles.profitText]}>
                    {formatCurrency(selectedItem.profit || 0)} ({selectedItem.profitMargin}%)
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Current Stock:</Text>
                  <Text style={[styles.detailValue, { color: getStockStatusColor(selectedItem.stockStatus || 'normal') }]}>
                    {selectedItem.stock} units
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Stock Range:</Text>
                  <Text style={styles.detailValue}>{selectedItem.minStock} - {selectedItem.maxStock} units</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Value:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(selectedItem.totalValue || 0)}</Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Additional Info</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Restocked:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedItem.lastRestocked)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Warranty:</Text>
                  <Text style={styles.detailValue}>{selectedItem.warranty}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>{selectedItem.status}</Text>
                </View>
              </View>

              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{selectedItem.description}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 Inventory Manager</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Text style={styles.viewModeText}>
              {viewMode === 'grid' ? '☰' : '▦'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      {renderStatsCard()}

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, SKU, or barcode..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.activeCategoryButtonText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {['name', 'price', 'stock', 'lastRestocked'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.sortButton, sortBy === option && styles.activeSortButton]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.sortButtonText, sortBy === option && styles.activeSortButtonText]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredInventory}
        renderItem={renderInventoryCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.inventoryList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading inventory...' : 'No items found'}
            </Text>
          </View>
        }
      />

      {/* Detail Modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeButton: {
    padding: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  viewModeText: {
    fontSize: 16,
    color: '#4A5568',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  statCard: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  warningCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FEB2B2',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  warningText: {
    color: '#E53E3E',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryButton: {
    backgroundColor: '#4299E1',
    borderColor: '#4299E1',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  sortLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginRight: 12,
    fontWeight: '500',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F7FAFC',
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeSortButton: {
    backgroundColor: '#48BB78',
    borderColor: '#48BB78',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#4A5568',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  inventoryList: {
    padding: 16,
  },
  inventoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  stockBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSku: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  itemProfit: {
    fontSize: 12,
    color: '#48BB78',
    fontWeight: 'bold',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 12,
    color: '#4A5568',
  },
  locationText: {
    fontSize: 12,
    color: '#718096',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#4A5568',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#718096',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  profitText: {
    color: '#48BB78',
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
});
