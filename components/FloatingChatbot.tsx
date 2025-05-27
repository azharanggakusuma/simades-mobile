import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

// Interface untuk pilihan dalam pesan
interface MessageOption {
  text: string;
  payload: string; // Bisa juga objek jika lebih kompleks
}

// Interface untuk struktur data pesan individual
interface Message {
  id: string;
  text?: string; // Teks bisa opsional jika pesan hanya berisi pilihan
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: MessageOption[];
  optionsDisabled?: boolean; // Untuk menonaktifkan pilihan setelah dipilih
}

// Props yang diterima oleh komponen FloatingChatbot
interface FloatingChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DEBUG_LAYOUT = false;
const debugColors = {
  outer: DEBUG_LAYOUT ? 'rgba(255, 0, 0, 0.05)' : undefined,
  kav: DEBUG_LAYOUT ? 'rgba(0, 255, 0, 0.05)' : undefined,
  window: DEBUG_LAYOUT ? 'rgba(0, 0, 255, 0.05)' : undefined,
};

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const GColors = { // Palet warna global berdasarkan tema
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    primary: theme.colors.primary,
    border: theme.colors.border,
    userBubbleBg: theme.colors.primary,
    userBubbleText: theme.dark ? theme.colors.text : '#FFFFFF',
    botBubbleBg: theme.dark ? '#2D3748' : '#E9ECEF',
    botBubbleText: theme.colors.text,
    inputBackground: theme.dark ? '#1F232A' : '#F8F9FA',
    placeholderText: theme.dark ? '#718096' : '#6C757D',
    headerText: theme.colors.text,
    iconDefault: theme.dark ? '#CBD5E0' : '#495057',
    shadowColor: theme.dark ? '#000000' : '#4A5568',
    optionButtonBg: theme.dark ? '#3A475A' : '#FFFFFF',
    optionButtonText: theme.colors.primary,
    optionButtonBorder: theme.colors.primary,
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // Pesan awal kosong
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, isVisible]);

  // Sapaan bot dengan pilihan setelah pesan pertama pengguna
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'user') {
      const initialBotGreeting: Message = {
        id: `${Date.now().toString()}_bot_greet`,
        text: 'Halo! 👋 Selamat datang. Apa yang bisa kami bantu hari ini?',
        sender: 'bot',
        timestamp: new Date(Date.now() + 50),
        options: [
          { text: 'Tanya Produk', payload: 'PRODUCT_INQUIRY' },
          { text: 'Layanan Pelanggan', payload: 'CUSTOMER_SERVICE' },
          { text: 'Info Lainnya', payload: 'OTHER_INFO' },
        ],
        optionsDisabled: false,
      };
      setMessages(prevMessages => [...prevMessages, initialBotGreeting]);
    }
  }, [messages]);

  if (!isVisible) {
    return null;
  }

  // Fungsi untuk menangani saat pengguna memilih salah satu opsi
  const handleOptionSelect = (option: MessageOption, messageId: string) => {
    // 1. Tambahkan pilihan pengguna sebagai pesan baru
    const userSelectionMessage: Message = {
      id: Date.now().toString(),
      text: option.text, // Tampilkan teks pilihan sebagai pesan pengguna
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => {
      // Nonaktifkan pilihan pada pesan bot yang asli
      const updatedMessages = prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, optionsDisabled: true } : msg
      );
      return [...updatedMessages, userSelectionMessage];
    });

    // 2. Bot merespons berdasarkan payload pilihan
    setTimeout(() => {
      let botResponseText = '';
      let nextOptions: MessageOption[] | undefined = undefined;

      switch (option.payload) {
        case 'PRODUCT_INQUIRY':
          botResponseText = 'Baik, Anda ingin bertanya tentang produk. Produk spesifik apa yang Anda minati?';
          nextOptions = [
            { text: 'Produk A', payload: 'PRODUCT_A_DETAILS' },
            { text: 'Produk B', payload: 'PRODUCT_B_DETAILS' },
            { text: 'Kembali', payload: 'MAIN_MENU' },
          ];
          break;
        case 'CUSTOMER_SERVICE':
          botResponseText = 'Untuk layanan pelanggan, Anda bisa menjelaskan keluhan atau pertanyaan Anda di sini, atau pilih topik di bawah:';
          nextOptions = [
            { text: 'Komplain', payload: 'COMPLAINT' },
            { text: 'Pertanyaan Umum', payload: 'FAQ' },
            { text: 'Kembali', payload: 'MAIN_MENU' },
          ];
          break;
        case 'OTHER_INFO':
          botResponseText = 'Untuk informasi lainnya, silakan ketik pertanyaan Anda.';
          // Tidak ada opsi lanjutan untuk ini, pengguna mengetik
          break;
        case 'PRODUCT_A_DETAILS':
          botResponseText = 'Produk A adalah produk unggulan kami dengan fitur X, Y, Z. Apakah ada pertanyaan lain?';
          nextOptions = [{ text: 'Kembali ke Info Produk', payload: 'PRODUCT_INQUIRY'}];
          break;
        case 'MAIN_MENU':
            botResponseText = 'Ada lagi yang bisa kami bantu?';
            nextOptions = [
                { text: 'Tanya Produk', payload: 'PRODUCT_INQUIRY' },
                { text: 'Layanan Pelanggan', payload: 'CUSTOMER_SERVICE' },
                { text: 'Info Lainnya', payload: 'OTHER_INFO' },
            ];
            break;
        default:
          botResponseText = `Anda memilih: ${option.text}. Kami akan segera memprosesnya.`;
      }

      const botResponse: Message = {
        id: `${Date.now().toString()}_bot_option_response`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        options: nextOptions,
        optionsDisabled: false,
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };


  // Fungsi untuk menangani pengiriman pesan teks dari input
  const handleSendMessage = () => {
    if (message.trim()) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      const isFirstUserMessageOverall = messages.length === 0;
      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      if (!isFirstUserMessageOverall) { // Bot hanya merespons jika bukan pesan pertama (karena sapaan ditangani useEffect)
        setTimeout(() => {
          const botResponse: Message = {
            id: `${Date.now().toString()}_bot_text_response`,
            text: `Anda mengetik: "${message.trim()}". Saya akan coba cari informasinya.`,
            sender: 'bot',
            timestamp: new Date(),
            // Mungkin beri opsi "kembali ke menu utama" setelah respons teks
            options: [{ text: 'Menu Utama', payload: 'MAIN_MENU' }],
            optionsDisabled: false,
          };
          setMessages(prevMessages => [...prevMessages, botResponse]);
        }, 1500);
      }
      setMessage('');
    }
  };

  const KAV_OFFSET = Platform.OS === 'ios' ? 20 : 0; // Coba offset 20 untuk iOS, 0 untuk Android

  return (
    <View style={[styles.outerContainer, { backgroundColor: debugColors.outer }]}>
      <KeyboardAvoidingView
        style={[styles.kavWrapper, { backgroundColor: debugColors.kav }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={KAV_OFFSET}
        enabled
      >
        <View style={[styles.chatWindow, { backgroundColor: GColors.card, shadowColor: GColors.shadowColor, borderColor: GColors.border }, { backgroundColor: debugColors.window || GColors.card }]}>
          <View style={[styles.header, { borderBottomColor: GColors.border }]}>
            <Text style={[styles.headerTitle, { color: GColors.headerText }]}>Bantuan Cepat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeIcon, { color: GColors.iconDefault }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 && (
              <View style={styles.emptyChatContainer}>
                <Text style={[styles.emptyChatMessage, {color: GColors.placeholderText}]}>Ketik pesan untuk memulai...</Text>
              </View>
            )}
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const prevMsg = messages[index - 1];
              const isFirstInBlock = !prevMsg || prevMsg.sender !== msg.sender;
              const isLastInBlock = !messages[index + 1] || messages[index + 1].sender !== msg.sender;

              return (
                <View key={msg.id}>
                  <View style={[ styles.messageRow, isUser ? styles.userMessageRow : styles.botMessageRow ]}>
                    {!isUser && isFirstInBlock && <View style={[styles.botAvatarSmall, {backgroundColor: GColors.primary}]} />}
                    <View
                      style={[
                        styles.messageBubble,
                        isUser
                          ? { backgroundColor: GColors.userBubbleBg, borderTopRightRadius: isFirstInBlock ? 18 : 5, borderBottomRightRadius: isLastInBlock ? 18 : 5 }
                          : { backgroundColor: GColors.botBubbleBg, borderTopLeftRadius: isFirstInBlock ? 18 : 5, borderBottomLeftRadius: isLastInBlock ? 18 : 5 },
                        !isUser && { marginLeft: isFirstInBlock ? 0 : (styles.botAvatarSmall.width + styles.botAvatarSmall.marginRight) },
                      ]}
                    >
                      {msg.text && <Text style={[styles.messageText, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText }]}>{msg.text}</Text>}
                      {isLastInBlock && !msg.options && ( // Tampilkan timestamp jika ini pesan terakhir blok & BUKAN pesan yg masih ada opsi aktif
                          <Text style={[styles.timestamp, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText, opacity: 0.7 }]}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                      )}
                    </View>
                  </View>
                  {/* Render Pilihan jika ada dan belum dinonaktifkan */}
                  {!isUser && msg.options && !msg.optionsDisabled && (
                    <View style={styles.optionsContainer}>
                      {msg.options.map((option, optIndex) => (
                        <TouchableOpacity
                          key={optIndex}
                          style={[styles.optionButton, {borderColor: GColors.optionButtonBorder, backgroundColor: GColors.optionButtonBg}]}
                          onPress={() => handleOptionSelect(option, msg.id)}
                        >
                          <Text style={[styles.optionButtonText, {color: GColors.optionButtonText}]}>{option.text}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={[styles.inputContainer, { borderTopColor: GColors.border, backgroundColor: GColors.background }]}>
            <TextInput
              style={[styles.textInput, { color: GColors.text, backgroundColor: GColors.inputBackground, borderColor: GColors.border }]}
              placeholder="Ketik pesan Anda..."
              placeholderTextColor={GColors.placeholderText}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
              multiline
              maxHeight={120}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: GColors.primary, opacity: !message.trim() ? 0.5 : 1 }]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const CHAT_WINDOW_MARGIN = 16;

interface ChatbotStyle { // Pastikan semua style terdefinisi
  outerContainer: ViewStyle;
  kavWrapper: ViewStyle;
  chatWindow: ViewStyle;
  header: ViewStyle;
  botAvatarSmall: ViewStyle;
  headerTitle: TextStyle;
  closeButton: ViewStyle;
  closeIcon: TextStyle;
  messagesArea: ViewStyle;
  messagesContentContainer: ViewStyle;
  emptyChatContainer: ViewStyle;
  emptyChatMessage: TextStyle;
  messageRow: ViewStyle;
  userMessageRow: ViewStyle;
  botMessageRow: ViewStyle;
  messageBubble: ViewStyle;
  messageText: TextStyle;
  timestamp: TextStyle;
  inputContainer: ViewStyle;
  textInput: ViewStyle & TextStyle;
  sendButton: ViewStyle;
  sendButtonIcon: TextStyle;
  optionsContainer: ViewStyle; // Style untuk kontainer pilihan
  optionButton: ViewStyle;     // Style untuk tombol pilihan
  optionButtonText: TextStyle; // Style untuk teks tombol pilihan
}

const styles = StyleSheet.create<ChatbotStyle>({
  outerContainer: {
    position: 'absolute',
    right: CHAT_WINDOW_MARGIN,
    bottom: CHAT_WINDOW_MARGIN,
    left: Platform.OS === 'web' ? undefined : CHAT_WINDOW_MARGIN,
    width: Platform.OS === 'web' ? 390 : undefined, // Sedikit lebih lebar untuk web
    maxWidth: 450, // Max width
    zIndex: 1000,
  },
  kavWrapper: {},
  chatWindow: {
    width: '100%',
    minHeight: 400, // Menaikkan tinggi minimal
    // 1. Membuat window lebih tinggi lagi
    maxHeight: screenHeight * (Platform.OS === 'web' ? 0.9 : 0.9), // Lebih tinggi, 90% tinggi layar
    borderRadius: 22, // Lebih bulat
    backgroundColor: 'white',
    borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: Platform.OS === 'android' ? 14 : 0, // Shadow lebih tegas
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, // Padding header lebih
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  botAvatarSmall: {
    width: 30, // Avatar sedikit lebih kecil
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 19, // Judul lebih besar
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    textAlign: 'left',
  },
  closeButton: {
    padding: 10, // Area tap lebih besar
    marginLeft: 12,
  },
  closeIcon: {
    fontSize: 25,
    fontFamily: 'Poppins-Regular',
  },
  messagesArea: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 12, // Kurangi padding horizontal agar bubble bisa lebih lebar
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyChatMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.7,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4, // Jarak antar baris pesan
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingVertical: 12, // Padding bubble lebih
    paddingHorizontal: 18,
    borderRadius: 22, // Bubble lebih bulat
    maxWidth: '82%', // Bubble bisa sedikit lebih lebar
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16, // Teks pesan lebih besar
    fontFamily: 'Poppins-Regular',
    lineHeight: 23,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 7,
    textAlign: 'right',
    opacity: 0.6,
  },
  // Styling untuk Pilihan Tombol
  optionsContainer: {
    flexDirection: 'row', // Susun pilihan secara horizontal
    flexWrap: 'wrap',    // Bungkus ke baris baru jika tidak muat
    justifyContent: 'flex-start', // Mulai dari kiri (untuk bot)
    marginTop: 8,
    marginLeft: 40, // Indentasi agar sejajar dengan bubble bot (jika ada avatar)
    marginBottom: 4,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.2,
    marginRight: 8,
    marginBottom: 8,
    // backgroundColor dan borderColor diatur dari GColors
  },
  optionButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    // color diatur dari GColors
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Padding lebih
    paddingHorizontal: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 28, // Input lebih bulat
    paddingHorizontal: 20, // Padding input lebih
    paddingTop: Platform.OS === 'ios' ? 14 : 11,
    paddingBottom: Platform.OS === 'ios' ? 14 : 11,
    marginRight: 12,
    fontSize: 16.5, // Font input lebih besar
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 50, // Tombol kirim lebih besar
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonIcon: {
    color: '#FFFFFF',
    fontSize: 22, // Ikon lebih besar
    fontFamily: 'Poppins-Medium',
  },
});

export default FloatingChatbot;