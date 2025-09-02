import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import { apiService } from '../../services/apiService';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  location: string;
  status: 'active' | 'inactive' | 'low_stock';
  image?: string;
  lastUpdated: string;
  brand?: string;
  description?: string;
}

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    description: '',
    image: ''
  });

  const categories = ['ทั้งหมด', 'อิเล็กทรอนิกส์', 'อุปกรณ์คอมพิวเตอร์', 'เครื่องใช้ไฟฟ้า', 'เครื่องมือ', 'อื่นๆ'];

  // ดึงข้อมูล inventory จาก API
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.inventory.getList({
        limit: 50
      });

      if (response.success && response.data && Array.isArray(response.data)) {
        // แปลงข้อมูลจาก API
        const inventoryData: InventoryItem[] = response.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name || 'ไม่ระบุชื่อ',
          sku: item.sku || item.id.toString(),
          category: item.category || 'อื่นๆ',
          price: item.price || 0,
          stock: item.stock || 0,
          unit: 'ชิ้น',
          location: item.location || 'ไม่ระบุ',
          status: item.stock <= 10 ? 'low_stock' : 'active',
          lastUpdated: item.lastRestocked || new Date().toISOString().split('T')[0],
          image: item.image,
          brand: item.supplier,
          description: item.description
        }));

        setInventory(inventoryData);
      } else {
        throw new Error('Failed to fetch inventory');
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'low_stock': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'พร้อมใช้';
      case 'inactive': return 'ไม่ใช้งาน';
      case 'low_stock': return 'เหลือน้อย';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  // เพิ่มสินค้าใหม่
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, หมวดหมู่, ราคา, สต็อก)');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.inventory.create({
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        brand: newProduct.brand || '',
        description: newProduct.description || '',
        image: newProduct.image || ''
      });

      if (response.success) {
        Alert.alert('สำเร็จ', 'เพิ่มสินค้าใหม่แล้ว', [
          { text: 'ตกลง', onPress: () => loadInventory() }
        ]);
        setNewProduct({
          name: '',
          category: '',
          price: '',
          stock: '',
          brand: '',
          description: '',
          image: ''
        });
        setShowAddModal(false);
      } else {
        throw new Error(response.message || 'Failed to add product');
      }
    } catch (err: any) {
      console.error('Add product error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเพิ่มสินค้าได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // แก้ไขสินค้า
  const handleEditProduct = (item: InventoryItem) => {
    setEditingItem(item);
    setNewProduct({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
      brand: item.brand || '',
      description: item.description || '',
      image: item.image || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingItem) return;

    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.inventory.update(parseInt(editingItem.id), {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        brand: newProduct.brand || '',
        description: newProduct.description || '',
        image: newProduct.image || ''
      });

      if (response.success) {
        Alert.alert('สำเร็จ', 'อัพเดทสินค้าแล้ว', [
          { text: 'ตกลง', onPress: () => loadInventory() }
        ]);
        setShowEditModal(false);
        setEditingItem(null);
        setNewProduct({
          name: '',
          category: '',
          price: '',
          stock: '',
          brand: '',
          description: '',
          image: ''
        });
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัพเดทสินค้าได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ลบสินค้า (simplified for testing)
  const handleDeleteProduct = (item: InventoryItem) => {
    console.log('Delete function called for:', item.name);
    
    // Simple test - just show a basic alert first
    Alert.alert('ทดสอบ', `คุณต้องการลบ ${item.name} หรือไม่?`, [
      { text: 'ยกเลิก' },
      { text: 'ลบ', onPress: () => console.log('User confirmed delete') }
    ]);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูลสินค้า...</Text>
        </View>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>จัดการสินค้าคงคลัง</Text>
            <Text style={styles.headerSubtitle}>การจัดการสินค้าและการติดตามสต็อก</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>เพิ่มสินค้าใหม่</Text>
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadInventory}>
              <Text style={styles.retryButtonText}>ลองใหม่อีกครั้ง</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสินค้า..."
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
            <Text style={styles.statValue}>{inventory.length}</Text>
            <Text style={styles.statLabel}>รายการสินค้า</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {inventory.reduce((sum, item) => sum + item.stock, 0)}
            </Text>
            <Text style={styles.statLabel}>จำนวนสต็อก</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {inventory.filter(item => item.status === 'low_stock').length}
            </Text>
            <Text style={styles.statLabel}>สต็อกต่ำ</Text>
          </View>
        </View>

        {/* Inventory List */}
        <View style={styles.listContainer}>
          {filteredInventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery || selectedCategory !== 'ทั้งหมด' 
                  ? 'ไม่พบสินค้าที่ตรงกับเงื่อนไข' 
                  : 'ยังไม่มีสินค้าในระบบ'}
              </Text>
            </View>
          ) : (
            filteredInventory.map((item) => (
              <View key={item.id} style={styles.inventoryCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitle}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => {
                        console.log('Edit button pressed');
                        handleEditProduct(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.editButtonText}>แก้ไข</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => {
                        console.log('Delete button pressed');
                        handleDeleteProduct(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteButtonText}>ลบ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ราคา:</Text>
                      <Text style={styles.detailValue}>฿{item.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>สต็อก:</Text>
                      <Text style={styles.detailValue}>{item.stock} {item.unit}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ตำแหน่ง:</Text>
                      <Text style={styles.detailValue}>{item.location}</Text>
                    </View>
                    {item.brand && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ยี่ห้อ:</Text>
                        <Text style={styles.detailValue}>{item.brand}</Text>
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
              <Text style={styles.modalTitle}>เพิ่มสินค้าใหม่</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อสินค้า *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                  placeholder="กรุณากรอกชื่อสินค้า"
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
                  placeholder="ยี่ห้อสินค้า"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>รายละเอียด</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                  placeholder="รายละเอียดสินค้า"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.submitButtonText}>บันทึกสินค้า</Text>
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
              <Text style={styles.modalTitle}>แก้ไขสินค้า</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อสินค้า *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                  placeholder="กรุณากรอกชื่อสินค้า"
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
                  placeholder="ยี่ห้อสินค้า"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>รายละเอียด</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                  placeholder="รายละเอียดสินค้า"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateProduct}
              >
                <Text style={styles.submitButtonText}>อัพเดทสินค้า</Text>
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
  errorContainer: {
    backgroundColor: '#FEE2E2',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderColor: '#F87171',
    borderWidth: 1,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'center',
  },
  retryButtonText: {
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
  inventoryCard: {
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
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemSku: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
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
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemCategory: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDetails: {
    gap: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
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
