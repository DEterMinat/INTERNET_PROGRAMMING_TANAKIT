import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api, dashboardApi, productsApi } from '../services/api';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  response?: any;
  error?: string;
  timestamp?: string;
}

export default function APITestScreen() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [
      { ...result, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9) // Keep only last 10 results
    ]);
  };

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    addTestResult({
      endpoint: name,
      status: 'pending'
    });

    try {
      const response = await testFn();
      addTestResult({
        endpoint: name,
        status: 'success',
        response: response
      });
      return true;
    } catch (error) {
      addTestResult({
        endpoint: name,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  const runAllTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Health Check',
        test: () => api.healthCheck()
      },
      {
        name: 'Products List (Database)',
        test: () => productsApi.getList()
      },
      {
        name: 'Products Statistics',
        test: () => productsApi.getStatistics()
      },
      {
        name: 'Dashboard Overview',
        test: () => dashboardApi.getOverview()
      },
      {
        name: 'Single Product (ID: 1)',
        test: () => productsApi.getById(1)
      }
    ];

    let successCount = 0;
    
    for (const { name, test } of tests) {
      const success = await testEndpoint(name, test);
      if (success) successCount++;
      
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    Alert.alert(
      'Test Results',
      `Tests completed!\n✅ Passed: ${successCount}/${tests.length}\n❌ Failed: ${tests.length - successCount}/${tests.length}`,
      [{ text: 'OK' }]
    );
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '🔄';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>API Testing</Text>
          <Text style={styles.subtitle}>Test Backend Database API Endpoints</Text>
        </View>

        <View style={styles.controlsCard}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.runButton, isRunning && styles.buttonDisabled]}
              onPress={runAllTests}
              disabled={isRunning}
            >
              <Text style={styles.runButtonText}>
                {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearResults}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsCard}>
          <Text style={styles.cardTitle}>Test Results</Text>
          
          {testResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No test results yet</Text>
              <Text style={styles.emptySubtext}>Run tests to see results here</Text>
            </View>
          ) : (
            testResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitle}>
                    <Text style={styles.statusIcon}>{getStatusIcon(result.status)}</Text>
                    <Text style={styles.endpointName}>{result.endpoint}</Text>
                  </View>
                  {result.timestamp && (
                    <Text style={styles.timestamp}>{result.timestamp}</Text>
                  )}
                </View>

                {result.status === 'success' && result.response && (
                  <View style={styles.successDetails}>
                    <Text style={styles.successText}>
                      ✅ Success: {result.response.success ? 'OK' : 'Response received'}
                    </Text>
                    {result.response.data && Array.isArray(result.response.data) && (
                      <Text style={styles.dataInfo}>
                        📊 Data: {result.response.data.length} items
                      </Text>
                    )}
                  </View>
                )}

                {result.status === 'error' && (
                  <View style={styles.errorDetails}>
                    <Text style={styles.errorText}>❌ Error: {result.error}</Text>
                  </View>
                )}

                {result.status === 'pending' && (
                  <Text style={styles.pendingText}>🔄 Testing...</Text>
                )}
              </View>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Endpoint Information</Text>
          
          <View style={styles.endpointList}>
            <View style={styles.endpointItem}>
              <Text style={styles.method}>GET</Text>
              <Text style={styles.path}>/health</Text>
            </View>
            <View style={styles.endpointItem}>
              <Text style={styles.method}>GET</Text>
              <Text style={styles.path}>/api/db-products</Text>
            </View>
            <View style={styles.endpointItem}>
              <Text style={styles.method}>GET</Text>
              <Text style={styles.path}>/api/db-products/statistics</Text>
            </View>
            <View style={styles.endpointItem}>
              <Text style={styles.method}>GET</Text>
              <Text style={styles.path}>/api/dashboard</Text>
            </View>
            <View style={styles.endpointItem}>
              <Text style={styles.method}>GET</Text>
              <Text style={styles.path}>/api/db-products/:id</Text>
            </View>
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
  controlsCard: {
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  runButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  runButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#6C757D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  resultsCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  endpointName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  successDetails: {
    backgroundColor: '#f8fff8',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
  },
  dataInfo: {
    color: '#2e7d32',
    fontSize: 12,
    marginTop: 2,
  },
  errorDetails: {
    backgroundColor: '#fff8f8',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  pendingText: {
    color: '#ff9800',
    fontSize: 14,
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
  endpointList: {
    gap: 8,
  },
  endpointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    gap: 12,
  },
  method: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
    textAlign: 'center',
  },
  path: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
});
