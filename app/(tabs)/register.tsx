import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';

export default function Register() {
  return (
    <SidebarLayout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.registerCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>จัดการสมาชิกผู้ใช้งาน</Text>
            <TouchableOpacity style={styles.addUserButton}>
              <Text style={styles.addUserButtonText}>เพิ่มผู้ใช้ใหม่</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={styles.activeTabText}>ผู้ใช้งานระบบ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>ผู้แสดงระบบ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>พนักงานอื่นๆ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>พนักงานภายใน</Text>
            </TouchableOpacity>
          </View>

          {/* User Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableTitle}>จัดการสมาชิกผู้ใช้งาน</Text>
              <View style={styles.tableControls}>
                <TouchableOpacity style={styles.searchButton}>
                  <Text style={styles.searchButtonText}>ค้นหาผู้ใช้...</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.showItemsButton}>
                  <Text style={styles.showItemsText}>แสดง: 10 รายการ</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderText, { flex: 0.3 }]}>ชื่อผู้ใช้</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.4 }]}>อีเมล</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>บทบาท</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>สถานะ</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.2 }]}>วันที่เข้าร่วม</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.3 }]}>จัดการ</Text>
              </View>

              {/* Sample Data */}
              {[
                { name: 'ธนกิต โชคโสม', email: 'somchai@warehouse.co.th', role: 'ผู้แสดงระบบ', status: 'ใช้งาน', date: '22/06/2023' },
                { name: 'วิภา วรรณา', email: 'wipa@warehouse.co.th', role: 'พนักงานระดับ', status: 'ใช้งาน', date: '10/07/2023' },
                { name: 'มานะ ชูชีพ', email: 'mana@warehouse.co.th', role: 'พนักงานระดับ', status: 'ใช้งาน', date: '05/03/2023' },
                { name: 'สุดา บัวผัด', email: 'suda@warehouse.co.th', role: 'พนักงานระดับ', status: 'รอยืนยัน', date: '18/01/2023' },
                { name: 'ประสิทธิ์ คำราม', email: 'prasit@warehouse.co.th', role: 'ผู้แสดงระบบ', status: 'ใช้งาน', date: '25/02/2023' }
              ].map((user, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 0.3 }]}>{user.name}</Text>
                  <Text style={[styles.tableCell, { flex: 0.4 }]}>{user.email}</Text>
                  <Text style={[styles.tableCell, { flex: 0.2 }]}>{user.role}</Text>
                  <View style={[styles.tableCell, { flex: 0.2 }]}>
                    <View style={[styles.statusBadge, {
                      backgroundColor: user.status === 'ใช้งาน' ? '#DCFCE7' : '#FEF3C7'
                    }]}>
                      <Text style={[styles.statusText, {
                        color: user.status === 'ใช้งาน' ? '#16A34A' : '#D97706'
                      }]}>
                        {user.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.tableCell, { flex: 0.2 }]}>{user.date}</Text>
                  <View style={[styles.tableCell, { flex: 0.3 }]}>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>แก้ไข</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>ลบ</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Pagination */}
            <View style={styles.pagination}>
              <Text style={styles.paginationText}>แสดง 1-5 จาก 24 รายการ</Text>
              <View style={styles.paginationButtons}>
                <TouchableOpacity style={styles.pageButton}>
                  <Text style={styles.pageButtonText}>หน้าแรก</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pageButton, styles.activePageButton]}>
                  <Text style={styles.activePageButtonText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageButton}>
                  <Text style={styles.pageButtonText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageButton}>
                  <Text style={styles.pageButtonText}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageButton}>
                  <Text style={styles.pageButtonText}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageButton}>
                  <Text style={styles.pageButtonText}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageButton}>
                  <Text style={styles.pageButtonText}>ถัดไป</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Permission Management */}
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionTitle}>จัดการสมนุญามให้ใช่</Text>
            
            <View style={styles.permissionSections}>
              {/* Permissions Column 1 */}
              <View style={styles.permissionColumn}>
                <Text style={styles.permissionColumnTitle}>ผู้แสดงระบบ</Text>
                <Text style={styles.permissionDescription}>สามารถทำงานสัมพันธ์ได้ทุก จัดการผู้ใช้และกำหนดสิทธิ์การใช้งาน</Text>
                <View style={styles.permissionList}>
                  {[
                    'จัดการผู้ใช้',
                    'จัดการสินค้า', 
                    'ดูรายงาน',
                    'ตั้งค่าระบบ'
                  ].map((perm, index) => (
                    <View key={index} style={styles.permissionItem}>
                      <View style={styles.permissionCheckbox}>
                        <Text style={styles.permissionCheck}>✓</Text>
                      </View>
                      <Text style={styles.permissionText}>{perm}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.permissionButton}>
                  <Text style={styles.permissionButtonText}>บันทึกการเปลี่ยนแปลง</Text>
                </TouchableOpacity>
              </View>

              {/* Permissions Column 2 */}
              <View style={styles.permissionColumn}>
                <Text style={styles.permissionColumnTitle}>พนักงานระบบ</Text>
                <Text style={styles.permissionDescription}>สามารถจัดการสินค้า ดูรายงานเบื้องต้น และทำงานประจำวันได้</Text>
                <View style={styles.permissionList}>
                  {[
                    'จัดการสินค้า',
                    'จัดการสินค้า',
                    'ดูรายงาน',
                    'ตั้งค่าระบบ'
                  ].map((perm, index) => (
                    <View key={index} style={styles.permissionItem}>
                      <View style={styles.permissionCheckbox}>
                        <Text style={styles.permissionCheck}>✓</Text>
                      </View>
                      <Text style={styles.permissionText}>{perm}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.permissionButton}>
                  <Text style={styles.permissionButtonText}>บันทึกการเปลี่ยนแปลง</Text>
                </TouchableOpacity>
              </View>

              {/* Permissions Column 3 */}
              <View style={styles.permissionColumn}>
                <Text style={styles.permissionColumnTitle}>พนักงานเพื่มเติม</Text>
                <Text style={styles.permissionDescription}>สามารถดำเนินงานตามที่กำหนด ดูข้อมูลเบื้องต้น และปฏิบัติงานประจำ</Text>
                <View style={styles.permissionList}>
                  <View style={styles.permissionItem}>
                    <View style={styles.permissionCheckbox}>
                      <Text style={styles.permissionCheck}>✓</Text>
                    </View>
                    <Text style={styles.permissionText}>จัดการผู้ใช้</Text>
                  </View>
                  <View style={styles.permissionItem}>
                    <View style={styles.permissionCheckbox}>
                      <Text style={styles.permissionCheck}>✓</Text>
                    </View>
                    <Text style={styles.permissionText}>จัดการสินค้า</Text>
                  </View>
                  <View style={styles.permissionItem}>
                    <View style={styles.permissionCheckbox}>
                      <Text style={styles.permissionCheck}>✓</Text>
                    </View>
                    <Text style={styles.permissionText}>ดูรายงาน</Text>
                  </View>
                  <View style={styles.permissionItem}>
                    <View style={styles.permissionCheckbox}>
                      <Text style={styles.permissionCheck}>✓</Text>
                    </View>
                    <Text style={styles.permissionText}>ตั้งค่าระบบ</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.permissionButton}>
                  <Text style={styles.permissionButtonText}>บันทึกการเปลี่ยนแปลงใหม่</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomActions}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>กลับไปหน้าแรกของเรา</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>บันทึกการทำงานใหม่</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  registerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addUserButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addUserButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tableControls: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  showItemsButton: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  showItemsText: {
    fontSize: 14,
    color: '#374151',
  },
  table: {
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#1F2937',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paginationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  activePageButton: {
    backgroundColor: '#3B82F6',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activePageButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  permissionContainer: {
    backgroundColor: '#FFFFFF',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  permissionSections: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  permissionColumn: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  permissionColumnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  permissionList: {
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionCheckbox: {
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  permissionCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 14,
    color: '#374151',
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
