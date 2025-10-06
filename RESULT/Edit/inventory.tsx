// ============================================
// Frontend Component - Edit (Update) Functionality
// File: app/(tabs)/inventory.tsx
// ============================================

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
  
  // ✏️ EDIT State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // Load Inventory
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.inventory.getList({ limit: 50 });

      if (response.success && response.data && Array.isArray(response.data)) {
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
      setError('ไม่สามารถโหลดข้อมูลได้');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper functions
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

  // ============================================
  // ✏️ EDIT FUNCTIONALITY
  // ============================================
  
  // เปิด Edit Modal พร้อมข้อมูลเดิม
  const handleEditProduct = (item: InventoryItem) => {
    console.log('✏️ Edit button clicked for:', item);
    
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

  // บันทึกการแก้ไข
  const handleUpdateProduct = async () => {
    if (!editingItem) return;

    console.log('✏️ Update product called');
    console.log('Editing item:', editingItem);
    console.log('New data:', newProduct);

    // Validation
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, หมวดหมู่, ราคา, สต็อก)');
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        brand: newProduct.brand || '',
        description: newProduct.description || '',
        image: newProduct.image || ''
      };

      console.log('Sending update request:', updateData);

      const response = await apiService.inventory.update(
        parseInt(editingItem.id), 
        updateData
      );

      console.log('✅ Update response:', response);

      if (response.success) {
        Alert.alert('สำเร็จ', 'อัพเดทสินค้าแล้ว', [
          { text: 'ตกลง', onPress: () => loadInventory() }
        ]);
        
        // Close modal and reset
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
      console.error('❌ Update product error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัพเดทสินค้าได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ยกเลิกการแก้ไข
  const cancelEdit = () => {
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
  };

  // Add Product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น');
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

  // Delete Product
  const handleDeleteProduct = (item: InventoryItem) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setLoading(true);
      const response = await apiService.inventory.delete(parseInt(deletingItem.id));

      if (response.success) {
        Alert.alert('สำเร็จ', 'ลบสินค้าเรียบร้อยแล้ว');
        setShowDeleteModal(false);
        setDeletingItem(null);
        await loadInventory();
      } else {
        throw new Error(response.message || 'Failed to delete product');
      }
    } catch (err: any) {
      console.error('Delete product error:', err);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถลบสินค้าได้: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  // ============================================
  // Render Component
  // ============================================
  return (
    <SidebarLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 จัดการคลังสินค้า</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>➕ เพิ่มสินค้า</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Inventory List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
          </View>
        ) : filteredInventory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? `ไม่พบสินค้าที่ตรงกับ "${searchQuery}"` : 'ไม่มีสินค้าในคลัง'}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.inventoryList}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>รหัส</Text>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>ชื่อสินค้า</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>หมวดหมู่</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>ราคา</Text>
              <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>สต็อก</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>สถานะ</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>จัดการ</Text>
            </View>

            {filteredInventory.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.sku}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.category}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>฿{item.price.toLocaleString()}</Text>
                <Text style={[styles.tableCell, { flex: 0.8 }]}>{item.stock}</Text>
                <View style={[{ flex: 1 }, styles.statusContainer]}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={[{ flex: 1 }, styles.actionButtons]}>
                  {/* ✏️ EDIT BUTTON */}
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditProduct(item)}
                  >
                    <Text style={styles.buttonText}>✏️</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProduct(item)}
                  >
                    <Text style={styles.buttonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* ============================================ */}
        {/* ✏️ EDIT MODAL */}
        {/* ============================================ */}
        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelEdit}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>✏️ แก้ไขสินค้า</Text>
                <Text style={styles.modalSubtitle}>ID: {editingItem?.id} | SKU: {editingItem?.sku}</Text>

                <Text style={styles.label}>ชื่อสินค้า *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ชื่อสินค้า"
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                />

                <Text style={styles.label}>หมวดหมู่ *</Text>
                <View style={styles.pickerContainer}>
                  {categories.filter(c => c !== 'ทั้งหมด').map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        newProduct.category === cat && styles.categoryOptionSelected
                      ]}
                      onPress={() => setNewProduct({...newProduct, category: cat})}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newProduct.category === cat && styles.categoryOptionTextSelected
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>ราคา (บาท) *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      value={newProduct.price}
                      onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>จำนวนสต็อก *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      value={newProduct.stock}
                      onChangeText={(text) => setNewProduct({...newProduct, stock: text})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <Text style={styles.label}>แบรนด์/ยี่ห้อ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="แบรนด์/ยี่ห้อ"
                  value={newProduct.brand}
                  onChangeText={(text) => setNewProduct({...newProduct, brand: text})}
                />

                <Text style={styles.label}>คำอธิบาย</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="คำอธิบายสินค้า"
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.label}>URL รูปภาพ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.image}
                  onChangeText={(text) => setNewProduct({...newProduct, image: text})}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={cancelEdit}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleUpdateProduct}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>💾 บันทึก</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Add Modal (same structure) */}
        <Modal visible={showAddModal} transparent={true} animationType="slide" onRequestClose={() => setShowAddModal(false)}>
          {/* Similar to Edit Modal but for adding */}
        </Modal>

        {/* Delete Modal */}
        <Modal visible={showDeleteModal} transparent={true} animationType="fade" onRequestClose={cancelDelete}>
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>⚠️ ยืนยันการลบ</Text>
              <Text style={styles.deleteModalMessage}>
                คุณต้องการลบสินค้า "{deletingItem?.name}" หรือไม่?
              </Text>
              <Text style={styles.deleteModalWarning}>การลบจะถาวรและไม่สามารถกู้คืนได้!</Text>
              
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelDelete} disabled={loading}>
                  <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.confirmDeleteButton} onPress={confirmDelete} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmDeleteButtonText}>ลบถาวร</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SidebarLayout>
  );
}

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Search
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearIcon: {
    fontSize: 20,
    color: '#9CA3AF',
    padding: 5,
  },
  
  // Category
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Table
  inventoryList: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableCell: {
    fontSize: 14,
    color: '#1F2937',
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Delete Modal
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalWarning: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Loading & Empty
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
