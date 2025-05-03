import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const quickActions = [
    {
      title: 'Buat Pertemuan',
      icon: 'plus-circle',
      onPress: () => navigation.navigate('CreateMeeting'),
    },
    {
      title: 'Scan Kehadiran',
      icon: 'hand-pointing-right',
      onPress: () => navigation.navigate('HandScan'),
    },
    {
      title: 'Export Data',
      icon: 'file-export',
      onPress: () => navigation.navigate('ExportAttendance'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title>Selamat Datang, Admin!</Title>
          <Paragraph>Anda dapat mengelola kehadiran mahasiswa melalui aplikasi ini.</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <Card
            key={index}
            style={styles.actionCard}
            onPress={action.onPress}
          >
            <Card.Content style={styles.actionContent}>
              <Button
                icon={action.icon}
                mode="contained"
                style={styles.actionButton}
                onPress={action.onPress}
              >
                {action.title}
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Statistik Hari Ini</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statValue}>0</Paragraph>
              <Paragraph style={styles.statLabel}>Pertemuan Aktif</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statValue}>0</Paragraph>
              <Paragraph style={styles.statLabel}>Mahasiswa Hadir</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    width: '48%',
    marginBottom: 16,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
});

export default DashboardScreen; 