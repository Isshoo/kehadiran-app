import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CreateMeetingScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    courseName: '',
    class: '',
    date: '',
    startTime: '',
    endTime: '',
    room: '',
    totalStudents: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName) newErrors.courseName = 'Mata kuliah harus diisi';
    if (!formData.class) newErrors.class = 'Kelas harus diisi';
    if (!formData.date) newErrors.date = 'Tanggal harus diisi';
    if (!formData.startTime) newErrors.startTime = 'Waktu mulai harus diisi';
    if (!formData.endTime) newErrors.endTime = 'Waktu selesai harus diisi';
    if (!formData.room) newErrors.room = 'Ruangan harus diisi';
    if (!formData.totalStudents) newErrors.totalStudents = 'Jumlah mahasiswa harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: Replace with actual API call
      const newMeeting = {
        id: Date.now(),
        ...formData,
        totalStudents: parseInt(formData.totalStudents),
        presentStudents: 0,
      };
      
      // Navigate back to meeting list
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Mata Kuliah"
          value={formData.courseName}
          onChangeText={text => setFormData({ ...formData, courseName: text })}
          error={!!errors.courseName}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.courseName}>
          {errors.courseName}
        </HelperText>

        <TextInput
          label="Kelas"
          value={formData.class}
          onChangeText={text => setFormData({ ...formData, class: text })}
          error={!!errors.class}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.class}>
          {errors.class}
        </HelperText>

        <TextInput
          label="Tanggal"
          value={formData.date}
          onChangeText={text => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
          error={!!errors.date}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.date}>
          {errors.date}
        </HelperText>

        <TextInput
          label="Waktu Mulai"
          value={formData.startTime}
          onChangeText={text => setFormData({ ...formData, startTime: text })}
          placeholder="HH:MM"
          error={!!errors.startTime}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.startTime}>
          {errors.startTime}
        </HelperText>

        <TextInput
          label="Waktu Selesai"
          value={formData.endTime}
          onChangeText={text => setFormData({ ...formData, endTime: text })}
          placeholder="HH:MM"
          error={!!errors.endTime}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.endTime}>
          {errors.endTime}
        </HelperText>

        <TextInput
          label="Ruangan"
          value={formData.room}
          onChangeText={text => setFormData({ ...formData, room: text })}
          error={!!errors.room}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.room}>
          {errors.room}
        </HelperText>

        <TextInput
          label="Jumlah Mahasiswa"
          value={formData.totalStudents}
          onChangeText={text => setFormData({ ...formData, totalStudents: text })}
          keyboardType="numeric"
          error={!!errors.totalStudents}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.totalStudents}>
          {errors.totalStudents}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Buat Pertemuan
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
});

export default CreateMeetingScreen;