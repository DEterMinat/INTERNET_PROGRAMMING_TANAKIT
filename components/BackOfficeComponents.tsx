import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StockLevelIndicatorProps {
  currentStock: number;
  minStock: number;
  maxStock: number;
  size?: 'small' | 'medium' | 'large';
}

export function StockLevelIndicator({ currentStock, minStock, maxStock, size = 'medium' }: StockLevelIndicatorProps) {
  const stockPercentage = (currentStock / maxStock) * 100;
  
  const getStockColor = () => {
    if (currentStock === 0) return '#E53E3E'; // Red for out of stock
    if (currentStock <= minStock) return '#F6AD55'; // Orange for low stock
    if (stockPercentage >= 80) return '#38A169'; // Green for high stock
    return '#4299E1'; // Blue for normal stock
  };

  const getIndicatorSize = () => {
    switch (size) {
      case 'small': return { width: 60, height: 8 };
      case 'large': return { width: 150, height: 12 };
      default: return { width: 100, height: 10 };
    }
  };

  const indicatorSize = getIndicatorSize();
  const stockColor = getStockColor();

  return (
    <View style={styles.container}>
      <View style={[styles.stockBar, indicatorSize]}>
        <View 
          style={[
            styles.stockFill, 
            { 
              width: `${Math.min(stockPercentage, 100)}%`, 
              backgroundColor: stockColor 
            }
          ]} 
        />
      </View>
      <Text style={[styles.stockText, size === 'small' && styles.smallText]}>
        {currentStock}/{maxStock}
      </Text>
    </View>
  );
}

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  onPress?: () => void;
}

export function QuickStatsCard({ title, value, icon, color, trend, onPress }: QuickStatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '#718096';
    switch (trend.direction) {
      case 'up': return '#38A169';
      case 'down': return '#E53E3E';
      default: return '#718096';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.statsCard, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.statsHeader}>
        <Text style={styles.statsIcon}>{icon}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text style={styles.trendIcon}>{getTrendIcon()}</Text>
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trend.percentage}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  count?: number;
}

export function FilterChip({ label, isActive, onPress, count }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.activeFilterChip]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
        {label}
        {count !== undefined && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );
}

interface ActionButtonProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function ActionButton({ title, icon, color, onPress, size = 'medium' }: ActionButtonProps) {
  const getButtonSize = () => {
    switch (size) {
      case 'small': return styles.smallButton;
      case 'large': return styles.largeButton;
      default: return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.actionButton, getButtonSize(), { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock' | 'in_stock';
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'active':
        return { color: '#38A169', bg: '#F0FFF4', text: 'Active', icon: '✅' };
      case 'inactive':
        return { color: '#718096', bg: '#F7FAFC', text: 'Inactive', icon: '⏸️' };
      case 'low_stock':
        return { color: '#D69E2E', bg: '#FFFBEB', text: 'Low Stock', icon: '⚠️' };
      case 'out_of_stock':
        return { color: '#E53E3E', bg: '#FED7D7', text: 'Out of Stock', icon: '❌' };
      case 'in_stock':
        return { color: '#38A169', bg: '#F0FFF4', text: 'In Stock', icon: '✅' };
      default:
        return { color: '#718096', bg: '#F7FAFC', text: 'Unknown', icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
      {showIcon && <Text style={styles.statusIcon}>{statusInfo.icon}</Text>}
      <Text style={[styles.statusText, { color: statusInfo.color }]}>
        {statusInfo.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Stock Level Indicator
  container: {
    alignItems: 'center',
  },
  stockBar: {
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  stockFill: {
    height: '100%',
    borderRadius: 5,
  },
  stockText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  smallText: {
    fontSize: 10,
  },

  // Quick Stats Card
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statsIcon: {
    fontSize: 20,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: '#718096',
  },

  // Filter Chip
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
  activeFilterChip: {
    backgroundColor: '#4299E1',
    borderColor: '#4299E1',
  },
  filterChipText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  largeButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
