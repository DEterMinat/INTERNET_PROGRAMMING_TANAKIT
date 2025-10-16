import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import { apiService } from '../../services/apiService';

interface FinalInventoryItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  img?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'low_stock';
}

export default function FinalInventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inventory, setInventory] = useState<FinalInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FinalInventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<FinalInventoryItem | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'น้ำดื่ม',
    price: '',
    qty: '',
    img: ''
  });

  const categories = ['ทั้งหมด', 'น้ำดื่ม', 'น้ำแร่', 'น้ำอัดลม', 'น้ำผลไม้', 'อื่นๆ'];

  // ดึงข้อมูล inventory จาก API
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.finalInventory.getList();

      if (response.success && response.data && Array.isArray(response.data)) {
        const inventoryData: FinalInventoryItem[] = response.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name || 'ไม่ระบุชื่อ',
          qty: item.qty || 0,
          price: item.price || 0,
          img: item.img,
          category: item.category || 'อื่นๆ',
          status: item.qty < 5 ? 'low_stock' : 'active',
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
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Image Picker Functions
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตการเข้าถึงคลังภาพ');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImageUri(uri);
        await uploadImage(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเลือกรูปภาพได้');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ไม่ได้รับอนุญาต', 'กรุณาอนุญาตการเข้าถึงกล้อง');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImageUri(uri);
        await uploadImage(uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถถ่ายรูปได้');
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const response: any = await apiService.upload.uploadImage(uri);
      if (response.success && response.data) {
        setNewProduct({...newProduct, img: response.data.url});
        Alert.alert('สำเร็จ', 'อัพโหลดรูปภาพเรียบร้อย');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถอัพโหลดรูปภาพได้');
      setSelectedImageUri(null);
    } finally {
      setUploading(false);
    }
  };

  // เพิ่มสินค้าใหม่
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.qty) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, ราคา, จำนวน)');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.finalInventory.create({
        name: newProduct.name,
        qty: parseInt(newProduct.qty),
        price: parseFloat(newProduct.price),
        img: newProduct.img || ''
      });

      if (response.success) {
        Alert.alert('สำเร็จ', 'เพิ่มสินค้าใหม่แล้ว', [
          { text: 'ตกลง', onPress: () => loadInventory() }
        ]);
        setNewProduct({
          name: '',
          category: 'น้ำดื่ม',
          price: '',
          qty: '',
          img: ''
        });
        setSelectedImageUri(null);
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
  const handleEditProduct = (item: FinalInventoryItem) => {
    setEditingItem(item);
    setNewProduct({
      name: item.name,
      category: item.category || 'น้ำดื่ม',
      price: item.price.toString(),
      qty: item.qty.toString(),
      img: item.img || ''
    });
    if (item.img) {
      setSelectedImageUri(item.img);
    }
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingItem) return;

    if (!newProduct.name || !newProduct.price || !newProduct.qty) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiService.finalInventory.update(parseInt(editingItem.id), {
        name: newProduct.name,
        qty: parseInt(newProduct.qty),
        price: parseFloat(newProduct.price),
        img: newProduct.img || ''
      });

      if (response.success) {
        Alert.alert('สำเร็จ', 'อัพเดทสินค้าเรียบร้อย', [
          { text: 'ตกลง', onPress: () => loadInventory() }
        ]);
        setNewProduct({
          name: '',
          category: 'น้ำดื่ม',
          price: '',
          qty: '',
          img: ''
        });
        setSelectedImageUri(null);
        setEditingItem(null);
        setShowEditModal(false);
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

  // ลบสินค้า
  const handleDeleteProduct = (item: FinalInventoryItem) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setLoading(true);
      
      const response = await apiService.finalInventory.delete(parseInt(deletingItem.id));

      if (response.success) {
        Alert.alert('สำเร็จ', 'ลบสินค้าเรียบร้อย', [
          { text: 'ตกลง', onPress: () => loadInventory() }
        ]);
        setShowDeleteModal(false);
        setDeletingItem(null);
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

  // สถิติ
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (loading && inventory.length === 0) {
    return (
      <SidebarLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
        </View>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>จัดการสินค้าคงคลัง Final Exam</Text>
            <Text style={styles.headerSubtitle}>รหัสนักศึกษา: 6630202261 - ธนกฤษ ศิริธีรพันธ์</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ เพิ่มสินค้าใหม่</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadInventory}
            >
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
                <Text style={[
                  styles.filterButtonText,
                  selectedCategory === category && styles.activeFilterButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>รายการสินค้า</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{lowStockItems}</Text>
            <Text style={styles.statLabel}>สต็อกต่ำ</Text>
          </View>
          <View style={[styles.statCard, {marginRight: 0}]}>
            <Text style={styles.statValue}>฿{totalValue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>มูลค่ารวม</Text>
          </View>
        </View>

        {/* Inventory List */}
        <View style={styles.listContainer}>
          {filteredInventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery || selectedCategory !== 'ทั้งหมด' 
                  ? 'ไม่พบสินค้าที่ค้นหา' 
                  : 'ยังไม่มีสินค้าในระบบ'
                }
              </Text>
            </View>
          ) : (
            filteredInventory.map((item) => (
              <View key={item.id} style={styles.inventoryCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitle}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSku}>ID: {item.id}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditProduct(item)}
                    >
                      <Text style={styles.editButtonText}>แก้ไข</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteProduct(item)}
                    >
                      <Text style={styles.deleteButtonText}>ลบ</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  {item.img && (
                    <Image source={{ uri: item.img }} style={styles.itemImage} />
                  )}
                  
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'active') }]}>
                      <Text style={styles.statusText}>{getStatusText(item.status || 'active')}</Text>
                    </View>
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ราคา:</Text>
                      <Text style={styles.detailValue}>฿{item.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>จำนวน:</Text>
                      <Text style={styles.detailValue}>{item.qty} ชิ้น</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>มูลค่ารวม:</Text>
                      <Text style={styles.detailValue}>฿{(item.price * item.qty).toLocaleString()}</Text>
                    </View>
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
          presentationStyle="fullScreen"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>เพิ่มสินค้าใหม่</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewProduct({
                    name: '',
                    category: 'น้ำดื่ม',
                    price: '',
                    qty: '',
                    img: ''
                  });
                  setSelectedImageUri(null);
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อสินค้า *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                  placeholder="ระบุชื่อสินค้า"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>หมวดหมู่ *</Text>
                <View style={styles.categorySelector}>
                  {categories.filter(c => c !== 'ทั้งหมด').map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        newProduct.category === cat && styles.selectedCategory
                      ]}
                      onPress={() => setNewProduct({...newProduct, category: cat})}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newProduct.category === cat && styles.selectedCategoryText
                      ]}>
                        {cat}
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
                  value={newProduct.qty}
                  onChangeText={(text) => setNewProduct({...newProduct, qty: text})}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              {/* Image Upload Section */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>รูปภาพสินค้า</Text>
                
                {selectedImageUri && (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => {
                        setSelectedImageUri(null);
                        setNewProduct({...newProduct, img: ''});
                      }}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={[styles.imageButton, uploading && styles.buttonDisabled]}
                    onPress={pickImage}
                    disabled={uploading}
                  >
                    <Text style={styles.imageButtonText}>
                      {uploading ? 'กำลังอัพโหลด...' : '📁 เลือกจากคลัง'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.imageButton, uploading && styles.buttonDisabled]}
                    onPress={takePhoto}
                    disabled={uploading}
                  >
                    <Text style={styles.imageButtonText}>
                      {uploading ? 'กำลังอัพโหลด...' : '📷 ถ่ายรูป'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {uploading && (
                  <ActivityIndicator size="small" color="#3B82F6" style={styles.uploadingIndicator} />
                )}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, uploading && styles.buttonDisabled]}
                onPress={handleAddProduct}
                disabled={uploading}
              >
                <Text style={styles.submitButtonText}>
                  {uploading ? 'กำลังอัพโหลดรูปภาพ...' : 'เพิ่มสินค้า'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>แก้ไขสินค้า</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  setNewProduct({
                    name: '',
                    category: 'น้ำดื่ม',
                    price: '',
                    qty: '',
                    img: ''
                  });
                  setSelectedImageUri(null);
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ชื่อสินค้า *</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                  placeholder="ระบุชื่อสินค้า"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>หมวดหมู่ *</Text>
                <View style={styles.categorySelector}>
                  {categories.filter(c => c !== 'ทั้งหมด').map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        newProduct.category === cat && styles.selectedCategory
                      ]}
                      onPress={() => setNewProduct({...newProduct, category: cat})}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newProduct.category === cat && styles.selectedCategoryText
                      ]}>
                        {cat}
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
                  value={newProduct.qty}
                  onChangeText={(text) => setNewProduct({...newProduct, qty: text})}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              {/* Image Upload Section */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>รูปภาพสินค้า</Text>
                
                {selectedImageUri && (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => {
                        setSelectedImageUri(null);
                        setNewProduct({...newProduct, img: ''});
                      }}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.imageButtons}>
                  <TouchableOpacity
                    style={[styles.imageButton, uploading && styles.buttonDisabled]}
                    onPress={pickImage}
                    disabled={uploading}
                  >
                    <Text style={styles.imageButtonText}>
                      {uploading ? 'กำลังอัพโหลด...' : '📁 เลือกจากคลัง'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.imageButton, uploading && styles.buttonDisabled]}
                    onPress={takePhoto}
                    disabled={uploading}
                  >
                    <Text style={styles.imageButtonText}>
                      {uploading ? 'กำลังอัพโหลด...' : '📷 ถ่ายรูป'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {uploading && (
                  <ActivityIndicator size="small" color="#3B82F6" style={styles.uploadingIndicator} />
                )}
              </View>

              <TouchableOpacity
                style={[styles.submitButton, uploading && styles.buttonDisabled]}
                onPress={handleUpdateProduct}
                disabled={uploading}
              >
                <Text style={styles.submitButtonText}>
                  {uploading ? 'กำลังอัพโหลดรูปภาพ...' : 'อัพเดทสินค้า'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.deleteModalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>ยืนยันการลบ</Text>
              <Text style={styles.deleteModalMessage}>
                ต้องการลบสินค้า "{deletingItem?.name}" หรือไม่?
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowDeleteModal(false);
                    setDeletingItem(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDeleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmDeleteButtonText}>ลบ</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
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
  imagePreview: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  uploadingIndicator: {
    marginTop: 8,
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
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    minWidth: 280,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
