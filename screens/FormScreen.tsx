import { Text, View } from 'react-native';
import React from 'react';
import ScreenContainer from '../components/ScreenContainer';

export default function FormScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-blue-600">Form</Text>
      </View>
    </ScreenContainer>
  );
}
