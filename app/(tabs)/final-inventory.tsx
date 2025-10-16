import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import SidebarLayout from '../../components/SidebarLayout';
import { apiService } from '../../services/apiService';

export default function FinalInventoryScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImg, setNewImg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res: any = await apiService.finalInventory.getList();
      if (res.success) {
        setItems(res.data || []);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load final inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addItem = async () => {
    if (!newName) return Alert.alert('Validation', 'Name required');
    try {
      const qty = parseInt(newQty) || 0;
      const price = parseFloat(newPrice) || 0;
      const res: any = await apiService.finalInventory.create({ name: newName, qty, price, img: newImg });
      if (res.success) {
        Alert.alert('Added');
        setNewName(''); setNewQty(''); setNewPrice(''); setNewImg('');
        load();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add');
    }
  };

  return (
    <SidebarLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Final Exam Inventory (Prefix 6630202261)</Text>
        <FlatList data={items} keyExtractor={(i) => String(i.id)} renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Qty: {item.qty}</Text>
            <Text>Price: {item.price}</Text>
          </View>
        )} />

        <View style={styles.form}>
          <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
          <TextInput placeholder="Qty" value={newQty} onChangeText={setNewQty} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Price" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Image URL" value={newImg} onChangeText={setNewImg} style={styles.input} />
          <TouchableOpacity style={styles.button} onPress={addItem}><Text style={styles.buttonText}>Add</Text></TouchableOpacity>
        </View>
      </View>
    </SidebarLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  item: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: '500' },
  form: { marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8, borderRadius: 6 },
  button: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});