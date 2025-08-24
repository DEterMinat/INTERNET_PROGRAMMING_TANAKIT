import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  FlatList,
  Dimensions 
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ExploreItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  image: string;
  description: string;
  rating: number;
  tags: string[];
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: 'ทั้งหมด', count: 156, color: '#3B82F6', icon: 'https://img.icons8.com/fluency/32/view-all.png' },
    { id: 'electronics', name: 'อิเล็กทรอนิกส์', count: 45, color: '#10B981', icon: 'https://img.icons8.com/fluency/32/smartphone.png' },
    { id: 'furniture', name: 'เฟอร์นิเจอร์', count: 32, color: '#8B5CF6', icon: 'https://img.icons8.com/fluency/32/sofa.png' },
    { id: 'office', name: 'อุปกรณ์สำนักงาน', count: 28, color: '#F59E0B', icon: 'https://img.icons8.com/fluency/32/office.png' },
    { id: 'tools', name: 'เครื่องมือ', count: 51, color: '#EF4444', icon: 'https://img.icons8.com/fluency/32/toolbox.png' },
  ];

  const exploreItems: ExploreItem[] = [
    {
      id: '1',
      name: 'แล็ปท็อป Dell XPS 13',
      category: 'อิเล็กทรอนิกส์',
      stock: 12,
      price: 65990,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      description: 'แล็ปท็อปประสิทธิภาพสูง สำหรับการทำงาน',
      rating: 4.8,
      tags: ['ใหม่', 'แนะนำ', 'ขายดี']
    },
    {
      id: '2',
      name: 'เครื่องปรินเตอร์ HP LaserJet',
      category: 'อุปกรณ์สำนักงาน',
      stock: 8,
      price: 12500,
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop',
      description: 'เครื่องพิมพ์เลเซอร์คุณภาพสูง',
      rating: 4.5,
      tags: ['ประหยัด']
    },
    {
      id: '3',
      name: 'โซฟาผ้า 3 ที่นั่ง',
      category: 'เฟอร์นิเจอร์',
      stock: 5,
      price: 15900,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      description: 'โซฟาผ้านุ่มสบาย เหมาะสำหรับพักผ่อน',
      rating: 4.6,
      tags: ['สบาย', 'สวย']
    },
    {
      id: '4',
      name: 'สมาร์ทโฟน Samsung Galaxy S24',
      category: 'อิเล็กทรอนิกส์',
      stock: 25,
      price: 32990,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      description: 'สมาร์ทโฟนล่าสุด พร้อมกล้องคุณภาพสูง',
      rating: 4.9,
      tags: ['ใหม่', 'กล้องดี', 'ขายดี']
    },
    {
      id: '5',
      name: 'เครื่องมือช่าง ชุด 50 ชิ้น',
      category: 'เครื่องมือ',
      stock: 15,
      price: 2890,
      image: 'https://images.unsplash.com/photo-1581863432495-49371ef5a663?w=300&h=300&fit=crop',
      description: 'เครื่องมือช่างครบชุด สำหรับงานซ่อมแซม',
      rating: 4.3,
      tags: ['ครบชุด', 'คุ้มค่า']
    },
    {
      id: '6',
      name: 'โต๊ะทำงานไม้โอ๊ค',
      category: 'เฟอร์นิเจอร์',
      stock: 7,
      price: 8500,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      description: 'โต๊ะทำงานไม้แท้ ดีไซน์โมเดิร์น',
      rating: 4.4,
      tags: ['ไม้แท้', 'ทนทาน']
    }
  ];

  // Filter items
  const filteredItems = exploreItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.includes(searchQuery));
    const matchesCategory = selectedCategory === 'all' || item.category === categories.find(c => c.id === selectedCategory)?.name;
    
    return matchesSearch && matchesCategory;
  });

  const renderCategoryCard = (category: any) => (
    <TouchableOpacity 
      key={category.id}
      style={[styles.categoryCard, selectedCategory === category.id && styles.categoryCardActive]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <LinearGradient
        colors={selectedCategory === category.id ? [category.color, '#1E3A8A'] : ['#F8FAFC', '#FFFFFF']}
        style={styles.categoryGradient}
      >
        <Image 
          source={{ uri: category.icon }} 
          style={[styles.categoryIcon, { 
            tintColor: selectedCategory === category.id ? '#FFFFFF' : category.color 
          }]} 
        />
        <Text style={[
          styles.categoryName,
          { color: selectedCategory === category.id ? '#FFFFFF' : '#1E293B' }
        ]}>
          {category.name}
        </Text>
        <Text style={[
          styles.categoryCount,
          { color: selectedCategory === category.id ? 'rgba(255,255,255,0.8)' : '#64748B' }
        ]}>
          {category.count} รายการ
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderExploreItem = ({ item }: { item: ExploreItem }) => {
    if (viewMode === 'list') {
      return (
        <TouchableOpacity style={styles.listItem}>
          <Image source={{ uri: item.image }} style={styles.listItemImage} />
          <View style={styles.listItemContent}>
            <View style={styles.listItemHeader}>
              <Text style={styles.listItemName} numberOfLines={2}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency/16/star.png' }} 
                  style={styles.starIcon} 
                />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
            <Text style={styles.listItemCategory}>{item.category}</Text>
            <Text style={styles.listItemDescription} numberOfLines={2}>{item.description}</Text>
            <View style={styles.listItemFooter}>
              <Text style={styles.listItemPrice}>฿{item.price.toLocaleString()}</Text>
              <View style={styles.listItemTags}>
                {item.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.stockText, { 
                color: item.stock < 10 ? '#EF4444' : '#10B981' 
              }]}>
                คงเหลือ {item.stock}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={[styles.gridItem, isTablet && styles.gridItemTablet]}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemOverlay}>
            <View style={styles.ratingBadge}>
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency/12/star.png' }} 
                style={styles.starIconSmall} 
              />
              <Text style={styles.ratingBadgeText}>{item.rating}</Text>
            </View>
            {item.tags.slice(0, 1).map((tag, index) => (
              <View key={index} style={styles.topTag}>
                <Text style={styles.topTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>฿{item.price.toLocaleString()}</Text>
            <Text style={[styles.itemStock, { 
              color: item.stock < 10 ? '#EF4444' : '#10B981' 
            }]}>
              คงเหลือ {item.stock}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>🔍 สำรวจและค้นหา</Text>
            <Text style={styles.headerSubtitle}>ค้นพบสินค้าและบริการใหม่ ๆ</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Image 
              source={{ uri: 'https://img.icons8.com/fluency-systems-filled/20/search.png' }} 
              style={styles.searchIcon} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาสินค้า, หมวดหมู่, หรือแท็ก..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/delete-sign.png' }} 
                  style={styles.clearIcon} 
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.voiceButton}>
                <Image 
                  source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/microphone.png' }} 
                  style={styles.voiceIcon} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>📂 หมวดหมู่</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryCard)}
          </ScrollView>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsCount}>
              พบ {filteredItems.length} รายการ
              {searchQuery && ` จาก "${searchQuery}"`}
            </Text>
            <Text style={styles.resultsSubtext}>
              หมวดหมู่: {categories.find(c => c.id === selectedCategory)?.name}
            </Text>
          </View>
          <View style={styles.viewControls}>
            <TouchableOpacity 
              style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/grid.png' }} 
                style={[styles.viewIcon, { tintColor: viewMode === 'grid' ? '#FFFFFF' : '#64748B' }]} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <Image 
                source={{ uri: 'https://img.icons8.com/fluency-systems-filled/16/menu-2.png' }} 
                style={[styles.viewIcon, { tintColor: viewMode === 'list' ? '#FFFFFF' : '#64748B' }]} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Grid/List */}
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredItems}
            renderItem={renderExploreItem}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? (isTablet ? 3 : 2) : 1}
            key={`${viewMode}-${isTablet ? 3 : 2}`}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => viewMode === 'list' ? <View style={styles.separator} /> : null}
          />
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  // Search Section
  searchSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#3B82F6',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#94A3B8',
  },
  voiceButton: {
    padding: 4,
  },
  voiceIcon: {
    width: 16,
    height: 16,
    tintColor: '#3B82F6',
  },

  // Categories
  categoriesSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  categoriesContainer: {
    paddingBottom: 20,
    paddingRight: 16,
  },
  categoryCard: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Results Header
  resultsHeader: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  resultsInfo: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  resultsSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  viewControls: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  viewButtonActive: {
    backgroundColor: '#3B82F6',
  },
  viewIcon: {
    width: 16,
    height: 16,
  },

  // Results Container
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 32,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  separator: {
    height: 16,
  },

  // Grid Items
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    flex: 1,
    marginHorizontal: 4,
    minWidth: (width - 48) / 2,
  },
  gridItemTablet: {
    minWidth: (width - 80) / 3,
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    left: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  starIconSmall: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topTag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  topTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemCategory: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  itemStock: {
    fontSize: 11,
    fontWeight: '600',
  },

  // List Items
  listItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  listItemContent: {
    flex: 1,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  starIcon: {
    width: 12,
    height: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  listItemCategory: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 6,
  },
  listItemDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  listItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  listItemTags: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '500',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
