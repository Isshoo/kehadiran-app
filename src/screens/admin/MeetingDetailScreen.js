import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, IconButton, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateAttendanceStart, updateAttendanceSuccess, updateAttendanceFailure } from '../../store/slices/meetingSlice';

const MeetingDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.meeting);
  const { meeting } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - In a real app, this would come from the API
  const [attendanceList, setAttendanceList] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      nim: '1234567890',
      timeIn: null,
      timeOut: null,
      status: 'Belum Hadir',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      nim: '0987654321',
      timeIn: '08:00',
      timeOut: null,
      status: 'Hadir',
    },
  ]);

  const handleScan = (studentId, scanType) => {
    navigation.navigate('HandScan', {
      scanType,
      onScanComplete: (time) => {
        dispatch(updateAttendanceStart());
        try {
          // TODO: Replace with actual API call
          const newStatus = scanType === 'in' ? 'Hadir' : 'Selesai';

          dispatch(updateAttendanceSuccess({
            meetingId: meeting.id,
            studentId,
            timeIn: scanType === 'in' ? time : null,
            timeOut: scanType === 'out' ? time : null,
            status: newStatus,
          }));

          setAttendanceList(prevList =>
            prevList.map(item =>
              item.id === studentId
                ? {
                    ...item,
                    [scanType === 'in' ? 'timeIn' : 'timeOut']: time,
                    status: newStatus,
                  }
                : item
            )
          );
        } catch (err) {
          dispatch(updateAttendanceFailure(err.message));
        }
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'hadir':
        return '#4CAF50';
      case 'selesai':
        return '#2196F3';
      case 'belum hadir':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const renderAttendanceItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.nim}>NIM: {item.nim}</Text>
          </View>
          <Chip
            textStyle={{ color: 'white' }}
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Text>Masuk:</Text>
            {item.timeIn ? (
              <Text style={styles.timeText}>{item.timeIn}</Text>
            ) : (
              <IconButton
                icon="camera"
                size={24}
                onPress={() => handleScan(item.id, 'in')}
                disabled={loading}
              />
            )}
          </View>

          <View style={styles.timeItem}>
            <Text>Keluar:</Text>
            {item.timeOut ? (
              <Text style={styles.timeText}>{item.timeOut}</Text>
            ) : item.timeIn ? (
              <IconButton
                icon="camera"
                size={24}
                onPress={() => handleScan(item.id, 'out')}
                disabled={loading}
              />
            ) : (
              <Text style={styles.timeText}>-</Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{meeting.courseName}</Text>
        <Text style={styles.subtitle}>
          Kelas {meeting.class} - {meeting.date}
        </Text>
        <Text style={styles.time}>
          {meeting.startTime} - {meeting.endTime}
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ExportAttendance', { meeting })}
          style={styles.exportButton}
          icon="file-export"
        >
          Export Data
        </Button>
      </View>

      <FlatList
        data={attendanceList}
        renderItem={renderAttendanceItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  exportButton: {
    marginTop: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nim: {
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
  },
});

export default MeetingDetailScreen; 