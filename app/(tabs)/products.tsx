import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import { apiService } from '../../services/apiService';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image?: string;
  brand?: string;
  rating?: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    description: '',
    image: '',
    featured: false
  });

  const categories = ['ทั้งหมด', 'อิเล็กทรอนิกส์', 'อุปกรณ์คอมพิวเตอร์', 'เครื่องใช้ไฟฟ้า', 'เครื่องมือ', 'อื่นๆ'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getList({
        limit: 50
      });

      if (response.success && response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลผลิตภัณฑ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // เพิ่มผลิตภัณฑ์ใหม่
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, หมวดหมู่, ราคา, สต็อก)');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.products.create({
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        brand: newProduct.brand,
        description: newProduct.description,
        image: newProduct.image,
        featured: newProduct.featured
      });

      if (response.success) {
        Alert.alert('สำเร็จ', 'เพิ่มผลิตภัณฑ์ใหม่แล้ว', [
          { text: 'ตกลง', onPress: () => loadProducts() }
        ]);
        setNewProduct({
          name: '',
          category: '',
          price: '',
          stock: '',
          brand: '',
          description: '',
          image: '',
          featured: false
        });
        setShowAddModal(false);
      } else {
        throw new Error(response.message || 'Failed to add product');
      }
    } catch (err: any) {
      console.error('Add product error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเพิ่มผลิตภัณฑ์ได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // แก้ไขผลิตภัณฑ์
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      brand: product.brand || '',
      description: product.description || '',
      image: product.image || '',
      featured: product.featured || false
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.products.update(editingProduct.id, {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        brand: newProduct.brand,
        description: newProduct.description,
        image: newProduct.image,
        featured: newProduct.featured
      });

      if (response.success) {
        Alert.alert('สำเร็จ', 'อัพเดทผลิตภัณฑ์แล้ว', [
          { text: 'ตกลง', onPress: () => loadProducts() }
        ]);
        setShowEditModal(false);
        setEditingProduct(null);
        setNewProduct({
          name: '',
          category: '',
          price: '',
          stock: '',
          brand: '',
          description: '',
          image: '',
          featured: false
        });
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัพเดทผลิตภัณฑ์ได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ลบผลิตภัณฑ์
  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'ยืนยันการลบ',
      `ต้องการลบผลิตภัณฑ์ "${product.name}" หรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ลบ', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.products.delete(product.id);
              
              if (response.success) {
                Alert.alert('สำเร็จ', 'ลบผลิตภัณฑ์แล้ว', [
                  { text: 'ตกลง', onPress: () => loadProducts() }
                ]);
              } else {
                throw new Error(response.message || 'Failed to delete product');
              }
            } catch (err: any) {
              console.error('Delete product error:', err);
              Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบผลิตภัณฑ์ได้: ' + err.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <SidebarLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูลผลิตภัณฑ์...</Text>
        </View>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <ScrollView 
        style={styles.container} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>จัดการผลิตภัณฑ์</Text>
            <Text style={styles.headerSubtitle}>การจัดการผลิตภัณฑ์และข้อมูล</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>เพิ่มสินค้าใหม่</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาผลิตภัณฑ์..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  selectedCategory === category && styles.activeFilterButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedCategory === category && styles.activeFilterButtonText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>ผลิตภัณฑ์ทั้งหมด</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {products.reduce((sum, product) => sum + product.stock, 0)}
            </Text>
            <Text style={styles.statLabel}>สต็อกรวม</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {products.filter(product => product.stock <= 10).length}
            </Text>
            <Text style={styles.statLabel}>สต็อกต่ำ</Text>
          </View>
        </View>

        {/* Products List */}
        <View style={styles.listContainer}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery || selectedCategory !== 'ทั้งหมด' 
                  ? 'ไม่พบผลิตภัณฑ์ที่ตรงกับเงื่อนไข' 
                  : 'ยังไม่มีผลิตภัณฑ์ในระบบ'}
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitle}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    {product.featured && (
                      <View style={styles.featuredBadge}>
                        <Text style={styles.featuredText}>แนะนำ</Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditProduct(product)}
                    >
                      <Text style={styles.editButtonText}>แก้ไข</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteProduct(product)}
                    >
                      <Text style={styles.deleteButtonText}>ลบ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <View style={styles.productDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ราคา:</Text>
                      <Text style={styles.detailValue}>฿{product.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>สต็อก:</Text>
                      <Text style={[
                        styles.detailValue, 
                        product.stock <= 10 && styles.lowStock
                      ]}>
                        {product.stock} ชิ้น
                      </Text>
                    </View>
                    {product.brand && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ยี่ห้อ:</Text>
                        <Text style={styles.detailValue}>{product.brand}</Text>
                      </View>
                    )}
                    {product.description && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>รายละเอียด:</Text>
                        <Text style={styles.detailValue} numberOfLines={2}>
                          {product.description}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add Product Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เพิ่มผลิตภัณฑ์ใหม่</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อผลิตภัณฑ์ *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                  placeholder="กรุณากรอกชื่อผลิตภัณฑ์"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>หมวดหมู่ *</Text>
                <View style={styles.categorySelector}>
                  {categories.filter(cat => cat !== 'ทั้งหมด').map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newProduct.category === category && styles.selectedCategory
                      ]}
                      onPress={() => setNewProduct({...newProduct, category})}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newProduct.category === category && styles.selectedCategoryText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ราคา (บาท) *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>จำนวนสต็อก *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.stock}
                  onChangeText={(text) => setNewProduct({...newProduct, stock: text})}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ยี่ห้อ</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.brand}
                  onChangeText={(text) => setNewProduct({...newProduct, brand: text})}
                  placeholder="ยี่ห้อผลิตภัณฑ์"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>รายละเอียด</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                  placeholder="รายละเอียดผลิตภัณฑ์"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.featuredToggle}
                  onPress={() => setNewProduct({...newProduct, featured: !newProduct.featured})}
                >
                  <View style={[styles.checkbox, newProduct.featured && styles.checkboxActive]} />
                  <Text style={styles.featuredLabel}>ผลิตภัณฑ์แนะนำ</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.submitButtonText}>บันทึกผลิตภัณฑ์</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>แก้ไขผลิตภัณฑ์</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อผลิตภัณฑ์ *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                  placeholder="กรุณากรอกชื่อผลิตภัณฑ์"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>หมวดหมู่ *</Text>
                <View style={styles.categorySelector}>
                  {categories.filter(cat => cat !== 'ทั้งหมด').map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newProduct.category === category && styles.selectedCategory
                      ]}
                      onPress={() => setNewProduct({...newProduct, category})}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newProduct.category === category && styles.selectedCategoryText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ราคา (บาท) *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>จำนวนสต็อก *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.stock}
                  onChangeText={(text) => setNewProduct({...newProduct, stock: text})}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ยี่ห้อ</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.brand}
                  onChangeText={(text) => setNewProduct({...newProduct, brand: text})}
                  placeholder="ยี่ห้อผลิตภัณฑ์"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>รายละเอียด</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                  placeholder="รายละเอียดผลิตภัณฑ์"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.featuredToggle}
                  onPress={() => setNewProduct({...newProduct, featured: !newProduct.featured})}
                >
                  <View style={[styles.checkbox, newProduct.featured && styles.checkboxActive]} />
                  <Text style={styles.featuredLabel}>ผลิตภัณฑ์แนะนำ</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateProduct}
              >
                <Text style={styles.submitButtonText}>อัพเดทผลิตภัณฑ์</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateText: {
    color: '#6B7280',
    fontSize: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  productCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  productDetails: {
    gap: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  lowStock: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedCategory: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryOptionText: {
    color: '#6B7280',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  featuredToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  featuredLabel: {
    fontSize: 14,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
