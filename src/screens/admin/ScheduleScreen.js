import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Text, SegmentedButtons, TextInput } from 'react-native-paper';

const ScheduleScreen = () => {
  const [semester, setSemester] = useState('ganjil');
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());

  const schedules = [
    {
      id: 1,
      course: 'Pemrograman Dasar',
      class: 'A',
      day: 'Senin',
      time: '08:00 - 10:00',
      room: 'Lab. Komputer 1',
    },
    {
      id: 2,
      course: 'Struktur Data',
      class: 'B',
      day: 'Selasa',
      time: '10:00 - 12:00',
      room: 'Lab. Komputer 2',
    },
  ];

  const renderScheduleItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.course}</Title>
        <Paragraph>Kelas: {item.class}</Paragraph>
        <Paragraph>Hari: {item.day}</Paragraph>
        <Paragraph>Waktu: {item.time}</Paragraph>
        <Paragraph>Ruangan: {item.room}</Paragraph>
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
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Semester</Text>
        <SegmentedButtons
          value={semester}
          onValueChange={setSemester}
          buttons={[
            { value: 'ganjil', label: 'Ganjil' },
            { value: 'genap', label: 'Genap' },
          ]}
          style={styles.segmentedButtons}
        />
        <Text style={styles.filterLabel}>Tahun Akademik</Text>
        <TextInput
          label="Tahun Akademik"
          value={academicYear}
          onChangeText={setAcademicYear}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
        />
      </View>

      <FlatList
        data={schedules}
        renderItem={renderScheduleItem}
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
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default ScheduleScreen; 