import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../services/api';

interface HealthStatus {
  server: boolean;
  database: boolean;
  lastChecked: string;
  error?: string;
}

export default function BackOfficeScreen() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    server: false,
    database: false,
    lastChecked: '',
    error: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Checking Backend health...');
      const response = await api.healthCheck();
      
      if (response.success && response.data) {
        setHealthStatus({
          server: true,
          database: response.data.database === 'connected',
          lastChecked: new Date().toLocaleString(),
          error: undefined
        });
        console.log('✅ Health check successful:', response.data);
      } else {
        setHealthStatus({
          server: false,
          database: false,
          lastChecked: new Date().toLocaleString(),
          error: response.error || 'Unknown error'
        });
        console.error('❌ Health check failed:', response.error);
      }
    } catch (error) {
      console.error('❌ Health check error:', error);
      setHealthStatus({
        server: false,
        database: false,
        lastChecked: new Date().toLocaleString(),
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: boolean) => {
    return status ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Connected' : 'Disconnected';
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Backend Management</Text>
          <Text style={styles.subtitle}>System Health & Status</Text>
        </View>

        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Text style={styles.cardTitle}>System Health</Text>
            <TouchableOpacity
              style={[styles.refreshButton, isLoading && styles.buttonDisabled]}
              onPress={checkHealth}
              disabled={isLoading}
            >
              <Text style={styles.refreshButtonText}>
                {isLoading ? '🔄' : '🔄 Refresh'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Backend Server:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(healthStatus.server) }]}>
                <Text style={styles.statusText}>{getStatusText(healthStatus.server)}</Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>MySQL Database:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(healthStatus.database) }]}>
                <Text style={styles.statusText}>{getStatusText(healthStatus.database)}</Text>
              </View>
            </View>
          </View>

          {healthStatus.lastChecked && (
            <Text style={styles.lastChecked}>
              Last checked: {healthStatus.lastChecked}
            </Text>
          )}

          {healthStatus.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {healthStatus.error}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showAlert(
              'Database Info',
              'Database: it_std6630202261\nHost: localhost:3306\nStatus: ' + getStatusText(healthStatus.database)
            )}
          >
            <Text style={styles.actionButtonText}>📊 Database Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showAlert(
              'API Endpoints',
              'Products: /api/db-products\nInventory: /api/inventory\nAuth: /api/auth\nHealth: /health'
            )}
          >
            <Text style={styles.actionButtonText}>🔗 API Endpoints</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showAlert(
              'Server Info',
              'Backend: Node.js + Express\nDatabase: MySQL\nPort: 9785\nEnvironment: Production'
            )}
          >
            <Text style={styles.actionButtonText}>⚙️ Server Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>System Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Backend URL:</Text>
            <Text style={styles.infoValue}>http://nindam.sytes.net:9785</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Database:</Text>
            <Text style={styles.infoValue}>MySQL (it_std6630202261)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mode:</Text>
            <Text style={styles.infoValue}>Database Only (No Mock Data)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  statusContainer: {
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  lastChecked: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});
