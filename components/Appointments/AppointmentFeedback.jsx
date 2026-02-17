import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { apiUrl } from '../Utility/Repeatables';
import { useUserDataState, useToastSate } from '../../atoms/store';

const AppointmentFeedback = ({ appointment, onFeedbackSubmitted }) => {
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setToast({
        visible: true,
        message: 'Please select a rating before submitting',
        type: 'error',
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${apiUrl}/api/v/appointment-features/${appointment._id}/feedback`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${UserData?.authToken}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          visible: true,
          message: 'Feedback submitted successfully',
          type: 'success',
        });

        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error.response?.data || error.message);
      setToast({
        visible: true,
        message:
          (error.response?.data?.errors &&
            error.response?.data?.errors[0]?.msg) ||
          'Failed to submit feedback. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // If feedback has already been submitted, show the existing feedback
  if (appointment.feedback && appointment.feedback.submittedAt) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Your Feedback</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <IconButton
                key={value}
                icon="star"
                size={24}
                iconColor={value <= appointment.feedback.rating ? '#FFC107' : '#E0E0E0'}
                style={styles.starIcon}
                disabled
              />
            ))}
          </View>
          {appointment.feedback.comment && (
            <View style={styles.commentContainer}>
              <Text style={styles.commentLabel}>Your Comment:</Text>
              <Text style={styles.commentText}>{appointment.feedback.comment}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>
          How was your appointment with Dr. {appointment.doctorId?.name}?
        </Text>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => handleRatingPress(value)}
              style={styles.starButton}
            >
              <IconButton
                icon="star"
                size={28}
                iconColor={value <= rating ? '#FFC107' : '#E0E0E0'}
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          label="Additional Comments (Optional)"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          mode="outlined"
          style={styles.commentInput}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || rating === 0}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Submit Feedback
        </Button>
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
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    margin: 0,
  },
  commentInput: {
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  commentContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  commentLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  commentText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#666',
  },
});

export default AppointmentFeedback;
