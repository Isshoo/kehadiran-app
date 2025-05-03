import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Text } from 'react-native-paper';

const CourseListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'CS101',
      name: 'Pemrograman Dasar',
      credits: 3,
      lecturer: 'Dr. John Doe',
      class: 'A',
    },
    {
      id: 2,
      code: 'CS102',
      name: 'Struktur Data',
      credits: 3,
      lecturer: 'Dr. Jane Smith',
      class: 'B',
    },
  ]);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourseItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Kode: {item.code}</Paragraph>
        <Paragraph>SKS: {item.credits}</Paragraph>
        <Paragraph>Dosen: {item.lecturer}</Paragraph>
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
        placeholder="Cari mata kuliah..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
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

export default CourseListScreen; 