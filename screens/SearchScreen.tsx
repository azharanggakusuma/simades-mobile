import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import type { Theme } from '@react-navigation/native';
import {
  Search,
  X,
  FileText,
  Users,
  Newspaper,
  Frown, // For no results
  Archive, // For initial empty state / no recent searches
} from 'lucide-react-native'; // Import relevant icons

// Define the structure for a searchable item
interface SearchableItem {
  id: string;
  type: 'article' | 'form' | 'user';
  title: string;
  description?: string;
  category?: string; // e.g., "Berita Terkini", "Formulir Internal"
}

// Dummy data source to search from
const DUMMY_DATA_SOURCE: SearchableItem[] = [
  { id: '1', type: 'article', title: 'Panduan Pengisian Formulir Kependudukan', category: 'Artikel Bantuan', description: 'Langkah demi langkah untuk mengisi formulir kependudukan dengan benar.' },
  { id: '2', type: 'form', title: 'Formulir Cuti Tahunan', category: 'Formulir SDM', description: 'Ajukan cuti tahunan Anda melalui formulir ini.' },
  { id: '3', type: 'user', title: 'Ahmad Subarjo', category: 'Pengguna - Staf IT', description: 'ahmad.subarjo@example.com' },
  { id: '4', type: 'article', title: 'Kebijakan Keamanan Data Terbaru', category: 'Pengumuman', description: 'Pembaruan penting terkait kebijakan keamanan data perusahaan.' },
  { id: '5', type: 'form', title: 'Formulir Klaim Reimbursement', category: 'Formulir Keuangan' },
  { id: '6', type: 'user', title: 'Siti Aminah', category: 'Pengguna - Manajer Proyek', description: 'siti.aminah@example.com' },
  { id: '7', type: 'article', title: 'Hasil Rapat Mingguan Tim Operasional', category: 'Notulensi', description: 'Ringkasan poin-poin penting dari rapat terakhir.' },
  { id: '8', type: 'article', title: 'Tips Produktivitas Kerja dari Rumah', category: 'Artikel Pengembangan Diri' },
];

// Helper to get an icon based on item type
const getItemIcon = (type: SearchableItem['type'], color: string, size: number = 20) => {
  switch (type) {
    case 'article': return <Newspaper size={size} color={color} />;
    case 'form': return <FileText size={size} color={color} />;
    case 'user': return <Users size={size} color={color} />;
    default: return <FileText size={size} color={color} />;
  }
};

const SearchScreen = ({ navigation }: any) => { // Replace 'any' with specific navigation prop type
  const { colors, dark: isDarkMode }: Theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // To differentiate initial empty from no results

  // Debounce search to avoid too many re-renders/API calls in a real app
  // For local search, direct filtering is fine but useEffect helps manage 'hasSearched'
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setHasSearched(false); // Reset if query is cleared
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call or heavy computation for local search
    const timer = setTimeout(() => {
      const filteredResults = DUMMY_DATA_SOURCE.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 300); // Simulate a small delay

    return () => clearTimeout(timer); // Cleanup timeout
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    Keyboard.dismiss();
  };

  const handleResultPress = (item: SearchableItem) => {
    console.log('Result pressed:', item);
    // Example navigation:
    // if (item.type === 'article') navigation.navigate('ArticleDetail', { articleId: item.id });
    // else if (item.type === 'form') navigation.navigate('FormDetail', { formId: item.id });
    // else if (item.type === 'user') navigation.navigate('UserProfile', { userId: item.id });
    Alert.alert("Navigasi", `Anda menekan: ${item.title}`);
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    searchHeader: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 12 : 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background, // Input BG slightly different from card BG for depth
      borderRadius: 10,
      paddingHorizontal: 12,
      height: 44, // Standard input height
    },
    searchIcon: {
      marginRight: 10,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: colors.text,
      paddingVertical: 0, // Remove default padding
    },
    clearButton: {
      padding: 4, // Make tap area a bit larger
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    resultsInfoContainer: { // For messages like "X results found" or initial prompt
      paddingVertical: 16,
      alignItems: 'center',
    },
    resultsInfoText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.notification,
    },
    listContentContainer: {
      paddingBottom: 20,
    },
    resultItem: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.primary}20`, // Primary color with low opacity
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    itemTextContainer: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: colors.text,
      marginBottom: 2,
    },
    itemDescription: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: colors.notification,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: - (Platform.OS === 'ios' ? 12 : 16) - 12 - 44, // Adjust for header height
    },
    emptyStateIcon: {
      marginBottom: 20,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateMessage: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: colors.notification,
      textAlign: 'center',
    },
  });

  const renderResultItem = ({ item }: { item: SearchableItem }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)} activeOpacity={0.7}>
      <View style={styles.itemIconContainer}>
        {getItemIcon(item.type, colors.primary)}
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.category && <Text style={styles.itemDescription}>{item.category}</Text>}
      </View>
      <ChevronRight size={20} color={colors.border} />
    </TouchableOpacity>
  );

  const ListHeader = () => {
    if (isLoading || !hasSearched || searchQuery.trim() === '') return null;
    return (
      <View style={styles.resultsInfoContainer}>
        <Text style={styles.resultsInfoText}>
          {searchResults.length > 0
            ? `${searchResults.length} hasil ditemukan untuk "${searchQuery}"`
            : `Tidak ada hasil untuk "${searchQuery}"`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.notification} style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Cari artikel, formulir, pengguna..."
              placeholderTextColor={colors.notification}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true} // Focus on screen load
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()} // Or trigger search explicitly
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <X size={20} color={colors.notification} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isLoading && searchQuery.trim() !== '' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{fontFamily: 'Poppins-Regular', marginTop: 10, color: colors.text}}>Mencari...</Text>
          </View>
        )}

        {!isLoading && !hasSearched && searchQuery.trim() === '' && (
           <View style={styles.emptyStateContainer}>
            <Search size={64} color={colors.border} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>Mulai Mencari</Text>
            <Text style={styles.emptyStateMessage}>Ketik kata kunci untuk menemukan informasi yang Anda butuhkan.</Text>
          </View>
        )}

        {!isLoading && hasSearched && searchResults.length === 0 && searchQuery.trim() !== '' && (
          <View style={styles.emptyStateContainer}>
            <Frown size={64} color={colors.border} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>Tidak Ada Hasil</Text>
            <Text style={styles.emptyStateMessage}>Kami tidak menemukan hasil untuk "{searchQuery}". Coba kata kunci lain.</Text>
          </View>
        )}

        {!isLoading && searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id}
            // ListHeaderComponent={ListHeader} // Can be used to show "X results found"
            contentContainerStyle={styles.listContentContainer}
            keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside input if list is scrollable
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;