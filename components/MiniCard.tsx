import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MiniCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const MiniCard = ({ title, value, icon, color }: MiniCardProps) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}1A` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
};

export default MiniCard;

interface Style {
  card: ViewStyle;
  iconBox: ViewStyle;
  textWrapper: ViewStyle;
  cardTitle: TextStyle;
  cardValue: TextStyle;
}

const CARD_WIDTH = (Dimensions.get('window').width - 60) / 2;

const styles = StyleSheet.create<Style>({
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    columnGap: 12,
  },
  iconBox: {
    padding: 10,
    borderRadius: 10,
  },
  textWrapper: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
    flexShrink: 1,
    fontFamily: 'Poppins-Regular', 
  },
  cardValue: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Poppins-SemiBold',
  },
});
