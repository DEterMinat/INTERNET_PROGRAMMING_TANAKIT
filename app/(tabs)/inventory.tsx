import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  FlatList,
  Dimensions
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image: string;
  sku: string;
  location: string;
  supplier: string;
}

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock data - ในใช้งานจริงจะดึงจาก API
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: 'เครื่องปรับอากาศ Samsung 18000 BTU',
      category: 'เครื่องใช้ไฟฟ้า',
      price: 32990,
      stock: 45,
      minStock: 10,
      status: 'in_stock',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=300&fit=crop',
      sku: 'SAM-AC-18K-001',
      location: 'A1-01',
      supplier: 'Samsung Thailand'
    },
    {
      id: 2,
      name: 'โทรศัพท์มือถือ iPhone 15 Pro Max 256GB',
      category: 'อิเล็กทรอนิกส์',
      price: 48900,
      stock: 8,
      minStock: 15,
      status: 'low_stock',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      sku: 'APL-IP15-256-001',
      location: 'B2-05',
      supplier: 'Apple Authorized'
    },
    {
      id: 3,
      name: 'เครื่องซักผ้า LG 12 กิโลกรัม',
      category: 'เครื่องใช้ไฟฟ้า',
      price: 18990,
      stock: 0,
      minStock: 5,
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      sku: 'LG-WM-12K-001',
      location: 'A2-03',
      supplier: 'LG Electronics'
    },
    {
      id: 4,
      name: 'โน๊ตบุ๊ค Dell XPS 13 i7',
      category: 'คอมพิวเตอร์',
      price: 65990,
      stock: 22,
      minStock: 8,
      status: 'in_stock',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      sku: 'DEL-XPS-13-001',
      location: 'C1-02',
      supplier: 'Dell Thailand'
    },
    {
      id: 5,
      name: 'หูฟังไร้สาย AirPods Pro 2',
      category: 'อุปกรณ์เสริม',
      price: 8990,
      stock: 156,
      minStock: 50,
      status: 'in_stock',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=300&h=300&fit=crop',
      sku: 'APL-APP-PRO2-001',
      location: 'D1-01',
      supplier: 'Apple Authorized'
    }
  ];

  const categories = ['ทั้งหมด', 'เครื่องใช้ไฟฟ้า', 'อิเล็กทรอนิกส์', 'คอมพิวเตอร์', 'อุปกรณ์เสริม'];

  // Calculate stats
  const stats = {
    total: inventoryItems.length,
    inStock: inventoryItems.filter(item => item.status === 'in_stock').length,
    lowStock: inventoryItems.filter(item => item.status === 'low_stock').length,
    outOfStock: inventoryItems.filter(item => item.status === 'out_of_stock').length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.price * item.stock), 0)
  };

  // Filter items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return '#10B981';
      case 'low_stock': return '#F59E0B';
      case 'out_of_stock': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'มีสินค้า';
      case 'low_stock': return 'ใกล้หมด';
      case 'out_of_stock': return 'หมดสต๊อก';
      default: return 'ไม่ทราบ';
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    if (viewMode === 'list') {
      return (
        <TouchableOpacity style={styles.listItem}>
          <Image source={{ uri: item.image }} style={styles.listItemImage} />
          <View style={styles.listItemInfo}>
            <Text style={styles.listItemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.listItemCategory}>{item.category}</Text>
            <View style={styles.listItemDetails}>
              <Text style={styles.listItemSku}>SKU: {item.sku}</Text>
              <Text style={styles.listItemLocation}>📍 {item.location}</Text>
            </View>
          </View>
          <View style={styles.listItemRight}>
            <Text style={styles.listItemPrice}>฿{item.price.toLocaleString()}</Text>
            <View style={styles.listItemStock}>
              <Text style={styles.stockText}>{item.stock} ชิ้น</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={[styles.gridItem, isTablet && styles.gridItemTablet]}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={[styles.statusBadge, { 
            backgroundColor: getStatusColor(item.status),
            position: 'absolute',
            top: 8,
            right: 8
          }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemSku}>SKU: {item.sku}</Text>
            <Text style={styles.itemLocation}>📍 {item.location}</Text>
          </View>
          <View style={styles.itemPricing}>
            <Text style={styles.itemPrice}>฿{item.price.toLocaleString()}</Text>
            <Text style={[styles.stockInfo, { 
              color: item.stock <= item.minStock ? '#EF4444' : '#10B981' 
            }]}>
              {item.stock} ชิ้น
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Header Stats */}
        <View style={styles.statsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#3B82F6', '#1E3A8A']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/warehouse.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>รายการทั้งหมด</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#10B981', '#047857']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/checkmark.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.inStock}</Text>
                <Text style={styles.statLabel}>มีสินค้า</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/warning-shield.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.lowStock}</Text>
                <Text style={styles.statLabel}>ใกล้หมด</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#EF4444', '#B91C1C']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/close-box.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>{stats.outOfStock}</Text>
                <Text style={styles.statLabel}>หมดสต๊อก</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#8B5CF6', '#5B21B6']} style={styles.statGradient}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/32/money-bag.png' }} style={styles.statIcon} />
                <Text style={styles.statValue}>฿{(stats.totalValue / 1000000).toFixed(1)}M</Text>
                <Text style={styles.statLabel}>มูลค่ารวม</Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/search.png' }} 
              style={styles.searchIcon} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสินค้า, SKU, หรือหมวดหมู่..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/delete-sign.png' }} 
                  style={styles.clearIcon} 
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.filtersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.filterChip, selectedCategory === category && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.viewToggle}
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                <Image 
                  source={{ 
                    uri: viewMode === 'grid' 
                      ? 'https://img.icons8.com/fluency-systems-filled/20/menu-2.png'
                      : 'https://img.icons8.com/fluency-systems-filled/20/grid.png'
                  }} 
                  style={styles.viewToggleIcon} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => alert('เพิ่มสินค้าใหม่')}
              >
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/plus.png' }} 
                  style={styles.addButtonIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            <Text style={styles.resultCount}>
              พบ {filteredItems.length} รายการ{searchQuery && ` จาก "${searchQuery}"`}
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>เรียงตาม: ชื่อสินค้า</Text>
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency-systems-filled/12/chevron-down.png' }} 
                style={styles.sortButtonIcon} 
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={viewMode === 'grid' ? (isTablet ? 3 : 2) : 1}
            key={`${viewMode}-${isTablet ? 3 : 2}`}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => viewMode === 'list' ? <View style={styles.separator} /> : null}
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
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Search Section
  searchSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    marginBottom: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#94A3B8',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#94A3B8',
  },

  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterScroll: {
    flex: 1,
    marginRight: 12,
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

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  viewToggleIcon: {
    width: 20,
    height: 20,
    tintColor: '#64748B',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },

  // Content
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: '#64748B',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 4,
  },
  sortButtonIcon: {
    width: 12,
    height: 12,
    tintColor: '#64748B',
  },

  // List Container
  listContainer: {
    paddingBottom: 32,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  separator: {
    height: 12,
  },

  // Grid Items
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    flex: 1,
    minWidth: (width - 44) / 2,
  },
  gridItemTablet: {
    minWidth: (width - 80) / 3,
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemCategory: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  itemDetails: {
    marginBottom: 8,
  },
  itemSku: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 11,
    color: '#94A3B8',
  },
  itemPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  stockInfo: {
    fontSize: 12,
    fontWeight: '600',
  },

  // List Items
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  listItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  listItemCategory: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  listItemDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  listItemSku: {
    fontSize: 12,
    color: '#94A3B8',
  },
  listItemLocation: {
    fontSize: 12,
    color: '#94A3B8',
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  listItemStock: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
