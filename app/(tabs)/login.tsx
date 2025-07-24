import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    login: '', // Can be username or email
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.login.trim()) {
      Alert.alert('Error', 'Username or email is required');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    const result = await login({
      login: formData.login.trim(),
      password: formData.password
    });
    
    if (result.success) {
      Alert.alert('Login Successful', 'Welcome back!');
      // Reset form
      setFormData({
        login: '',
        password: ''
      });
    } else {
      Alert.alert('Login Failed', result.error || 'Unknown error occurred');
    }
  };

  const handleRegisterRedirect = () => {
    Alert.alert('Navigate to Register', 'This would navigate to register screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>UI</Text>
            </View>
            <Text style={styles.appName}>Design App</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitleText}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username or Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username or email"
              placeholderTextColor="#9CA3AF"
              value={formData.login}
              onChangeText={(text) => handleInputChange('login', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.forgotButton}
            onPress={() => Alert.alert('Forgot Password', 'Password reset link will be sent to your email')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={handleRegisterRedirect}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#c471ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: '#c471ed',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#c471ed',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  socialButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signupLink: {
    color: '#c471ed',
    fontSize: 14,
    fontWeight: '600',
  },
});
