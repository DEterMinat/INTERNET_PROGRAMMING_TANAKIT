// ============================================
// Frontend Component - Delete & Search
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
  // 🔍 SEARCH State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  // 🗑️ DELETE State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['ทั้งหมด', 'อิเล็กทรอนิกส์', 'อุปกรณ์คอมพิวเตอร์', 'เครื่องใช้ไฟฟ้า', 'เครื่องมือ', 'อื่นๆ'];

  // ============================================
  // Load Inventory Data
  // ============================================
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

  // ============================================
  // 🔍 SEARCH FUNCTIONALITY - Filter Inventory
  // ============================================
  const filteredInventory = inventory.filter(item => {
    // Search by name or SKU
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // ============================================
  // 🗑️ DELETE FUNCTIONALITY
  // ============================================
  
  // เปิด Modal ยืนยันการลบ
  const handleDeleteProduct = (item: InventoryItem) => {
    console.log('Delete button clicked for:', item);
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  // ยืนยันการลบ
  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setLoading(true);
      console.log('Deleting product:', deletingItem.id);

      const response = await apiService.inventory.delete(parseInt(deletingItem.id));

      console.log('Delete response:', response);

      if (response.success) {
        Alert.alert('สำเร็จ', 'ลบสินค้าเรียบร้อยแล้ว');
        setShowDeleteModal(false);
        setDeletingItem(null);
        // Reload inventory
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

  // ยกเลิกการลบ
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
        </View>

        {/* ============================================ */}
        {/* 🔍 SEARCH BAR */}
        {/* ============================================ */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสินค้า (ชื่อ, SKU)..."
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

          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoryScroll}
          >
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

        {/* Search Results Count */}
        {searchQuery && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              🔍 พบ {filteredInventory.length} รายการจาก "{searchQuery}"
            </Text>
          </View>
        )}

        {/* ============================================ */}
        {/* Inventory List */}
        {/* ============================================ */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadInventory}>
              <Text style={styles.retryButtonText}>ลองใหม่</Text>
            </TouchableOpacity>
          </View>
        ) : filteredInventory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `ไม่พบสินค้าที่ตรงกับ "${searchQuery}"` 
                : 'ไม่มีสินค้าในคลัง'}
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
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
                
                {/* ============================================ */}
                {/* 🗑️ DELETE BUTTON */}
                {/* ============================================ */}
                <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', gap: 5 }]}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {/* Edit function */}}
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
        {/* 🗑️ DELETE CONFIRMATION MODAL */}
        {/* ============================================ */}
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>⚠️ ยืนยันการลบ</Text>
              <Text style={styles.deleteModalMessage}>
                คุณต้องการลบสินค้า "{deletingItem?.name}" หรือไม่?
              </Text>
              <Text style={styles.deleteModalWarning}>
                การลบจะถาวรและไม่สามารถกู้คืนได้!
              </Text>
              
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={cancelDelete}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.confirmDeleteButton}
                  onPress={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmDeleteButtonText}>ลบถาวร</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SidebarLayout>
  );
}

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
// Styles
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  // 🔍 Search Styles
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
  searchResults: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  
  // Category Filter
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // 🗑️ Delete Button
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
  
  // 🗑️ Delete Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  
  // Loading & Error
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
