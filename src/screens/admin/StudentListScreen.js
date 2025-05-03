import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Text } from 'react-native-paper';

const StudentListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      nim: '12345678',
      email: 'john@example.com',
      class: 'A',
    },
    {
      id: 2,
      name: 'Jane Smith',
      nim: '87654321',
      email: 'jane@example.com',
      class: 'B',
    },
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nim.includes(searchQuery)
  );

  const renderStudentItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>NIM: {item.nim}</Paragraph>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Kelas: {item.class}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={() => {}}>
          Edit
        </Button>
        <Button mode="contained" onPress={() => {}}>
          Detail
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Cari mahasiswa..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default StudentListScreen; 