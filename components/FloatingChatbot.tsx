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
  Animated, // Ditambahkan
  LayoutAnimation, // Ditambahkan
  UIManager, // Ditambahkan
  Easing, // Ditambahkan
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Send, X as IconX, Bot } from 'lucide-react-native';

// Aktifkan LayoutAnimation untuk Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MessageOption {
  text: string;
  payload: string;
}

interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: MessageOption[];
  optionsDisabled?: boolean;
  isTyping?: boolean; // Ditambahkan untuk indikator mengetik
}

interface FloatingChatbotProps {
  isVisible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const GColors = { // GColors dari kode Anda
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    primary: theme.colors.primary,
    border: theme.colors.border,
    userBubbleBg: theme.colors.primary,
    userBubbleText: theme.dark ? theme.colors.text : '#FFFFFF',
    botBubbleBg: theme.dark ? '#262D37' : '#F1F3F5',
    botBubbleText: theme.colors.text,
    inputBackground: theme.dark ? '#1A1D23' : '#FFFFFF',
    placeholderText: theme.dark ? '#6B7280' : '#6C757D',
    headerText: theme.colors.text,
    iconDefault: theme.dark ? '#CBD5E0' : '#495057',
    shadowColor: theme.dark ? '#000000' : '#4A5568',
    optionButtonBg: theme.dark ? '#374151' : '#E9ECEF',
    optionButtonText: theme.colors.primary,
    optionButtonBorder: theme.dark ? '#4B5563' : theme.colors.border,
    sendButtonIconColor: theme.dark ? theme.colors.text : '#FFFFFF',
    botAvatarBackground: theme.colors.primary,
    botAvatarIconColor: theme.dark ? theme.colors.text : '#FFFFFF',
    typingIndicatorColor: theme.dark ? '#9CA3AF' : '#6B7280', // Warna untuk indikator
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Untuk animasi jendela chat
  const windowAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      Animated.timing(windowAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(windowAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
        // setMessages([]); // Opsional: reset pesan saat ditutup permanen
      });
    }
  }, [isVisible, windowAnim]);


  useEffect(() => {
    if (isVisible && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isVisible]);

  // Fungsi pembantu untuk indikator mengetik
  const addTypingIndicator = () => {
    const typingId = `${Date.now().toString()}_bot_typing`;
    const typingMessage: Message = {
      id: typingId,
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages(prevMessages => [...prevMessages.filter(msg => !msg.isTyping), typingMessage]); // Hapus indikator lama jika ada
    return typingId;
  };

  const removeTypingIndicatorAndAddMessage = (typingId: string, newMessage: Message) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages(prevMessages => [
      ...prevMessages.filter(msg => msg.id !== typingId),
      newMessage,
    ]);
  };


  // Sapaan bot setelah pesan pertama pengguna
  useEffect(() => {
    // Cek jika pesan terakhir adalah dari user dan itu satu-satunya pesan user setelah potensial sapaan awal
    if (isVisible && messages.length > 0 && messages[messages.length - 1].sender === 'user') {
        const userMessagesCount = messages.filter(m => m.sender === 'user').length;
        const botGreetingExists = messages.some(m => m.id.includes('_bot_greet'));

        if (userMessagesCount === 1 && !botGreetingExists) { // Hanya jika ini adalah pesan pertama dari user dan belum ada sapaan
            const typingId = addTypingIndicator();
            setTimeout(() => {
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
                removeTypingIndicatorAndAddMessage(typingId, initialBotGreeting);
            }, 700 + Math.random() * 500);
        }
    }
  }, [messages, isVisible]);


  // Logika handleOptionSelect dan handleSendMessage dari kode Anda, dengan penambahan animasi & indikator
  const handleOptionSelect = (option: MessageOption, messageId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animasi untuk pesan pengguna
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

    const typingId = addTypingIndicator(); // Tambahkan indikator

    setTimeout(() => {
      let botResponseText = '';
      let nextOptions: MessageOption[] | undefined = undefined;
      // Switch case Anda (tetap sama)
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
      removeTypingIndicatorAndAddMessage(typingId, botResponse); // Hapus indikator, tampilkan pesan
    }, 700 + Math.random() * 800); // Delay dengan variasi
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animasi untuk pesan pengguna
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date(),
      };

      const isFirstUserMessageOverall = messages.filter(m => m.sender === 'user').length === 0; // Cek apakah ini pesan user pertama

      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setMessage(''); // Kosongkan input segera

      // Jika bukan pesan user pertama (sapaan sudah ditangani useEffect terpisah)
      if (!isFirstUserMessageOverall) {
          const typingId = addTypingIndicator(); // Tambahkan indikator
          setTimeout(() => {
            const botResponse: Message = {
              id: `${Date.now().toString()}_bot_text_response`,
              text: `Anda mengetik: "${newUserMessage.text}". Saya sedang memproses permintaan Anda.`,
              sender: 'bot',
              timestamp: new Date(),
              options: [{ text: 'Menu Utama', payload: 'MAIN_MENU' }],
              optionsDisabled: false,
            };
            removeTypingIndicatorAndAddMessage(typingId, botResponse); // Hapus indikator, tampilkan pesan
          }, 1200 + Math.random() * 800); // Delay dengan variasi
      }
      // Logika sapaan setelah pesan user pertama akan dihandle oleh useEffect di atas
    }
  };

  const KAV_OFFSET = Platform.OS === 'ios' ? 20 : 0;

  // Logika return null di awal dihilangkan, diganti dengan Animated.View dan shouldRender
  if (!shouldRender && !isVisible) {
    return null;
  }

  const windowAnimatedStyle = {
    opacity: windowAnim,
    transform: [
      {
        translateY: windowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Muncul dari bawah (100px) ke posisi akhir (0)
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.outerContainer, windowAnimatedStyle, !shouldRender && { display: 'none' }]}>
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

              // Render Indikator Mengetik
              if (msg.isTyping) {
                return (
                  <View key={msg.id} style={[styles.messageRow, styles.botMessageRow]}>
                    {!isUser && isFirstInBlock && ( // Avatar tetap ditampilkan untuk konsistensi
                        <View style={[styles.botAvatarContainer, {backgroundColor: GColors.botAvatarBackground}]}>
                            <Bot size={18} color={GColors.botAvatarIconColor} />
                        </View>
                    )}
                    <View style={[
                        styles.messageBubble,
                        { backgroundColor: GColors.botBubbleBg, paddingVertical: 12 },
                        messageBubbleCustomStyle, // Terapkan juga custom radius jika perlu
                        !isUser && { marginLeft: isFirstInBlock ? 0 : (styles.botAvatarContainer.width + styles.botAvatarContainer.marginRight) }
                        ]}>
                      <Text style={{color: GColors.typingIndicatorColor, fontFamily: 'Poppins-Regular', fontSize: 14}}>
                        Bot sedang mengetik...
                      </Text>
                    </View>
                  </View>
                );
              }

              // Render Pesan Biasa
              return (
                <View key={msg.id}>
                  <View style={[ styles.messageRow, isUser ? styles.userMessageRow : styles.botMessageRow ]}>
                    {!isUser && isFirstInBlock && (
                      <View style={[styles.botAvatarContainer, {backgroundColor: GColors.botAvatarBackground}]}>
                        <Bot size={18} color={GColors.botAvatarIconColor} />
                      </View>
                    )}
                    <View
                      style={[
                        styles.messageBubble,
                        isUser
                          ? { backgroundColor: GColors.userBubbleBg }
                          : { backgroundColor: GColors.botBubbleBg },
                        messageBubbleCustomStyle,
                        !isUser && { marginLeft: isFirstInBlock ? 0 : (styles.botAvatarContainer.width + styles.botAvatarContainer.marginRight) },
                      ]}
                    >
                      {msg.text && <Text style={[styles.messageText, { color: isUser ? GColors.userBubbleText : GColors.botBubbleText }]}>{msg.text}</Text>}
                      {isLastInBlock && (!msg.options || (msg.options && msg.optionsDisabled)) && (
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
              blurOnSubmit={false}
              multiline
              maxHeight={100}
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
    </Animated.View>
  );
};

// Styles (styles, CHAT_WINDOW_MARGIN_HORIZONTAL, dll tetap sama seperti yang Anda berikan)
const CHAT_WINDOW_MARGIN_HORIZONTAL = Platform.OS === 'web' ? 0 : 12;
const CHAT_WINDOW_MARGIN_BOTTOM = 12;

interface ChatbotStyle {
  outerContainer: ViewStyle;
  kavWrapper: ViewStyle;
  chatWindow: ViewStyle;
  header: ViewStyle;
  botAvatarContainer: ViewStyle;
  headerTitle: TextStyle;
  closeButton: ViewStyle;
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
  optionsContainer: ViewStyle;
  optionButton: ViewStyle;
  optionButtonText: TextStyle;
}

const styles = StyleSheet.create<ChatbotStyle>({
  outerContainer: {
    position: 'absolute',
    right: CHAT_WINDOW_MARGIN_HORIZONTAL,
    bottom: CHAT_WINDOW_MARGIN_BOTTOM,
    left: Platform.OS === 'web' ? undefined : CHAT_WINDOW_MARGIN_HORIZONTAL,
    width: Platform.OS === 'web' ? 380 : undefined,
    maxWidth: Platform.OS === 'web' ? 380 : screenWidth - (CHAT_WINDOW_MARGIN_HORIZONTAL * 2),
    zIndex: 1000,
  },
  kavWrapper: {},
  chatWindow: {
    width: '100%',
    minHeight: 380,
    maxHeight: screenHeight * (Platform.OS === 'web' ? 0.85 : 0.8),
    borderRadius: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  botAvatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesArea: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyChatMessage: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.6,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
    marginLeft: '15%',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight: '15%',
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 15.5,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
    textAlign: 'right',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginLeft: (30 + 8), 
    marginBottom: 4,
  },
  optionButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonText: {
    fontSize: 13.5,
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 1,
  },
});

export default FloatingChatbot;