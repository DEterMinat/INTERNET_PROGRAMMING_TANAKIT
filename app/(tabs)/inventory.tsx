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
}

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    unit: 'ชิ้น',
    location: ''
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
          unit: item.unit || 'ชิ้น',
          location: item.location || 'ไม่ระบุ',
          status: item.stock <= 10 ? 'low_stock' : 'active',
          lastUpdated: item.updated_at || new Date().toISOString().split('T')[0],
          image: item.image
        }));

        setInventory(inventoryData);
      } else {
        throw new Error('Failed to fetch inventory');
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setInventory([]); // ไม่มีข้อมูล
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

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.price) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newProduct.name,
      sku: newProduct.sku,
      category: newProduct.category || 'อื่นๆ',
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      unit: newProduct.unit,
      location: newProduct.location || 'A-00',
      status: 'active',
      lastUpdated: new Date().toLocaleDateString('th-TH')
    };

    setInventory(prev => [newItem, ...prev]);
    setNewProduct({
      name: '',
      sku: '',
      category: '',
      price: '',
      stock: '',
      unit: 'ชิ้น',
      location: ''
    });
    setShowAddModal(false);
    Alert.alert('สำเร็จ', 'เพิ่มสินค้าใหม่แล้ว');
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
                  selectedCategory === category && styles.activeFilter
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterText,
                  selectedCategory === category && styles.activeFilterText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Inventory Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>รายการสินค้าคงคลัง</Text>
            </View>
            
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>สินค้า</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>ราคา</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>สต็อก</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>สถานะ</Text>
              </View>
              
              {/* Table Body */}
              {filteredInventory.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productSku}>SKU: {item.sku}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={styles.tableCellText}>
                      ฿{item.price.toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={styles.tableCellText}>
                      {item.stock} {item.unit}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {filteredInventory.length === 0 && (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyText}>ไม่พบข้อมูลสินค้า</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Add Product Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddModal}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>เพิ่มสินค้าใหม่</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>ชื่อสินค้า *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newProduct.name}
                    onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                    placeholder="กรอกชื่อสินค้า"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>SKU *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newProduct.sku}
                    onChangeText={(text) => setNewProduct({...newProduct, sku: text})}
                    placeholder="รหัสสินค้า"
                  />
                </View>
                
                <View style={styles.formRow}>
                  <View style={styles.formHalf}>
                    <Text style={styles.formLabel}>หมวดหมู่</Text>
                    <TextInput
                      style={styles.formInput}
                      value={newProduct.category}
                      onChangeText={(text) => setNewProduct({...newProduct, category: text})}
                      placeholder="หมวดหมู่"
                    />
                  </View>
                  <View style={styles.formHalf}>
                    <Text style={styles.formLabel}>ราคา *</Text>
                    <TextInput
                      style={styles.formInput}
                      value={newProduct.price}
                      onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                      placeholder="0.00"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                
                <View style={styles.formRow}>
                  <View style={styles.formHalf}>
                    <Text style={styles.formLabel}>จำนวน</Text>
                    <TextInput
                      style={styles.formInput}
                      value={newProduct.stock}
                      onChangeText={(text) => setNewProduct({...newProduct, stock: text})}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formHalf}>
                    <Text style={styles.formLabel}>หน่วย</Text>
                    <TextInput
                      style={styles.formInput}
                      value={newProduct.unit}
                      onChangeText={(text) => setNewProduct({...newProduct, unit: text})}
                      placeholder="ชิ้น"
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>ตำแหน่ง</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newProduct.location}
                    onChangeText={(text) => setNewProduct({...newProduct, location: text})}
                    placeholder="A-01"
                  />
                </View>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleAddProduct}
                >
                  <Text style={styles.submitButtonText}>เพิ่มสินค้า</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
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
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  searchContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  tableContainer: {
    padding: 20,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  table: {
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableCell: {
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 14,
    color: '#1E293B',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  productSku: {
    fontSize: 12,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyRow: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
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
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748B',
  },
  modalForm: {
    padding: 20,
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  formHalf: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
});
