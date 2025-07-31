import { apiConfig } from '@/config/environment';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import {
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

interface FilterOptions {
  category: string;
  status: string;
  location: string;
}

// API functions
const fetchInventoryFromAPI = async (): Promise<InventoryItem[]> => {
  try {
    const response = await fetch(`${apiConfig.baseUrls.production}${apiConfig.endpoints.inventory.list}`);
    if (response.ok) {
      const result = await response.json();
      // Return only the data array from the API response
      return result.success && Array.isArray(result.data) ? result.data : [];
    }
  } catch (error) {
    console.log('API failed, using mock data...', error);
  }
  
  // Mock data
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
      warranty: "1 year",
      unit: "pcs"
    },
    {
      id: 2,
      name: "MacBook Air M3",
      category: "Electronics",
      price: 42900,
      cost: 34000,
      stock: 3,
      minStock: 5,
      maxStock: 50,
      sku: "MBA-M3-13-MN",
      barcode: "2345678901234",
      supplier: "Apple Thailand",
      description: "MacBook Air 13-inch M3 chip 256GB SSD Midnight",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      location: "A-01-002",
      lastRestocked: "2024-11-28T14:30:00Z",
      status: "low_stock",
      warranty: "1 year",
      unit: "pcs"
    },
    {
      id: 3,
      name: "Samsung 4K Smart TV",
      category: "Electronics",
      price: 25900,
      cost: 20000,
      stock: 0,
      minStock: 2,
      maxStock: 20,
      sku: "SAM-TV-55-4K",
      barcode: "3456789012345",
      supplier: "Samsung Electronics",
      description: "Samsung 55-inch 4K Smart TV",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      location: "B-02-001",
      lastRestocked: "2024-11-15T09:00:00Z",
      status: "out_of_stock",
      warranty: "2 years",
      unit: "pcs"
    }
  ];
};

