import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Navbar({ onMenuPress, onProfilePress, isSidebarOpen }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 10 }}
      className="bg-white flex-row items-center px-4 pb-3 border-b border-[#e5e7eb] justify-between"
    >
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons
          name={isSidebarOpen ? 'close' : 'menu'}
          size={26}
          color="#111827"
        />
      </TouchableOpacity>

      <Text className="text-[18px] font-semibold text-[#111827]">SIMADES</Text>

      <View className="flex-row space-x-[12px]">
        <TouchableOpacity onPress={onProfilePress} className="p-1">
          <Ionicons name="person-circle-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
