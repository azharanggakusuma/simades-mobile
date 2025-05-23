import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

interface MiniCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

const MiniCard = ({ title, value, icon: Icon, color }: MiniCardProps) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}1A` }]}>
        <Icon color={color} size={22} />
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