export default function InventoryListScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    status: 'All',
    location: 'All'
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Derived data
  const categories = ['All', ...Array.from(new Set(inventory.map(item => item.category)))];
  const locations = ['All', ...Array.from(new Set(inventory.map(item => item.location)))];
  const statusOptions = ['All', 'in_stock', 'low_stock', 'out_of_stock'];

  const loadInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchInventoryFromAPI();
      
      const enhancedData = data.map(item => ({
        ...item,
        stockStatus: item.stock === 0 ? 'out_of_stock' : 
                     item.stock <= item.minStock ? 'low_stock' : 'in_stock',
        totalValue: item.stock * item.cost
      }));
      
      setInventory(enhancedData);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterAndSortInventory = useCallback(() => {
    let filtered = [...inventory];

    // Apply filters
    if (filters.category !== 'All') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    if (filters.status !== 'All') {
      filtered = filtered.filter(item => item.stockStatus === filters.status);
    }
    if (filters.location !== 'All') {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.barcode.includes(searchQuery) ||
        item.location.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'sku':
          aValue = a.sku.toLowerCase();
          bValue = b.sku.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'status':
          aValue = a.stockStatus;
          bValue = b.stockStatus;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredInventory(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [inventory, searchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    filterAndSortInventory();
  }, [filterAndSortInventory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (selectedItem) {
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id ? selectedItem : item
      ));
      setEditModalVisible(false);
      setSelectedItem(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock': return '#E53E3E';
      case 'low_stock': return '#F6AD55';
      case 'in_stock': return '#38A169';
      default: return '#718096';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out_of_stock': return 'Out of Stock';
      case 'low_stock': return 'Low Stock';
      case 'in_stock': return 'In Stock';
      default: return 'Unknown';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredInventory.slice(startIndex, endIndex);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('name')}
      >
        <Text style={styles.headerText}>
          Item Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('sku')}
      >
        <Text style={styles.headerText}>
          SKU {sortBy === 'sku' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('category')}
      >
        <Text style={styles.headerText}>
          Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('stock')}
      >
        <Text style={styles.headerText}>
          Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('location')}
      >
        <Text style={styles.headerText}>
          Location {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerCell} 
        onPress={() => handleSort('status')}
      >
        <Text style={styles.headerText}>
          Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.headerCell}>
        <Text style={styles.headerText}>Actions</Text>
      </View>
    </View>
  );

  const renderTableRow = ({ item }: { item: InventoryItem }) => (
    <View style={styles.tableRow}>
      <View style={styles.cell}>
        <View style={styles.cellContent}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemBarcode}>#{item.barcode}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.sku}</Text>
      </View>
      
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.category}</Text>
      </View>
      
      <View style={styles.cell}>
        <Text style={[styles.cellText, { color: getStatusColor(item.stockStatus || 'in_stock') }]}>
          {item.stock} {item.unit}
        </Text>
        <Text style={styles.cellSubtext}>Min: {item.minStock}</Text>
      </View>
      
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.location}</Text>
      </View>
      
      <View style={styles.cell}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.stockStatus || 'in_stock') }]}>
          <Text style={styles.statusText}>{getStatusText(item.stockStatus || 'in_stock')}</Text>
        </View>
      </View>
      
      <View style={styles.cell}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages} ({filteredInventory.length} items)
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEditModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Stock Quantity</Text>
                <TextInput
                  style={styles.formInput}
                  value={selectedItem.stock.toString()}
                  onChangeText={(text) => setSelectedItem({
                    ...selectedItem,
                    stock: parseInt(text) || 0
                  })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Minimum Stock</Text>
                <TextInput
                  style={styles.formInput}
                  value={selectedItem.minStock.toString()}
                  onChangeText={(text) => setSelectedItem({
                    ...selectedItem,
                    minStock: parseInt(text) || 0
                  })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.formInput}
                  value={selectedItem.location}
                  onChangeText={(text) => setSelectedItem({
                    ...selectedItem,
                    location: text
                  })}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>📋 Loading Inventory...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Inventory List</Text>
        <Text style={styles.headerSubtitle}>{filteredInventory.length} items found</Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, SKU, barcode, location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0AEC0"
          />
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={`category-${index}`}
                  style={[styles.filterButton, filters.category === category && styles.activeFilterButton]}
                  onPress={() => setFilters({...filters, category: category})}
                >
                  <Text style={[styles.filterButtonText, filters.category === category && styles.activeFilterButtonText]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Status Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {statusOptions.map((status, index) => (
                <TouchableOpacity
                  key={`status-${index}`}
                  style={[styles.filterButton, filters.status === status && styles.activeFilterButton]}
                  onPress={() => setFilters({...filters, status: status})}
                >
                  <Text style={[styles.filterButtonText, filters.status === status && styles.activeFilterButtonText]}>
                    {status === 'All' ? 'All' : getStatusText(status)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Location Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Location:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {locations.map((location, index) => (
                <TouchableOpacity
                  key={`location-${index}`}
                  style={[styles.filterButton, filters.location === location && styles.activeFilterButton]}
                  onPress={() => setFilters({...filters, location: location})}
                >
                  <Text style={[styles.filterButtonText, filters.location === location && styles.activeFilterButtonText]}>
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Data Table */}
      <View style={styles.tableContainer}>
        {renderTableHeader()}
        <FlatList
          data={currentItems}
          renderItem={renderTableRow}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📭 No items found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      </View>

      {/* Pagination */}
      {renderPagination()}

      {/* Edit Modal */}
      {renderEditModal()}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  
  // Filters
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  activeFilterButton: {
    backgroundColor: '#4299E1',
    borderColor: '#4299E1',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  
  // Table
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    minHeight: 80,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 2,
  },
  itemBarcode: {
    fontSize: 12,
    color: '#718096',
  },
  cellText: {
    fontSize: 14,
    color: '#1A202C',
  },
  cellSubtext: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#718096',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  
  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pageButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pageInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pageText: {
    fontSize: 14,
    color: '#4A5568',
  },
  
  // Modal
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
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
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#4299E1',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
