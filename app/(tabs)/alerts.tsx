import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Alert {
  id: number;
  type: 'low_stock' | 'out_of_stock' | 'expiry' | 'reorder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'medium' | 'low';
  productId?: number;
  productName?: string;
  currentStock?: number;
  minimumStock?: number;
}

const AlertsScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterType, setFilterType] = useState<'all' | Alert['type']>('all');
  const [alertSettings, setAlertSettings] = useState({
    lowStockEnabled: true,
    outOfStockEnabled: true,
    expiryEnabled: true,
    reorderEnabled: true,
    systemEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: 1,
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'iPhone 14 Pro is running low on stock',
      timestamp: '2024-01-15 09:30',
      read: false,
      severity: 'high',
      productId: 1,
      productName: 'iPhone 14 Pro',
      currentStock: 5,
      minimumStock: 10,
    },
    {
      id: 2,
      type: 'out_of_stock',
      title: 'Out of Stock',
      message: 'Samsung Galaxy S23 is out of stock',
      timestamp: '2024-01-15 08:15',
      read: false,
      severity: 'high',
      productId: 2,
      productName: 'Samsung Galaxy S23',
      currentStock: 0,
      minimumStock: 5,
    },
    {
      id: 3,
      type: 'expiry',
      title: 'Product Expiry Warning',
      message: 'Warranty expires soon for 3 products',
      timestamp: '2024-01-14 16:45',
      read: true,
      severity: 'medium',
    },
    {
      id: 4,
      type: 'reorder',
      title: 'Reorder Recommendation',
      message: 'Consider reordering MacBook Air M2',
      timestamp: '2024-01-14 14:20',
      read: true,
      severity: 'medium',
      productId: 3,
      productName: 'MacBook Air M2',
      currentStock: 8,
      minimumStock: 15,
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'Inventory system will be updated tonight',
      timestamp: '2024-01-13 10:00',
      read: true,
      severity: 'low',
    },
  ];

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'low_stock':
        return '#FF9500';
      case 'out_of_stock':
        return '#FF3B30';
      case 'expiry':
        return '#FF9500';
      case 'reorder':
        return '#007AFF';
      case 'system':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filterType === 'all' || alert.type === filterType
  );

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const AlertItem = ({ alert }: { alert: Alert }) => (
    <TouchableOpacity
      style={[styles.alertItem, !alert.read && styles.unreadAlert]}
      onPress={() => {
        setSelectedAlert(alert);
        setShowModal(true);
      }}
    >
      <View style={styles.alertHeader}>
        <View style={[styles.alertTypeIndicator, { backgroundColor: getAlertColor(alert.type) }]} />
        <View style={styles.alertInfo}>
          <Text style={[styles.alertTitle, !alert.read && styles.unreadText]}>
            {alert.title}
          </Text>
          <Text style={styles.alertMessage} numberOfLines={2}>
            {alert.message}
          </Text>
          <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
        </View>
        <View style={styles.alertMeta}>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(alert.severity) }]}>
            <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
          </View>
          {!alert.read && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ type, title }: { type: typeof filterType, title: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filterType === type && styles.activeFilter]}
      onPress={() => setFilterType(type)}
    >
      <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SettingsModal = () => (
    <Modal visible={showModal && selectedAlert === null} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Alert Settings</Text>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.settingsContainer}>
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Alert Types</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Low Stock Alerts</Text>
              <Switch
                value={alertSettings.lowStockEnabled}
                onValueChange={(value) => setAlertSettings({...alertSettings, lowStockEnabled: value})}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Out of Stock Alerts</Text>
              <Switch
                value={alertSettings.outOfStockEnabled}
                onValueChange={(value) => setAlertSettings({...alertSettings, outOfStockEnabled: value})}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Expiry Warnings</Text>
              <Switch
                value={alertSettings.expiryEnabled}
                onValueChange={(value) => setAlertSettings({...alertSettings, expiryEnabled: value})}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Reorder Recommendations</Text>
              <Switch
                value={alertSettings.reorderEnabled}
                onValueChange={(value) => setAlertSettings({...alertSettings, reorderEnabled: value})}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>System Notifications</Text>
              <Switch
                value={alertSettings.systemEnabled}
                onValueChange={(value) => setAlertSettings({...alertSettings, systemEnabled: value})}
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Notification Delivery</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Switch
                value={alertSettings.emailNotifications}
                onValueChange={(value) => setAlertSettings({...alertSettings, emailNotifications: value})}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={alertSettings.pushNotifications}
                onValueChange={(value) => setAlertSettings({...alertSettings, pushNotifications: value})}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const AlertDetailModal = () => (
    <Modal visible={showModal && selectedAlert !== null} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Alert Details</Text>
          <TouchableOpacity onPress={() => {
            setShowModal(false);
            setSelectedAlert(null);
          }}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        {selectedAlert && (
          <ScrollView style={styles.detailContainer}>
            <View style={[styles.detailHeader, { backgroundColor: getAlertColor(selectedAlert.type) }]}>
              <Text style={styles.detailTitle}>{selectedAlert.title}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(selectedAlert.severity) }]}>
                <Text style={styles.severityText}>{selectedAlert.severity.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailMessage}>{selectedAlert.message}</Text>
              <Text style={styles.detailTimestamp}>Timestamp: {selectedAlert.timestamp}</Text>

              {selectedAlert.productName && (
                <View style={styles.productInfo}>
                  <Text style={styles.productInfoTitle}>Product Information</Text>
                  <Text style={styles.productInfoText}>Name: {selectedAlert.productName}</Text>
                  {selectedAlert.currentStock !== undefined && (
                    <Text style={styles.productInfoText}>Current Stock: {selectedAlert.currentStock}</Text>
                  )}
                  {selectedAlert.minimumStock !== undefined && (
                    <Text style={styles.productInfoText}>Minimum Stock: {selectedAlert.minimumStock}</Text>
                  )}
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Product</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
                  <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>Take Action</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Alerts & Notifications</ThemedText>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => {
            setSelectedAlert(null);
            setShowModal(true);
          }}>
            <Text style={styles.settingsButton}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <FilterButton type="all" title="All" />
        <FilterButton type="low_stock" title="Low Stock" />
        <FilterButton type="out_of_stock" title="Out of Stock" />
        <FilterButton type="expiry" title="Expiry" />
        <FilterButton type="reorder" title="Reorder" />
        <FilterButton type="system" title="System" />
      </ScrollView>

      <FlatList
        data={filteredAlerts}
        renderItem={({ item }) => <AlertItem alert={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <SettingsModal />
      <AlertDetailModal />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  alertItem: {
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
  unreadAlert: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  alertMeta: {
    alignItems: 'flex-end',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 14,
    color: '#333',
  },
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  detailContent: {
    padding: 20,
  },
  detailMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  detailTimestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  productInfo: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  productInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryActionButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  primaryActionButtonText: {
    color: '#fff',
  },
});

export default AlertsScreen;
