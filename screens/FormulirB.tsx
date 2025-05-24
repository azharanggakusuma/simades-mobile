import React from 'react';
import { Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

export default function FormulirBScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-900">Formulir B</Text>
      </View>
    </ScreenContainer>
  );
}
