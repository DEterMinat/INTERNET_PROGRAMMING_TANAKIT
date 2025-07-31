import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Type definitions
interface InventoryFormData {
  id?: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  quantity: string;
  unit: string;
  location: string;
  supplier: string;
  cost: string;
  price: string;
  minStock: string;
  maxStock: string;
  description: string;
  warranty: string;
  image: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

const CATEGORIES: DropdownOption[] = [
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Gaming', value: 'Gaming' },
  { label: 'Home Appliances', value: 'Home Appliances' },
  { label: 'Toys', value: 'Toys' },
  { label: 'Fashion', value: 'Fashion' },
  { label: 'Books', value: 'Books' },
  { label: 'Sports', value: 'Sports' },
];

const UNITS: DropdownOption[] = [
  { label: 'Pieces (pcs)', value: 'pcs' },
  { label: 'Boxes', value: 'boxes' },
  { label: 'Kilograms (kg)', value: 'kg' },
  { label: 'Liters (L)', value: 'L' },
  { label: 'Meters (m)', value: 'm' },
  { label: 'Sets', value: 'sets' },
  { label: 'Pairs', value: 'pairs' },
];

const LOCATIONS: DropdownOption[] = [
  { label: 'A-01-001', value: 'A-01-001' },
  { label: 'A-01-002', value: 'A-01-002' },
  { label: 'A-02-001', value: 'A-02-001' },
  { label: 'B-01-001', value: 'B-01-001' },
  { label: 'B-02-001', value: 'B-02-001' },
  { label: 'C-01-001', value: 'C-01-001' },
];

const SUPPLIERS: string[] = [
  'Apple Thailand',
  'Samsung Electronics',
  'Sony Corporation',
  'Microsoft Thailand',
  'Nintendo Co Ltd',
  'LG Electronics',
  'Dell Technologies',
  'HP Inc',
  'Asus Computer',
  'Acer Inc',
];

export default function AddEditInventoryScreen() {
  const [isEditing] = useState(false); // This would be passed as prop in real app
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    quantity: '',
    unit: 'pcs',
    location: '',
    supplier: '',
    cost: '',
    price: '',
    minStock: '',
    maxStock: '',
    description: '',
    warranty: '',
    image: '',
  });

  const [selectedDropdown, setSelectedDropdown] = useState<string | null>(null);
  const [supplierSuggestions, setSupplierSuggestions] = useState<string[]>([]);
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);

  const handleInputChange = (field: keyof InventoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Handle supplier autocomplete
    if (field === 'supplier') {
      if (value.trim()) {
        const filtered = SUPPLIERS.filter(supplier =>
          supplier.toLowerCase().includes(value.toLowerCase())
        );
        setSupplierSuggestions(filtered);
        setShowSupplierSuggestions(true);
      } else {
        setShowSupplierSuggestions(false);
      }
    }
  };

  const generateSKU = () => {
    if (formData.category && formData.name) {
      const categoryCode = formData.category.substring(0, 3).toUpperCase();
      const nameCode = formData.name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const sku = `${categoryCode}-${nameCode}-${randomNum}`;
      setFormData(prev => ({ ...prev, sku }));
    } else {
      Alert.alert('Generate SKU', 'Please fill in Category and Item Name first');
    }
  };

  const generateBarcode = () => {
    const barcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    setFormData(prev => ({ ...prev, barcode: barcode.toString() }));
  };

  const validateForm = (): boolean => {
    const required = ['name', 'sku', 'category', 'quantity', 'unit', 'location'];
    
    for (const field of required) {
      const value = formData[field as keyof InventoryFormData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        Alert.alert('Validation Error', `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    const quantity = parseInt(formData.quantity);
    const minStock = parseInt(formData.minStock);
    const maxStock = parseInt(formData.maxStock);

    if (isNaN(quantity) || quantity < 0) {
      Alert.alert('Validation Error', 'Quantity must be a valid number');
      return false;
    }

    if (minStock && maxStock && minStock >= maxStock) {
      Alert.alert('Validation Error', 'Minimum stock must be less than maximum stock');
      return false;
    }

    if (formData.cost && formData.price) {
      const cost = parseFloat(formData.cost);
      const price = parseFloat(formData.price);
      if (cost > price) {
        Alert.alert('Warning', 'Cost is higher than selling price. This will result in a loss.');
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const itemData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      cost: parseFloat(formData.cost) || 0,
      price: parseFloat(formData.price) || 0,
      minStock: parseInt(formData.minStock) || 0,
      maxStock: parseInt(formData.maxStock) || 100,
    };

    // In a real app, this would call an API
    Alert.alert(
      isEditing ? 'Item Updated' : 'Item Added',
      isEditing 
        ? `${itemData.name} has been updated successfully` 
        : `${itemData.name} has been added to inventory`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form or navigate back
            if (!isEditing) {
              setFormData({
                name: '',
                sku: '',
                barcode: '',
                category: '',
                quantity: '',
                unit: 'pcs',
                location: '',
                supplier: '',
                cost: '',
                price: '',
                minStock: '',
                maxStock: '',
                description: '',
                warranty: '',
                image: '',
              });
            }
          }
        }
      ]
    );
  };

  const handleSelectSupplier = (supplier: string) => {
    setFormData(prev => ({ ...prev, supplier }));
    setShowSupplierSuggestions(false);
  };

  const renderDropdown = (
    label: string,
    field: keyof InventoryFormData,
    options: DropdownOption[],
    placeholder: string
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label} *</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setSelectedDropdown(selectedDropdown === field ? null : field)}
      >
        <Text style={[styles.dropdownButtonText, !formData[field] && styles.placeholderText]}>
          {formData[field] || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>
          {selectedDropdown === field ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {selectedDropdown === field && (
        <View style={styles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownOption}
              onPress={() => {
                handleInputChange(field, option.value);
                setSelectedDropdown(null);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderFormInput = (
    label: string,
    field: keyof InventoryFormData,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    multiline: boolean = false,
    required: boolean = false
  ) => (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>
        {label} {required && '*'}
      </Text>
      <TextInput
        style={[styles.formInput, multiline && styles.multilineInput]}
        value={String(formData[field] || '')}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#A0AEC0"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? '✏️ Edit Item' : '➕ Add New Item'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing ? 'Update inventory item details' : 'Add new item to inventory'}
          </Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Basic Information</Text>
            
            {renderFormInput('Item Name', 'name', 'Enter item name', 'default', false, true)}
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderFormInput('SKU', 'sku', 'Item SKU', 'default', false, true)}
              </View>
              <View style={styles.halfWidth}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Generate SKU</Text>
                  <TouchableOpacity style={styles.generateButton} onPress={generateSKU}>
                    <Text style={styles.generateButtonText}>🔄 Auto</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderFormInput('Barcode', 'barcode', 'Item barcode', 'numeric')}
              </View>
              <View style={styles.halfWidth}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Generate Barcode</Text>
                  <TouchableOpacity style={styles.generateButton} onPress={generateBarcode}>
                    <Text style={styles.generateButtonText}>🔄 Auto</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {renderDropdown('Category', 'category', CATEGORIES, 'Select category')}
            {renderFormInput('Description', 'description', 'Item description', 'default', true)}
          </View>

          {/* Stock Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Stock Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderFormInput('Quantity', 'quantity', '0', 'numeric', false, true)}
              </View>
              <View style={styles.halfWidth}>
                {renderDropdown('Unit', 'unit', UNITS, 'Select unit')}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderFormInput('Min Stock', 'minStock', '0', 'numeric')}
              </View>
              <View style={styles.halfWidth}>
                {renderFormInput('Max Stock', 'maxStock', '100', 'numeric')}
              </View>
            </View>

            {renderDropdown('Warehouse Location', 'location', LOCATIONS, 'Select location')}
          </View>

          {/* Supplier Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏢 Supplier Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Supplier</Text>
              <TextInput
                style={styles.formInput}
                value={formData.supplier}
                onChangeText={(value) => handleInputChange('supplier', value)}
                placeholder="Enter or select supplier"
                placeholderTextColor="#A0AEC0"
                onFocus={() => setShowSupplierSuggestions(true)}
              />
              
              {showSupplierSuggestions && supplierSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {supplierSuggestions.map((supplier, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSupplier(supplier)}
                    >
                      <Text style={styles.suggestionText}>{supplier}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Pricing Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Pricing Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                {renderFormInput('Cost Price', 'cost', '0.00', 'numeric')}
              </View>
              <View style={styles.halfWidth}>
                {renderFormInput('Selling Price', 'price', '0.00', 'numeric')}
              </View>
            </View>

            {formData.cost && formData.price && (
              <View style={styles.profitCard}>
                <Text style={styles.profitLabel}>Profit Analysis</Text>
                <View style={styles.profitRow}>
                  <Text style={styles.profitText}>
                    Profit: {formatCurrency(parseFloat(formData.price) - parseFloat(formData.cost))}
                  </Text>
                  <Text style={styles.profitText}>
                    Margin: {(((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price)) * 100).toFixed(2)}%
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Additional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ Additional Information</Text>
            
            {renderFormInput('Warranty Period', 'warranty', 'e.g., 1 year, 6 months')}
            {renderFormInput('Image URL', 'image', 'https://example.com/image.jpg')}
            
            {formData.image && (
              <View style={styles.imagePreview}>
                <Text style={styles.imagePreviewLabel}>Image Preview:</Text>
                <Image source={{ uri: formData.image }} style={styles.previewImage} />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Item' : 'Add Item'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  keyboardView: {
    flex: 1,
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
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Section
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },
  
  // Form Elements
  formGroup: {
    marginBottom: 16,
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
    backgroundColor: '#FFFFFF',
    color: '#1A202C',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  
  // Dropdown
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1A202C',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#718096',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#1A202C',
  },
  
  // Generate Button
  generateButton: {
    backgroundColor: '#4299E1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Suggestions
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#1A202C',
  },
  
  // Profit Card
  profitCard: {
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#38A169',
  },
  profitLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 4,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profitText: {
    fontSize: 14,
    color: '#276749',
    fontWeight: '500',
  },
  
  // Image Preview
  imagePreview: {
    marginTop: 12,
  },
  imagePreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4299E1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
