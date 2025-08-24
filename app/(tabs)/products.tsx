import React, { useState, useEffect, useCallback } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import { LinearGradient } from 'expo-linear-gradient';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  lastUpdated: string;
  sku: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = ['ทั้งหมด', 'อิเล็กทรอนิกส์', 'เครื่องใช้ไฟฟ้า', 'เฟอร์นิเจอร์', 'เสื้อผ้า', 'อื่นๆ'];

  const quickStats = [
    {
      title: 'สินค้าทั้งหมด',
      value: products.length.toString(),
      icon: 'https://img.icons8.com/fluency/32/product.png',
      gradient: ['#3B82F6', '#1E3A8A']
    },
    {
      title: 'ใกล้หมด',
      value: products.filter(p => p.stock < 10).length.toString(),
      icon: 'https://img.icons8.com/fluency/32/error.png',
      gradient: ['#F59E0B', '#D97706']
    },
    {
      title: 'หมดสต็อก',
      value: products.filter(p => p.stock === 0).length.toString(),
      icon: 'https://img.icons8.com/fluency/32/delete-database.png',
      gradient: ['#EF4444', '#DC2626']
    },
    {
      title: 'มูลค่ารวม',
      value: `${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}฿`,
      icon: 'https://img.icons8.com/fluency/32/money.png',
      gradient: ['#10B981', '#047857']
    }
  ];

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (selectedCategory !== 'ทั้งหมด') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Mock data for development since API might not be available
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'โทรศัพท์มือถือ Samsung Galaxy',
          price: 25990,
          stock: 15,
          category: 'อิเล็กทรอนิกส์',
          description: 'สมาร์ทโฟนรุ่นใหม่ล่าสุด',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
          status: 'active',
          lastUpdated: '2024-01-15',
          sku: 'PHONE-001'
        },
        {
          id: 2,
          name: 'หูฟังไร้สาย AirPods Pro',
          price: 8990,
          stock: 3,
          category: 'อิเล็กทรอนิกส์',
          description: 'หูฟังไร้สายคุณภาพสูง',
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop',
          status: 'active',
          lastUpdated: '2024-01-14',
          sku: 'AUDIO-002'
        },
        {
          id: 3,
          name: 'เก้าอี้สำนักงาน ergonomic',
          price: 4590,
          stock: 0,
          category: 'เฟอร์นิเจอร์',
          description: 'เก้าอี้นั่งสบายสำหรับทำงาน',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
          status: 'out_of_stock',
          lastUpdated: '2024-01-13',
          sku: 'FURN-003'
        },
        {
          id: 4,
          name: 'เสื้อเชิ้ตผ้าฝ้าย',
          price: 890,
          stock: 25,
          category: 'เสื้อผ้า',
          description: 'เสื้อเชิ้ตคุณภาพดี',
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=200&fit=crop',
          status: 'active',
          lastUpdated: '2024-01-12',
          sku: 'CLOTH-004'
        },
        {
          id: 5,
          name: 'แล็ปท็อป MacBook Air',
          price: 39900,
          stock: 8,
          category: 'อิเล็กทรอนิกส์',
          description: 'แล็ปท็อปสำหรับงานและเรียน',
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop',
          status: 'active',
          lastUpdated: '2024-01-11',
          sku: 'LAPTOP-005'
        },
        {
          id: 6,
          name: 'โต๊ะทำงานไม้',
          price: 6500,
          stock: 12,
          category: 'เฟอร์นิเจอร์',
          description: 'โต๊ะทำงานไม้แท้ทนทาน',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
          status: 'active',
          lastUpdated: '2024-01-10',
          sku: 'DESK-006'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'out_of_stock': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'พร้อมขาย';
      case 'inactive': return 'ไม่พร้อมขาย';
      case 'out_of_stock': return 'หมดสต็อก';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูลสินค้า...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📦 จัดการสินค้า</Text>
          <Text style={styles.headerSubtitle}>ระบบจัดการสินค้าคงคลัง</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
            {quickStats.map((stat, index) => (
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

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/search.png' }}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสินค้า, SKU..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#64748B"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/multiply.png' }}
                  style={styles.clearIcon}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* View Mode Toggle */}
        <View style={styles.controlsSection}>
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'grid' && styles.viewModeButtonActive
              ]}
              onPress={() => setViewMode('grid')}
            >
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/grid.png' }}
                style={[
                  styles.viewModeIcon,
                  viewMode === 'grid' && styles.viewModeIconActive
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'list' && styles.viewModeButtonActive
              ]}
              onPress={() => setViewMode('list')}
            >
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/list.png' }}
                style={[
                  styles.viewModeIcon,
                  viewMode === 'list' && styles.viewModeIconActive
                ]}
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => Alert.alert('เพิ่มสินค้า', 'ฟีเจอร์เพิ่มสินค้าใหม่')}
          >
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/plus.png' }}
              style={styles.addIcon}
            />
            <Text style={styles.addText}>เพิ่มสินค้า</Text>
          </TouchableOpacity>
        </View>

        {/* Products List/Grid */}
        <View style={styles.productsSection}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency/64/search-more.png' }}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>ไม่พบสินค้า</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedCategory !== 'ทั้งหมด' 
                  ? 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'
                  : 'ยังไม่มีสินค้าในระบบ'}
              </Text>
            </View>
          ) : (
            <View style={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={viewMode === 'grid' ? styles.productGridItem : styles.productListItem}
                  onPress={() => handleProductPress(product)}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(product.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(product.status)}</Text>
                      </View>
                    </View>
                    <Text style={styles.productSku}>SKU: {product.sku}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <View style={styles.productDetails}>
                      <Text style={styles.productPrice}>{product.price.toLocaleString()}฿</Text>
                      <Text style={[
                        styles.productStock,
                        { color: product.stock < 10 ? '#EF4444' : '#10B981' }
                      ]}>
                        คงเหลือ: {product.stock}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Product Detail Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedProduct && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>รายละเอียดสินค้า</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Image 
                        source={{ uri: 'https://img.icons8.com/fluency-systems-filled/24/multiply.png' }}
                        style={styles.modalCloseIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <Image source={{ uri: selectedProduct.image }} style={styles.modalProductImage} />
                  
                  <View style={styles.modalProductInfo}>
                    <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                    <Text style={styles.modalProductDescription}>{selectedProduct.description}</Text>
                    
                    <View style={styles.modalInfoGrid}>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoLabel}>ราคา:</Text>
                        <Text style={styles.modalInfoValue}>{selectedProduct.price.toLocaleString()}฿</Text>
                      </View>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoLabel}>คงเหลือ:</Text>
                        <Text style={styles.modalInfoValue}>{selectedProduct.stock} ชิ้น</Text>
                      </View>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoLabel}>หมวดหมู่:</Text>
                        <Text style={styles.modalInfoValue}>{selectedProduct.category}</Text>
                      </View>
                      <View style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoLabel}>SKU:</Text>
                        <Text style={styles.modalInfoValue}>{selectedProduct.sku}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.modalActions}>
                      <TouchableOpacity 
                        style={[styles.modalActionButton, styles.editButton]}
                        onPress={() => {
                          setModalVisible(false);
                          Alert.alert('แก้ไขสินค้า', `แก้ไข ${selectedProduct.name}`);
                        }}
                      >
                        <Text style={styles.editButtonText}>แก้ไข</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.modalActionButton, styles.deleteButton]}
                        onPress={() => {
                          Alert.alert(
                            'ลบสินค้า',
                            `คุณต้องการลบ ${selectedProduct.name} หรือไม่?`,
                            [
                              { text: 'ยกเลิก', style: 'cancel' },
                              { 
                                text: 'ลบ', 
                                style: 'destructive',
                                onPress: () => {
                                  setModalVisible(false);
                                  Alert.alert('ลบสินค้า', 'ลบสินค้าเรียบร้อยแล้ว');
                                }
                              }
                            ]
                          );
                        }}
                      >
                        <Text style={styles.deleteButtonText}>ลบ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },

  // Header
  header: {
    padding: 16,
    paddingBottom: 8,
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

  // Stats
  statsSection: {
    marginBottom: 16,
  },
  statsScroll: {
    paddingLeft: 16,
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

  // Search
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#64748B',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  clearIcon: {
    width: 20,
    height: 20,
    tintColor: '#64748B',
  },

  // Categories
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  // Controls
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  viewModeIcon: {
    width: 16,
    height: 16,
    tintColor: '#64748B',
  },
  viewModeIconActive: {
    tintColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
    marginRight: 8,
  },
  addText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Products
  productsSection: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productsList: {
    gap: 12,
  },
  productGridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  productListItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  productSku: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  productStock: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalCloseIcon: {
    width: 24,
    height: 24,
    tintColor: '#64748B',
  },
  modalProductImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F1F5F9',
  },
  modalProductInfo: {
    padding: 20,
  },
  modalProductName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalProductDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInfoGrid: {
    gap: 12,
    marginBottom: 24,
  },
  modalInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.3)',
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },

  // Utility
  bottomSpacing: {
    height: 32,
  },
});
