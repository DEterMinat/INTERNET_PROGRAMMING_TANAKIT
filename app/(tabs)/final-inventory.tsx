import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SidebarLayout from '../../components/SidebarLayout';
import { apiService } from '../../services/apiService';

export default function FinalInventoryScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImg, setNewImg] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await apiService.finalInventory.getList();
      if (res.success) {
        setItems(res.data || []);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load final inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Request permissions and pick image
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to select images');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImageUri(uri);
        
        // Upload image
        await uploadImage(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos');
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
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Upload image to server
  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const response: any = await apiService.upload.uploadImage(uri);
      if (response.success && response.data) {
        setNewImg(response.data.url);
        Alert.alert('Success', 'Image uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
      setSelectedImageUri(null);
    } finally {
      setUploading(false);
    }
  };

  const addItem = async () => {
    if (!newName) return Alert.alert('Validation', 'Name required');
    try {
      const qty = parseInt(newQty) || 0;
      const price = parseFloat(newPrice) || 0;
      const res: any = await apiService.finalInventory.create({ 
        name: newName, 
        qty, 
        price, 
        img: newImg 
      });
      if (res.success) {
        Alert.alert('Success', 'Item added successfully');
        setNewName(''); 
        setNewQty(''); 
        setNewPrice(''); 
        setNewImg('');
        setSelectedImageUri(null);
        load();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  return (
    <SidebarLayout>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Final Exam Inventory</Text>
        <Text style={styles.subtitle}>Prefix: 6630202261</Text>

        {/* Product List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Products ({items.length})</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(i) => String(i.id)}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {item.img && (
                    <Image source={{ uri: item.img }} style={styles.thumbnail} />
                  )}
                  <View style={styles.itemContent}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.detail}>Qty: {item.qty} | Price: ฿{item.price}</Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* Add Product Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Add New Product</Text>

          <TextInput
            placeholder="Product Name *"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <TextInput
            placeholder="Quantity"
            value={newQty}
            onChangeText={setNewQty}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Price (฿)"
            value={newPrice}
            onChangeText={setNewPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Image Selection */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Product Image</Text>
            
            {selectedImageUri && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setSelectedImageUri(null);
                    setNewImg('');
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
                  {uploading ? 'Uploading...' : '📁 Pick Image'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.imageButton, uploading && styles.buttonDisabled]}
                onPress={takePhoto}
                disabled={uploading}
              >
                <Text style={styles.imageButtonText}>
                  {uploading ? 'Uploading...' : '📷 Take Photo'}
                </Text>
              </TouchableOpacity>
            </View>

            {uploading && (
              <ActivityIndicator size="small" color="#2563eb" style={styles.uploadingIndicator} />
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, (!newName || uploading) && styles.buttonDisabled]}
            onPress={addItem}
            disabled={!newName || uploading}
          >
            <Text style={styles.buttonText}>
              {uploading ? 'Uploading Image...' : 'Add Product'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4, color: '#1f2937' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#374151' },
  listContainer: { marginBottom: 24 },
  item: { 
    flexDirection: 'row',
    padding: 12, 
    borderBottomWidth: 1, 
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
  },
  itemContent: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  detail: { fontSize: 14, color: '#6b7280' },
  form: { 
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  imageSection: { marginBottom: 16 },
  imageButtons: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  imageButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  imageButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  imagePreview: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  uploadingIndicator: { marginTop: 8 },
  button: { 
    backgroundColor: '#2563eb', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  buttonDisabled: { backgroundColor: '#9ca3af', opacity: 0.6 },
});