import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const OnBoardingLayout = () => {
  return (
    <Stack>
        <Stack.Screen
            name='onboarding'
            options={{
                headerShown:false
            }}
        />
    </Stack>
  )
}

export default OnBoardingLayout