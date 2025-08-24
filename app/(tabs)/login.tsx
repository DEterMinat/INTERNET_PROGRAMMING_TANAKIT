import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  return (
    <SidebarLayout>
      <View style={styles.container}>
        <View style={styles.loginCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🎓</Text>
            </View>
            <Text style={styles.title}>ระบบจัดการคลังสินค้า</Text>
            <Text style={styles.subtitle}>ยินดีต้อนรับ</Text>
            <Text style={styles.description}>กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน ของสามารถให้เพื่อใช้งานระบบ</Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Text style={styles.illustrationEmoji}>👥</Text>
              <Text style={styles.illustrationText}>ทีมงานมืออาชีพ</Text>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>เข้าสู่ระบบ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>สมัครสมาชิก</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>ชื่อผู้ใช้</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="กรอกชื่อผู้ใช้"
                  value={formData.username}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>รหัสผ่าน</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="กรอกรหัสผ่าน"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                />
              </View>

              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.rememberContainer}>
                  <View style={styles.checkbox}>
                    {formData.rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>จดจำฉัน</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton}>
                <LinearGradient
                  colors={['#3B82F6', '#1E40AF']}
                  style={styles.loginGradient}
                >
                  <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.orContainer}>
                <Text style={styles.orText}>หรือเข้าสู่ระบบด้วย</Text>
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>Button</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>Button</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialButtonText}>Button</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 60,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#3B82F6',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  illustration: {
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 120,
    marginBottom: 16,
  },
  illustrationText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
    color: '#374151',
  },
  forgotText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  orText: {
    fontSize: 14,
    color: '#6B7280',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});
