import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Text, FAB, ActivityIndicator, Divider, Portal, Modal, TextInput, Checkbox } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tab Screens
const MeetingsTab = ({ classData, course }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    if (classData && course) {
      fetchMeetings();
    }
  }, [classData, course]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get(`/meetings/by-class/${classData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(response.data.meetings || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch meetings');
      showMessage({
        message: 'Error',
        description: err.message || 'Failed to load meetings',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeeting = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.post(
        '/meetings/create',
        {
          class_id: classData.id,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage({
        message: 'Success',
        description: 'Pertemuan berhasil ditambahkan',
        type: 'success',
      });

      setVisible(false);
      fetchMeetings();
    } catch (err) {
      showMessage({
        message: 'Error',
        description: err.message || 'Gagal menambahkan pertemuan',
        type: 'danger',
      });
    }
  };

  const renderMeetingItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('MeetingDetail', { meeting: item, class: classData, course })}>
      <Card.Content>
        <Title>Pertemuan {item.meeting_number}</Title>
        <Paragraph>Tanggal: {item.date}</Paragraph>
        <Paragraph>Waktu: {item.start_time} - {item.end_time}</Paragraph>
        <Paragraph>Jumlah Hadir: {item.attendance_count || 0}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchMeetings}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meetings}
        renderItem={renderMeetingItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setVisible(true)}
        label="Tambah Pertemuan"
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Tambah Pertemuan</Text>
          <TextInput
            label="Tanggal"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            label="Jam Mulai"
            value={formData.start_time}
            onChangeText={(text) => setFormData({ ...formData, start_time: text })}
            style={styles.input}
            placeholder="HH:MM"
          />
          <TextInput
            label="Jam Selesai"
            value={formData.end_time}
            onChangeText={(text) => setFormData({ ...formData, end_time: text })}
            style={styles.input}
            placeholder="HH:MM"
          />
          <Button mode="contained" onPress={handleAddMeeting} style={styles.modalButton}>
            Tambah
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const StudentsTab = ({ classData, course }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (classData && course) {
      fetchStudents();
    }
  }, [classData, course]);

  useEffect(() => {
    if (classData && course) {
      fetchAllStudents();
    }
  }, [classData, course, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get(`/class-students/by-class/${classData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.students || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      showMessage({
        message: 'Error',
        description: err.message || 'Failed to load students',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter out students who are already in the class
      const registeredStudentIds = students.map(student => student.id);
      const availableStudents = (response.data.users || []).filter(
        student => !registeredStudentIds.includes(student.id)
      );
      
      setAllStudents(availableStudents);
    } catch (err) {
      showMessage({
        message: 'Error',
        description: err.message || 'Failed to load all students',
        type: 'danger',
      });
    }
  };

  const handleAddStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await api.post(
        `/class-students/add`,
        { 
          class_id: classData.id,
          student_ids: selectedStudents 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage({
        message: 'Success',
        description: 'Mahasiswa berhasil ditambahkan',
        type: 'success',
      });

      setVisible(false);
      setSelectedStudents([]);
      fetchStudents();
    } catch (err) {
      showMessage({
        message: 'Error',
        description: err.message || 'Gagal menambahkan mahasiswa',
        type: 'danger',
      });
    }
  };

  const renderStudentItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>NIM: {item.nim}</Paragraph>
        <Paragraph>Email: {item.email}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchStudents}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setVisible(true)}
        label="Tambah Mahasiswa"
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Tambah Mahasiswa</Text>
          <FlatList
            data={allStudents}
            renderItem={({ item }) => (
              <View style={styles.checkboxItem}>
                <Checkbox
                  status={selectedStudents.includes(item.id) ? 'checked' : 'unchecked'}
                  onPress={() => {
                    if (selectedStudents.includes(item.id)) {
                      setSelectedStudents(selectedStudents.filter(id => id !== item.id));
                    } else {
                      setSelectedStudents([...selectedStudents, item.id]);
                    }
                  }}
                />
                <Text>{item.name} ({item.nim})</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <Button mode="contained" onPress={handleAddStudents} style={styles.modalButton}>
            Tambah
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

const ClassDetailScreen = () => {
  const route = useRoute();
  const { class: classData, course } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classData && course) {
      setLoading(false);
    }
  }, [classData, course]);

  if (loading || !classData || !course) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>{course.name}</Title>
          <Paragraph>Kelas {classData.name}</Paragraph>
        </Card.Content>
      </Card>

      <Tab.Navigator>
        <Tab.Screen 
          name="Meetings" 
          children={() => <MeetingsTab classData={classData} course={course} />}
          options={{ title: 'Pertemuan' }}
        />
        <Tab.Screen 
          name="Students" 
          children={() => <StudentsTab classData={classData} course={course} />}
          options={{ title: 'Mahasiswa' }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default ClassDetailScreen; 