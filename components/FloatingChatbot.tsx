// src/components/FloatingChatbot.tsx
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

const DEBUG_LAYOUT = false; // Ubah ke true untuk debug layout
const debugColors = {
  outer: DEBUG_LAYOUT ? 'rgba(255, 0, 0, 0.05)' : undefined,
  kav: DEBUG_LAYOUT ? 'rgba(0, 255, 0, 0.05)' : undefined,
  window: DEBUG_LAYOUT ? 'rgba(0, 0, 255, 0.05)' : undefined,
};

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const GColors = {
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
  };

  const [message, setMessage] = useState('');
  // 1. Tidak ada pesan awal, array diinisialisasi kosong
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

  // Tambahkan pesan sapaan dari bot SETELAH pengguna mengirim pesan pertama dan messages masih kosong/hanya berisi 1 pesan pengguna
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'user') {
      const initialBotGreeting: Message = {
        id: `${Date.now().toString()}_bot_greet`,
        text: 'Halo! Ada yang bisa kami bantu untuk Anda hari ini?',
        sender: 'bot',
        timestamp: new Date(Date.now() + 50), // Sedikit delay setelah pesan user
      };
      setMessages(prevMessages => [...prevMessages, initialBotGreeting]);
    }
  }, [messages]);


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
      // Cek apakah ini pesan pertama dari pengguna (setelah chatbot dibuka dengan pesan kosong)
      const isFirstUserMessageOverall = messages.length === 0;

      setMessages(prevMessages => [...prevMessages, newUserMessage]);

      // Jika ini bukan pesan pertama pengguna secara keseluruhan (artinya bot sudah menyapa),
      // maka bot memberikan respons normal.
      // Jika ini pesan pertama, useEffect di atas akan menangani sapaan bot.
      if (!isFirstUserMessageOverall) {
        setTimeout(() => {
          let botTextResponse = `Terima kasih atas pertanyaan Anda mengenai "${message.trim()}".`;
          if (message.toLowerCase().includes("fitur") || message.toLowerCase().includes("baru")) {
              botTextResponse += " Kami memiliki beberapa fitur menarik yang baru saja diluncurkan. Bisa lebih spesifik?";
          } else if (message.toLowerCase().includes("bantuan") || message.toLowerCase().includes("masalah")) {
              botTextResponse += " Tentu, kami siap membantu. Silakan jelaskan lebih detail kendala yang Anda hadapi.";
          } else {
              botTextResponse += " Tim kami akan segera meninjau pertanyaan Anda. Mohon tunggu sebentar.";
          }

          const botResponse: Message = {
            id: `${Date.now().toString()}_bot`,
            text: botTextResponse,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prevMessages => [...prevMessages, botResponse]);
        }, 1500);
      }
      setMessage('');
    }
  };

  const KAV_OFFSET = Platform.OS === 'ios' ? 0 : 0;

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
            <Text style={[styles.headerTitle, { color: GColors.headerText }]}>Bantuan Langsung</Text>
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
            {messages.length === 0 && ( // Tampilkan pesan jika tidak ada messages
              <View style={styles.emptyChatContainer}>
                <Text style={[styles.emptyChatMessage, {color: GColors.placeholderText}]}>Mulai percakapan Anda...</Text>
              </View>
            )}
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const prevMsg = messages[index - 1];
              const nextMsg = messages[index + 1];
              const isFirstInBlock = !prevMsg || prevMsg.sender !== msg.sender;
              const isLastInBlock = !nextMsg || nextMsg.sender !== msg.sender;

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.userMessageRow : styles.botMessageRow,
                  ]}
                >
                  {!isUser && isFirstInBlock && <View style={[styles.botAvatarSmall, {backgroundColor: GColors.primary}]} />}
                  <View
                    style={[
                      styles.messageBubble,
                      isUser
                        ? {
                            backgroundColor: GColors.userBubbleBg,
                            borderTopRightRadius: isFirstInBlock ? 18 : 5,
                            borderBottomRightRadius: isLastInBlock ? 18 : 5,
                          }
                        : {
                            backgroundColor: GColors.botBubbleBg,
                            borderTopLeftRadius: isFirstInBlock ? 18 : 5,
                            borderBottomLeftRadius: isLastInBlock ? 18 : 5,
                          },
                       !isUser && { marginLeft: isFirstInBlock ? 0 : (styles.botAvatarSmall.width + styles.botAvatarSmall.marginRight) },
                    ]}
                  >
                    <Text style={[styles.messageText, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText }]}>
                      {msg.text}
                    </Text>
                    {isLastInBlock && (
                        <Text style={[styles.timestamp, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText, opacity: 0.7 }]}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    )}
                  </View>
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

// Definisikan interface untuk tipe styles
interface ChatbotStyle {
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
  emptyChatContainer: ViewStyle; // Style untuk pesan area kosong
  emptyChatMessage: TextStyle;   // Style untuk teks pesan area kosong
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
}

const styles = StyleSheet.create<ChatbotStyle>({
  outerContainer: {
    position: 'absolute',
    right: CHAT_WINDOW_MARGIN,
    bottom: CHAT_WINDOW_MARGIN,
    left: Platform.OS === 'web' ? undefined : CHAT_WINDOW_MARGIN,
    width: Platform.OS === 'web' ? 380 : undefined,
    maxWidth: 420,
    zIndex: 1000,
  },
  kavWrapper: {},
  chatWindow: {
    width: '100%',
    minHeight: 350, // Sedikit menambah tinggi minimal
    // 2. Membuat window lebih tinggi
    maxHeight: screenHeight * (Platform.OS === 'web' ? 0.85 : 0.8), // Dari 0.75/0.7 menjadi 0.85/0.8
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
    elevation: Platform.OS === 'android' ? 12 : 0,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  botAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    textAlign: 'left',
  },
  closeButton: {
    padding: 8,
    marginLeft: 10,
  },
  closeIcon: {
    fontSize: 24,
    fontFamily: 'Poppins-Regular',
  },
  messagesArea: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexGrow: 1, // Penting agar bisa justify content jika pesan sedikit
  },
  emptyChatContainer: { // Style untuk pesan saat area chat kosong
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatMessage: { // Style untuk teks pesan saat area chat kosong
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    opacity: 0.8,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '78%',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15.5,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11.5,
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
    textAlign: 'right',
    opacity: 0.65,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
});

export default FloatingChatbot;