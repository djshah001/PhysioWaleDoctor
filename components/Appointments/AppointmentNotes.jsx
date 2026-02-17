import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { apiUrl } from '../Utility/Repeatables';
import { useUserDataState, useToastSate } from '../../atoms/store';

const AppointmentNotes = ({ appointment, onNotesUpdated }) => {
  const [UserData] = useUserDataState();
  const [, setToast] = useToastSate();
  const [notes, setNotes] = useState(appointment.userNotes || '');
  const [editing, setEditing] = useState(!appointment.userNotes);
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        `${apiUrl}/api/v/appointment-features/${appointment._id}/notes`,
        {
          userNotes: notes,
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
          message: 'Notes saved successfully',
          type: 'success',
        });

        setEditing(false);

        if (onNotesUpdated) {
          onNotesUpdated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error saving notes:', error.response?.data || error.message);
      setToast({
        visible: true,
        message:
          (error.response?.data?.errors &&
            error.response?.data?.errors[0]?.msg) ||
          'Failed to save notes. Please try again.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Personal Notes</Text>
          {!editing && (
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => setEditing(true)}
              style={styles.editButton}
            />
          )}
        </View>

        {editing ? (
          <>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              mode="outlined"
              placeholder="Add your personal notes about this appointment..."
              style={styles.notesInput}
            />

            <View style={styles.buttonRow}>
              {appointment.userNotes && (
                <Button
                  mode="outlined"
                  onPress={() => {
                    setNotes(appointment.userNotes);
                    setEditing(false);
                  }}
                  style={styles.cancelButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  Cancel
                </Button>
              )}

              <Button
                mode="contained"
                onPress={handleSaveNotes}
                loading={saving}
                disabled={saving || !notes.trim()}
                style={[
                  styles.saveButton,
                  appointment.userNotes ? { flex: 1 } : { width: '100%' },
                ]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Save Notes
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.notesContainer}>
            {appointment.userNotes ? (
              <Text style={styles.notesText}>{appointment.userNotes}</Text>
            ) : (
              <Text style={styles.emptyNotesText}>No personal notes added yet.</Text>
            )}
          </View>
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
    marginBottom: 12,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#333',
  },
  editButton: {
    margin: 0,
  },
  notesInput: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#4A90E2',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
  },
  notesContainer: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    minHeight: 80,
  },
  notesText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#333',
  },
  emptyNotesText: {
    fontFamily: 'OpenSans-Italic',
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default AppointmentNotes;
