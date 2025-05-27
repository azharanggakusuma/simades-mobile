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
  Dimensions, // Untuk mendapatkan dimensi layar
  Keyboard, // Untuk listener keyboard
} from 'react-native';
import { useTheme } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FloatingChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const { colors } = theme;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Halo! Ada yang bisa saya bantu?', sender: 'bot', timestamp: new Date() },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0); // Untuk penyesuaian posisi manual jika perlu

  useEffect(() => {
    // Listener untuk mendapatkan tinggi keyboard (lebih reliable di beberapa kasus)
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isVisible && scrollViewRef.current) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isVisible]);

  if (!isVisible) {
    return null;
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now().toString() + '_bot',
          text: `Anda mengirim: "${message.trim()}"`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 1000);
      setMessage('');
    }
  };

  // Menggunakan keyboardVerticalOffset bisa membantu KAV
  // Nilai offset mungkin perlu disesuaikan tergantung pada UI aplikasi Anda (misalnya, jika ada tab bar)
  const kavOffset = Platform.OS === 'ios' ? 60 : 0; // Contoh offset, sesuaikan

  return (
    // Container luar untuk positioning absolut dari keseluruhan chatbot window
    <View style={[
        styles.outerChatbotContainer,
        // Jika ingin menyesuaikan posisi berdasarkan keyboardHeight secara manual (alternatif KAV behavior)
        // { bottom: keyboardHeight > 0 ? keyboardHeight : 20 }
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined} // undefined untuk Android sering lebih baik dengan absolute
        style={styles.keyboardAvoidingWrapper} // Wrapper untuk KAV, bukan untuk positioning absolut utama
        keyboardVerticalOffset={kavOffset}
      >
        <View style={[styles.chatbotWindow, { backgroundColor: colors.card, shadowColor: theme.dark ? '#000' : '#555' }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerText, { color: colors.text }]}>Bantuan Chat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.chatArea}
            contentContainerStyle={styles.chatAreaContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userMessage : styles.botMessage,
                  { backgroundColor: msg.sender === 'user' ? colors.primary : (theme.dark ? '#374151' : '#E5E7EB') }
                ]}
              >
                <Text style={[styles.messageText, { color: msg.sender === 'user' ? 'white' : colors.text }]}>
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.inputArea, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: theme.dark ? '#2d3748' : '#f0f0f0'
                }
              ]}
              placeholder="Ketik pesan Anda..."
              placeholderTextColor={theme.dark ? '#A0AEC0' : '#718096'}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primary, opacity: !message.trim() ? 0.6 : 1 }]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

interface ChatbotStyle {
  outerChatbotContainer: ViewStyle; // Container terluar untuk positioning absolut
  keyboardAvoidingWrapper: ViewStyle; // Wrapper untuk KAV
  chatbotWindow: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  closeButton: ViewStyle;
  closeButtonText: TextStyle;
  chatArea: ViewStyle;
  chatAreaContent: ViewStyle;
  messageBubble: ViewStyle;
  userMessage: ViewStyle;
  botMessage: ViewStyle;
  messageText: TextStyle;
  inputArea: ViewStyle;
  input: ViewStyle & TextStyle;
  sendButton: ViewStyle;
  sendButtonText: TextStyle;
}

// Jarak standar dari tepi layar
const SCREEN_EDGE_MARGIN = 20;

const styles = StyleSheet.create<ChatbotStyle>({
  outerChatbotContainer: {
    position: 'absolute',
    // Jika chatbot akan memenuhi lebar tertentu di kanan bawah:
    right: SCREEN_EDGE_MARGIN,
    bottom: SCREEN_EDGE_MARGIN,
    // Lebar dan tinggi window chatbot akan diatur oleh `chatbotWindow` di bawah
    // zIndex penting agar muncul di atas elemen lain
    zIndex: 1000, // Pastikan ini lebih tinggi dari FAB
    // Jika ingin window chat tidak terlalu lebar di layar besar
    maxWidth: Platform.OS === 'web' ? 380 : screenWidth - (SCREEN_EDGE_MARGIN * 2),
  },
  keyboardAvoidingWrapper: {
    // KAV tidak perlu styling posisi absolut sendiri, ia hanya mengatur behavior padding/height
    // Biarkan `chatbotWindow` yang menentukan ukuran visualnya.
    // flex: 1, // Mungkin diperlukan agar KAV mengisi outerChatbotContainer jika outer punya dimensi tetap
  },
  chatbotWindow: {
    // Lebar bisa 100% dari parent (outerChatbotContainer) atau fixed
    width: '100%', // Mengisi lebar outerChatbotContainer
    // Tinggi bisa diatur dengan height atau maxHeight
    height: screenHeight * 0.65, // 65% tinggi layar
    maxHeight: Platform.OS === 'web' ? 550 : 600, // Batas maksimum tinggi
    minHeight: 300, // Batas minimum tinggi
    borderRadius: 12,
    backgroundColor: 'white', // Default, akan ditimpa oleh theme
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    overflow: 'hidden', // Sangat penting untuk borderRadius dan shadow
    display: 'flex',
    flexDirection: 'column', // Layout vertikal untuk header, chatArea, inputArea
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, // Garis tipis
    // backgroundColor: 'lightblue', // Untuk debug layout
  },
  headerText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  chatArea: {
    flex: 1, // Ini akan mengambil sisa ruang di antara header dan inputArea
    paddingHorizontal: 12,
    paddingTop: 10,
    // backgroundColor: 'lightgreen', // Untuk debug layout
  },
  chatAreaContent: {
    paddingBottom: 10, // Agar pesan terakhir tidak terpotong
  },
  messageBubble: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20, // Lebih bulat
    marginBottom: 10,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6, // Styling ujung
  },
  botMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6, // Styling ujung
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    lineHeight: 21,
  },
  inputArea: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    // backgroundColor: 'lightcoral', // Untuk debug layout
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    marginRight: 10,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    maxHeight: 100, // Jika input bisa multiline
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    transform: [{ translateX: Platform.OS === 'ios' ? 1 : 0 }] // Penyesuaian kecil posisi ikon
  },
});

export default FloatingChatbot;