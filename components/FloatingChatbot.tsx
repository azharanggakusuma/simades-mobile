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
  // LayoutAnimation, // Jika ingin animasi lebih lanjut, bisa diaktifkan
  // UIManager, // Untuk LayoutAnimation di Android
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Send, X as IconX } from 'lucide-react-native'; // Menambahkan ikon Send dan X

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// Interface untuk pilihan dalam pesan
interface MessageOption {
  text: string;
  payload: string;
}

// Interface untuk struktur data pesan individual
interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: MessageOption[];
  optionsDisabled?: boolean;
}

// Props yang diterima oleh komponen FloatingChatbot
interface FloatingChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// const DEBUG_LAYOUT = false;
// const debugColors = {
//   outer: DEBUG_LAYOUT ? 'rgba(255, 0, 0, 0.05)' : undefined,
//   kav: DEBUG_LAYOUT ? 'rgba(0, 255, 0, 0.05)' : undefined,
//   window: DEBUG_LAYOUT ? 'rgba(0, 0, 255, 0.05)' : undefined,
// };

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  // Palet warna global berdasarkan tema (GColors)
  // Anda bisa menyesuaikan warna-warna ini lebih lanjut jika diperlukan
  const GColors = {
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    primary: theme.colors.primary,
    border: theme.colors.border,
    userBubbleBg: theme.colors.primary,
    userBubbleText: theme.dark ? theme.colors.text : '#FFFFFF',
    // Untuk bot, kita bisa buat sedikit lebih lembut
    botBubbleBg: theme.dark ? '#262D37' : '#F1F3F5', // Sedikit berbeda dari GColors awal
    botBubbleText: theme.colors.text,
    inputBackground: theme.dark ? '#1A1D23' : '#FFFFFF', // Bisa disamakan dengan card jika lebih suka
    placeholderText: theme.dark ? '#6B7280' : '#6C757D',
    headerText: theme.colors.text,
    iconDefault: theme.dark ? '#CBD5E0' : '#495057',
    shadowColor: theme.dark ? '#000000' : '#4A5568',
    optionButtonBg: theme.dark ? '#374151' : '#E9ECEF', // Latar tombol opsi
    optionButtonText: theme.colors.primary, // Teks tombol opsi tetap primary
    optionButtonBorder: theme.dark ? '#4B5563' : theme.colors.border, // Border tombol opsi
    sendButtonIconColor: theme.dark ? theme.colors.text : '#FFFFFF',
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, isVisible]);

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

  const handleOptionSelect = (option: MessageOption, messageId: string) => {
    const userSelectionMessage: Message = {
      id: Date.now().toString(),
      text: option.text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, optionsDisabled: true } : msg
      );
      return [...updatedMessages, userSelectionMessage];
    });

    setTimeout(() => {
      let botResponseText = '';
      let nextOptions: MessageOption[] | undefined = undefined;
      // ... (logika switch case Anda tetap sama) ...
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
    }, 700); // Respon bot sedikit lebih cepat
  };

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

      if (!isFirstUserMessageOverall) {
        setTimeout(() => {
          const botResponse: Message = {
            id: `${Date.now().toString()}_bot_text_response`,
            text: `Anda mengetik: "${message.trim()}". Saya sedang memproses permintaan Anda.`,
            sender: 'bot',
            timestamp: new Date(),
            options: [{ text: 'Menu Utama', payload: 'MAIN_MENU' }],
            optionsDisabled: false,
          };
          setMessages(prevMessages => [...prevMessages, botResponse]);
        }, 1200);
      }
      setMessage('');
    }
  };

  const KAV_OFFSET = Platform.OS === 'ios' ? 20 : 0;

  return (
    <View style={[styles.outerContainer]}>
      <KeyboardAvoidingView
        style={[styles.kavWrapper]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={KAV_OFFSET}
        enabled
      >
        <View style={[styles.chatWindow, { backgroundColor: GColors.card, shadowColor: GColors.shadowColor, borderColor: GColors.border }]}>
          <View style={[styles.header, { borderBottomColor: GColors.border }]}>
            <Text style={[styles.headerTitle, { color: GColors.headerText }]}>Bantuan Cepat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconX size={24} color={GColors.iconDefault} />
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
                <Text style={[styles.emptyChatMessage, {color: GColors.placeholderText}]}>Ketik pesan atau pilih opsi untuk memulai...</Text>
              </View>
            )}
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const prevMsg = messages[index - 1];
              const nextMsg = messages[index + 1];
              const isFirstInBlock = !prevMsg || prevMsg.sender !== msg.sender;
              const isLastInBlock = !nextMsg || nextMsg.sender !== msg.sender;

              const messageBubbleCustomStyle: ViewStyle = {};
              if (isUser) {
                messageBubbleCustomStyle.borderTopRightRadius = isFirstInBlock ? 20 : 6;
                messageBubbleCustomStyle.borderBottomRightRadius = isLastInBlock ? 20 : 6;
                messageBubbleCustomStyle.borderTopLeftRadius = 20;
                messageBubbleCustomStyle.borderBottomLeftRadius = 20;
              } else {
                messageBubbleCustomStyle.borderTopLeftRadius = isFirstInBlock ? 20 : 6;
                messageBubbleCustomStyle.borderBottomLeftRadius = isLastInBlock ? 20 : 6;
                messageBubbleCustomStyle.borderTopRightRadius = 20;
                messageBubbleCustomStyle.borderBottomRightRadius = 20;
              }


              return (
                <View key={msg.id}>
                  <View style={[ styles.messageRow, isUser ? styles.userMessageRow : styles.botMessageRow ]}>
                    {!isUser && isFirstInBlock && <View style={[styles.botAvatarSmall, {backgroundColor: GColors.primary}]} />}
                    <View
                      style={[
                        styles.messageBubble,
                        isUser
                          ? { backgroundColor: GColors.userBubbleBg }
                          : { backgroundColor: GColors.botBubbleBg },
                        messageBubbleCustomStyle, // Terapkan border radius kustom
                        !isUser && { marginLeft: isFirstInBlock ? 0 : (styles.botAvatarSmall.width + styles.botAvatarSmall.marginRight) },
                      ]}
                    >
                      {msg.text && <Text style={[styles.messageText, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText }]}>{msg.text}</Text>}
                      {isLastInBlock && (!msg.options || (msg.options && msg.optionsDisabled)) && ( // Tampilkan timestamp jika ini pesan terakhir blok & opsi sudah dipilih atau tidak ada
                        <Text style={[styles.timestamp, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText, opacity: 0.7 }]}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      )}
                    </View>
                  </View>
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

          <View style={[styles.inputContainer, { borderTopColor: GColors.border, backgroundColor: GColors.card }]}>
            <TextInput
              style={[styles.textInput, { color: GColors.text, backgroundColor: GColors.inputBackground, borderColor: GColors.border }]}
              placeholder="Ketik pesan Anda..."
              placeholderTextColor={GColors.placeholderText}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false} // Agar keyboard tidak hilang saat submit (jika multiline)
              multiline
              maxHeight={100} // Sedikit kurangi maxHeight
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: GColors.primary, opacity: !message.trim() ? 0.6 : 1 }]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send size={22} color={GColors.sendButtonIconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const CHAT_WINDOW_MARGIN_HORIZONTAL = Platform.OS === 'web' ? 0 : 12; // Kurangi margin horizontal untuk mobile
const CHAT_WINDOW_MARGIN_BOTTOM = 12;


interface ChatbotStyle {
  outerContainer: ViewStyle;
  kavWrapper: ViewStyle;
  chatWindow: ViewStyle;
  header: ViewStyle;
  botAvatarSmall: ViewStyle;
  headerTitle: TextStyle;
  closeButton: ViewStyle;
  // closeIcon tidak lagi diperlukan karena menggunakan komponen Ikon
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
  textInput: ViewStyle & TextStyle; // textInput bisa punya style teks dan view
  sendButton: ViewStyle;
  // sendButtonIcon tidak lagi diperlukan karena menggunakan komponen Ikon
  optionsContainer: ViewStyle;
  optionButton: ViewStyle;
  optionButtonText: TextStyle;
}

const styles = StyleSheet.create<ChatbotStyle>({
  outerContainer: {
    position: 'absolute',
    right: CHAT_WINDOW_MARGIN_HORIZONTAL,
    bottom: CHAT_WINDOW_MARGIN_BOTTOM,
    left: Platform.OS === 'web' ? undefined : CHAT_WINDOW_MARGIN_HORIZONTAL, // Hanya set left jika bukan web
    width: Platform.OS === 'web' ? 380 : undefined, // Lebar untuk web
    maxWidth: Platform.OS === 'web' ? 380 : screenWidth - (CHAT_WINDOW_MARGIN_HORIZONTAL * 2), // Max width untuk mobile
    zIndex: 1000,
  },
  kavWrapper: {
    // KAV wrapper bisa dibiarkan kosong jika tidak ada style khusus
  },
  chatWindow: {
    width: '100%',
    minHeight: 380,
    maxHeight: screenHeight * (Platform.OS === 'web' ? 0.85 : 0.8), // Tinggi window lebih adaptif
    borderRadius: 20, // Border radius konsisten
    borderWidth: 1,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Sedikit kurangi padding vertikal header
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  botAvatarSmall: {
    width: 28, // Avatar sedikit lebih kecil
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignSelf: 'flex-end', // Agar avatar tetap di bawah jika bubble bot tinggi
    marginBottom: 3, // Sedikit margin bawah untuk avatar
  },
  headerTitle: {
    flex: 1,
    fontSize: 17, // Ukuran font judul
    fontFamily: 'Poppins-SemiBold', // Konsisten dengan font lain
    textAlign: 'left',
  },
  closeButton: {
    padding: 8, // Area tap tombol tutup
    marginLeft: 8,
  },
  messagesArea: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 10, // Padding horizontal di area pesan
    paddingVertical: 16,
    flexGrow: 1, // Penting agar ScrollView bisa scroll hingga akhir
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyChatMessage: {
    fontSize: 15, // Font pesan kosong
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.6,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 3, // Jarak antar baris lebih rapat
  },
  userMessageRow: {
    justifyContent: 'flex-end',
    marginLeft: '15%', // Memberi ruang agar bubble user tidak terlalu lebar
  },
  botMessageRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end', // Align avatar dan bubble
    marginRight: '15%', // Memberi ruang agar bubble bot tidak terlalu lebar
  },
  messageBubble: {
    paddingVertical: 10, // Padding internal bubble
    paddingHorizontal: 16,
    // borderRadius diatur dinamis
    maxWidth: '100%', // Bubble bisa mengambil lebar penuh dari parent row-nya (yang sudah dibatasi)
    // marginBottom: 2, // Jarak dari timestamp atau opsi
  },
  messageText: {
    fontSize: 15.5, // Ukuran font pesan
    fontFamily: 'Poppins-Regular',
    lineHeight: 22, // Line height untuk keterbacaan
  },
  timestamp: {
    fontSize: 11, // Timestamp lebih kecil
    fontFamily: 'Poppins-Regular',
    marginTop: 5, // Jarak dari teks pesan
    textAlign: 'right',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
    // Jika avatar tidak ada, marginLeft tidak perlu
    marginLeft: Platform.OS === 'web' ? 0 : (28 + 8), // Sesuaikan dengan avatar jika ada
    marginBottom: 4,
  },
  optionButton: {
    paddingVertical: 7, // Padding tombol opsi
    paddingHorizontal: 14,
    borderRadius: 18, // Tombol lebih bulat (pill-shaped)
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonText: {
    fontSize: 13.5, // Font tombol opsi
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items ke bawah untuk multiline input
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    borderWidth: 1, // Border input tetap tipis
    borderRadius: 22, // Input lebih bulat
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 10, // Padding atas input
    paddingBottom: Platform.OS === 'ios' ? 12 : 10, // Padding bawah input
    marginRight: 10,
    fontSize: 16, // Font input
    fontFamily: 'Poppins-Regular',
    // maxHeight sudah diatur di props TextInput
  },
  sendButton: {
    width: 44, // Tombol kirim
    height: 44,
    borderRadius: 22, // Bulat sempurna
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 1, // Penyesuaian kecil untuk Android
  },
});

export default FloatingChatbot;