import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, IconButton, Badge, Divider } from 'react-native-paper';
import axios from 'axios';
import { apiUrl } from '../Utility/Repeatables';
import { useUserDataState, useToastSate } from '../../atoms/store';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { Image } from 'expo-image';

const AppointmentReminders = () => {
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/v/appointment-features/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      if (response.data.success) {
        setUpcomingAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error.response?.data || error.message);
      setToast({
        visible: true,
        message: 'Failed to fetch upcoming appointments. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEE, MMM d');
    }
  };

  const getTimeUntilAppointment = (dateString, timeString) => {
    const date = new Date(dateString);
    const [hours, minutesPeriod] = timeString.split(':');
    const [minutes, period] = minutesPeriod.split(' ');

    let hour = parseInt(hours);
    const minute = parseInt(minutes);

    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hour < 12) {
      hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0;
    }

    // Create a date object with the appointment date and time
    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hour, minute, 0, 0);

    // Calculate the difference in milliseconds
    const now = new Date();
    const diffMs = appointmentDateTime - now;

    // Convert to days, hours, minutes
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return 'Now';
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const formattedDate = formatAppointmentDate(appointmentDate);
    const timeUntil = getTimeUntilAppointment(item.date, item.time);

    return (
      <TouchableOpacity
        style={styles.appointmentItem}
        onPress={() => {
          // Navigate to appointment details
        }}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
          <View style={styles.timeUntilContainer}>
            <IconButton
              icon="clock-outline"
              size={14}
              style={styles.clockIcon}
            />
            <Text style={styles.timeUntilText}>{timeUntil}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.clinicRow}>
            <Image
              source={{ uri: item.clinicId?.images?.[0] }}
              style={styles.clinicImage}
              contentFit="cover"
            />
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName} numberOfLines={1}>
                {item.clinicId?.name}
              </Text>
              <Text style={styles.doctorName} numberOfLines={1}>
                Dr. {item.doctorId?.name}
              </Text>
            </View>
          </View>

          <View style={styles.serviceContainer}>
            <Text style={styles.serviceText}>{item.serviceId?.name}</Text>
            <Text style={styles.durationText}>{item.serviceId?.duration} min</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Upcoming Appointments</Text>
          <Badge style={styles.countBadge}>{upcomingAppointments.length}</Badge>
        </View>

        {upcomingAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconButton
              icon="calendar-check"
              size={40}
              iconColor="#CCCCCC"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No upcoming appointments</Text>
          </View>
        ) : (
          <FlatList
            data={upcomingAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#4A90E2',
    color: 'white',
    fontFamily: 'OpenSans-Bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyIcon: {
    margin: 0,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#999',
  },
  listContent: {
    paddingBottom: 8,
  },
  appointmentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  timeContainer: {
    width: 80,
    marginRight: 12,
  },
  dateText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#4A90E2',
  },
  timeText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  timeUntilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  clockIcon: {
    margin: 0,
    padding: 0,
    width: 16,
    height: 16,
  },
  timeUntilText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#666',
  },
  detailsContainer: {
    flex: 1,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinicImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#333',
  },
  doctorName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  serviceContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#333',
  },
  durationText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#4A90E2',
  },
  divider: {
    marginVertical: 8,
  },
});

export default AppointmentReminders;
