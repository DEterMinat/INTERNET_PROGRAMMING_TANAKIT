import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface StockMovement {
  id: number;
  productName: string;
  sku: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  reason: string;
  fromLocation?: string;
  toLocation?: string;
  date: string;
  performedBy: string;
  referenceNo?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
}

const StockMovementScreen = () => {
  const [activeTab, setActiveTab] = useState<'in' | 'out' | 'transfer' | 'history'>('in');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const products: Product[] = [
    { id: 1, name: 'iPhone 14 Pro', sku: 'IP14P-128', currentStock: 45 },
    { id: 2, name: 'Samsung Galaxy S23', sku: 'SGS23-256', currentStock: 32 },
    { id: 3, name: 'MacBook Air M2', sku: 'MBA-M2-512', currentStock: 18 },
  ];

  const stockMovements: StockMovement[] = [
    {
      id: 1,
      productName: 'iPhone 14 Pro',
      sku: 'IP14P-128',
      type: 'in',
      quantity: 50,
      reason: 'Purchase Order #PO-2024-001',
      date: '2024-01-15 10:30',
      performedBy: 'John Doe',
      referenceNo: 'PO-2024-001'
    },
    {
      id: 2,
      productName: 'Samsung Galaxy S23',
      sku: 'SGS23-256',
      type: 'out',
      quantity: 5,
      reason: 'Sale Order #SO-2024-045',
      date: '2024-01-15 14:20',
      performedBy: 'Jane Smith',
      referenceNo: 'SO-2024-045'
    },
    {
      id: 3,
      productName: 'MacBook Air M2',
      sku: 'MBA-M2-512',
      type: 'transfer',
      quantity: 3,
      reason: 'Store Transfer',
      fromLocation: 'Warehouse A',
      toLocation: 'Store B',
      date: '2024-01-14 16:45',
      performedBy: 'Mike Johnson',
      referenceNo: 'TRF-2024-012'
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: '',
    fromLocation: '',
    toLocation: '',
    referenceNo: '',
  });

  const handleSubmit = () => {
    if (!formData.productId || !formData.quantity || !formData.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Stock movement recorded successfully', [
      { text: 'OK', onPress: () => {
        setShowModal(false);
        setFormData({
          productId: '',
          quantity: '',
          reason: '',
          fromLocation: '',
          toLocation: '',
          referenceNo: '',
        });
      }}
    ]);
  };

  const TabButton = ({ tab, title }: { tab: typeof activeTab, title: string }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const StockForm = () => (
    <ScrollView style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {activeTab === 'in' && 'Stock In'}
        {activeTab === 'out' && 'Stock Out'}
        {activeTab === 'transfer' && 'Stock Transfer'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Product *</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>
            {formData.productId ? 
              products.find(p => p.id.toString() === formData.productId)?.name 
              : 'Select Product'
            }
          </Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quantity *</Text>
        <TextInput
          style={styles.input}
          value={formData.quantity}
          onChangeText={(text) => setFormData({...formData, quantity: text})}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reason *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.reason}
          onChangeText={(text) => setFormData({...formData, reason: text})}
          placeholder="Enter reason for stock movement"
          multiline
          numberOfLines={3}
        />
      </View>

      {activeTab === 'transfer' && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.fromLocation}
              onChangeText={(text) => setFormData({...formData, fromLocation: text})}
              placeholder="Enter source location"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>To Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.toLocation}
              onChangeText={(text) => setFormData({...formData, toLocation: text})}
              placeholder="Enter destination location"
            />
          </View>
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reference No.</Text>
        <TextInput
          style={styles.input}
          value={formData.referenceNo}
          onChangeText={(text) => setFormData({...formData, referenceNo: text})}
          placeholder="Enter reference number (optional)"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Record Movement</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const HistoryList = () => {
    const filteredMovements = stockMovements.filter(movement =>
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderMovementItem = ({ item }: { item: StockMovement }) => (
      <View style={styles.movementCard}>
        <View style={styles.movementHeader}>
          <Text style={styles.productName}>{item.productName}</Text>
          <View style={[styles.typeTag, 
            item.type === 'in' && styles.typeTagIn,
            item.type === 'out' && styles.typeTagOut,
            item.type === 'transfer' && styles.typeTagTransfer
          ]}>
            <Text style={styles.typeTagText}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.sku}>SKU: {item.sku}</Text>
        <Text style={styles.quantity}>
          Quantity: {item.type === 'out' ? '-' : '+'}{item.quantity}
        </Text>
        <Text style={styles.reason}>Reason: {item.reason}</Text>
        
        {item.type === 'transfer' && (
          <Text style={styles.location}>
            From: {item.fromLocation} → To: {item.toLocation}
          </Text>
        )}
        
        <View style={styles.movementFooter}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.performedBy}>By: {item.performedBy}</Text>
        </View>
        
        {item.referenceNo && (
          <Text style={styles.referenceNo}>Ref: {item.referenceNo}</Text>
        )}
      </View>
    );

    return (
      <View style={styles.historyContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by product name or SKU..."
          />
        </View>

        <FlatList
          data={filteredMovements}
          renderItem={renderMovementItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Stock Movement</ThemedText>
      </View>

      <View style={styles.tabContainer}>
        <TabButton tab="in" title="Stock In" />
        <TabButton tab="out" title="Stock Out" />
        <TabButton tab="transfer" title="Transfer" />
        <TabButton tab="history" title="History" />
      </View>

      {activeTab !== 'history' ? (
        <ScrollView style={styles.content}>
          <View style={styles.quickStats}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Today In</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Today Out</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Transfers</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>
              + Record {activeTab === 'in' ? 'Stock In' : activeTab === 'out' ? 'Stock Out' : 'Transfer'}
            </Text>
          </TouchableOpacity>

          <View style={styles.recentMovements}>
            <Text style={styles.sectionTitle}>Recent Movements</Text>
            {stockMovements.slice(0, 3).map((movement) => (
              <View key={movement.id} style={styles.recentMovementItem}>
                <View style={styles.recentMovementInfo}>
                  <Text style={styles.recentProductName}>{movement.productName}</Text>
                  <Text style={styles.recentQuantity}>
                    {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                  </Text>
                </View>
                <Text style={styles.recentDate}>{movement.date.split(' ')[0]}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <HistoryList />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <StockForm />
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  quickStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentMovements: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  recentMovementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentMovementInfo: {
    flex: 1,
  },
  recentProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recentQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  recentDate: {
    fontSize: 12,
    color: '#999',
  },
  historyContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  movementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  typeTagIn: {
    backgroundColor: '#E8F5E8',
  },
  typeTagOut: {
    backgroundColor: '#FFE8E8',
  },
  typeTagTransfer: {
    backgroundColor: '#E8F0FF',
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  sku: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 8,
  },
  movementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  performedBy: {
    fontSize: 11,
    color: '#999',
  },
  referenceNo: {
    fontSize: 11,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StockMovementScreen;
