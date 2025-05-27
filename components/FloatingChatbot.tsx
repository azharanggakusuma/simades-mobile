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
  Animated,
  LayoutAnimation,
  UIManager,
  Easing,
  Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Send, X as IconX, Bot, MessageCircle } from 'lucide-react-native';

// Untuk LayoutAnimation di Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  // Peringatan: setLayoutAnimationEnabledExperimental adalah no-op di New Architecture.
  // LayoutAnimation mungkin sudah aktif secara default atau memerlukan konfigurasi berbeda.
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Interface (tetap sama)
interface MessageOption { text: string; payload: string; }
interface Message { id: string; text?: string; sender: 'user' | 'bot'; timestamp: Date; options?: MessageOption[]; optionsDisabled?: boolean; isTyping?: boolean; }
interface FloatingChatbotProps { isVisible: boolean; onClose: () => void; }

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CHAT_WINDOW_MARGIN_BOTTOM_INITIAL = 10;

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  isVisible,
  onClose,
}) => {
  const currentTheme = useTheme();
  const GColors = {
    background: currentTheme.colors.background,
    card: currentTheme.colors.card,
    text: currentTheme.colors.text,
    primary: currentTheme.colors.primary,
    border: currentTheme.colors.border,
    userBubbleBg: currentTheme.colors.primary,
    userBubbleText: currentTheme.dark ? currentTheme.colors.text : '#FFFFFF',
    botBubbleBg: currentTheme.dark ? '#374151' : '#E9ECEF',
    botBubbleText: currentTheme.colors.text,
    inputBackground: currentTheme.dark ? '#1F2937' : '#F9FAFB',
    inputBorderFocused: currentTheme.colors.primary,
    placeholderText: currentTheme.dark ? '#6B7280' : '#9CA3AF',
    headerText: currentTheme.colors.text,
    iconDefault: currentTheme.dark ? '#9CA3AF' : '#6B7280',
    shadowColor: currentTheme.dark ? '#000000' : '#4A5568',
    optionButtonBg: currentTheme.dark ? '#4B5563' : '#FFFFFF',
    optionButtonText: currentTheme.colors.primary,
    sendButtonIconColor: currentTheme.dark ? currentTheme.colors.text : '#FFFFFF',
    botAvatarBackground: currentTheme.colors.primary,
    botAvatarIconColor: currentTheme.dark ? currentTheme.colors.text : '#FFFFFF',
    typingIndicatorColor: currentTheme.dark ? '#9CA3AF' : '#6B7280',
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animasi untuk show/hide jendela utama
  const windowOpacityAnim = useRef(new Animated.Value(0)).current;
  const windowInitialTranslateYAnim = useRef(new Animated.Value(70)).current; // Slide awal dari bawah

  // Animasi untuk mengangkat jendela saat keyboard muncul
  const keyboardLiftAnim = useRef(new Animated.Value(0)).current; // 0 = tidak terangkat

  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(windowOpacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(windowInitialTranslateYAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(windowOpacityAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(windowInitialTranslateYAnim, {
          toValue: 70,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
        // Reset keyboardLiftAnim jika chatbot ditutup saat keyboard masih mungkin terbuka
        if (!isVisible) {
            Animated.timing(keyboardLiftAnim, { // Gunakan timing untuk konsistensi JS driver
                toValue: 0, // Kembali ke tidak terangkat
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true, // Transform bisa native
            }).start();
        }
      });
    }
  }, [isVisible, windowOpacityAnim, windowInitialTranslateYAnim, keyboardLiftAnim]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        if (isVisible) {
          const liftValue = -e.endCoordinates.height + (Platform.OS === 'ios' ? 0 : 40);
          Animated.timing(keyboardLiftAnim, {
            toValue: liftValue,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true, // Transform bisa native
          }).start();
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(keyboardLiftAnim, {
          toValue: 0, // Kembali ke tidak terangkat
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true, // Transform bisa native
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardLiftAnim, isVisible]);

  useEffect(() => {
    if (isVisible && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isVisible]);

  const addTypingIndicator = () => {
    const typingId = `${Date.now().toString()}_bot_typing`;
    const typingMessage: Message = { id: typingId, sender: 'bot', timestamp: new Date(), isTyping: true, };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages(prevMessages => [...prevMessages.filter(msg => !msg.isTyping), typingMessage]);
    return typingId;
  };

  const removeTypingIndicatorAndAddMessage = (typingId: string, newMessage: Message) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages(prevMessages => [ ...prevMessages.filter(msg => msg.id !== typingId), newMessage, ]);
  };

  useEffect(() => {
    if (isVisible && messages.length > 0 && messages[messages.length - 1].sender === 'user') {
        const userMessagesCount = messages.filter(m => m.sender === 'user').length;
        const botGreetingExists = messages.some(m => m.id.includes('_bot_greet'));
        if (userMessagesCount === 1 && !botGreetingExists) {
            if (messages.some(msg => msg.isTyping)) return;
            const typingId = addTypingIndicator();
            setTimeout(() => {
                const initialBotGreeting: Message = {
                    id: `${Date.now().toString()}_bot_greet_after_user`,
                    text: 'Halo! 👋 Selamat datang. Ada yang bisa kami bantu?',
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
            }, 700 + Math.random() * 300);
        }
    }
  }, [messages, isVisible]);

  const handleOptionSelect = (option: MessageOption, messageId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const userSelectionMessage: Message = { id: Date.now().toString(), text: option.text, sender: 'user', timestamp: new Date() };
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, optionsDisabled: true } : msg
      );
      return [...updatedMessages, userSelectionMessage];
    });

    const typingId = addTypingIndicator();
    setTimeout(() => {
      let botResponseText = '';
      let nextOptions: MessageOption[] | undefined = undefined;
        switch (option.payload) {
          case 'PRODUCT_INQUIRY': botResponseText = 'Tentu, mengenai produk kami. Produk mana yang menarik perhatian Anda?'; nextOptions = [ { text: 'Produk X', payload: 'PRODUCT_X_DETAILS' }, { text: 'Produk Y', payload: 'PRODUCT_Y_DETAILS' }, { text: 'Kembali', payload: 'MAIN_MENU' }, ]; break;
          case 'CUSTOMER_SERVICE': botResponseText = 'Untuk layanan pelanggan, silakan sampaikan pertanyaan atau keluhan Anda.'; nextOptions = [ { text: 'Lacak Pesanan', payload: 'TRACK_ORDER' }, { text: 'Pengembalian', payload: 'RETURN_POLICY' }, { text: 'Kembali', payload: 'MAIN_MENU' }, ]; break;
          case 'OTHER_INFO': botResponseText = 'Baik, untuk informasi lainnya, apa yang ingin Anda ketahui?'; break;
          case 'PRODUCT_X_DETAILS': botResponseText = 'Produk X memiliki fitur A, B, C. Apakah ada detail lain yang Anda perlukan?'; nextOptions = [{ text: 'Kembali ke Info Produk', payload: 'PRODUCT_INQUIRY'}]; break;
          case 'TRACK_ORDER': botResponseText = 'Untuk melacak pesanan, mohon berikan nomor pesanan Anda.'; nextOptions = [{text: 'Menu Utama', payload: 'MAIN_MENU'}]; break;
          case 'MAIN_MENU': botResponseText = 'Ada lagi yang bisa saya bantu?'; nextOptions = [ { text: 'Tanya Produk', payload: 'PRODUCT_INQUIRY' }, { text: 'Layanan Pelanggan', payload: 'CUSTOMER_SERVICE' }, { text: 'Info Lainnya', payload: 'OTHER_INFO' }, ]; break;
          default: botResponseText = `Anda memilih: ${option.text}. Saya akan memprosesnya.`;
        }
      const botResponse: Message = { id: `${Date.now().toString()}_bot_option_response`, text: botResponseText, sender: 'bot', timestamp: new Date(), options: nextOptions, optionsDisabled: false, };
      removeTypingIndicatorAndAddMessage(typingId, botResponse);
    }, 900 + Math.random() * 500);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const newUserMessage: Message = { id: Date.now().toString(), text: message.trim(), sender: 'user', timestamp: new Date() };
      const isFirstUserMessageOverall = messages.filter(m => m.sender === 'user').length === 0;
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setMessage('');

      if (!isFirstUserMessageOverall) {
          const typingId = addTypingIndicator();
          setTimeout(() => {
            const botResponse: Message = { id: `${Date.now().toString()}_bot_text_response`, text: `Mengenai "${newUserMessage.text}", saya coba carikan informasinya.`, sender: 'bot', timestamp: new Date(), options: [{ text: 'Menu Utama', payload: 'MAIN_MENU' }], optionsDisabled: false };
            removeTypingIndicatorAndAddMessage(typingId, botResponse);
          }, 1100 + Math.random() * 600);
      }
    }
  };

  if (!shouldRender && !isVisible) {
    return null;
  }

  // KAV_OFFSET internal untuk input DI DALAM chat window
  const INTERNAL_KAV_OFFSET = Platform.OS === 'ios' ? 60 : 0;

  return (
    <Animated.View
      style={[
        styles.outerContainer, // Ini sudah memiliki bottom: CHAT_WINDOW_MARGIN_BOTTOM_INITIAL
        {
          opacity: windowOpacityAnim,
          transform: [
            // Menggabungkan kedua translateY: satu untuk slide awal, satu untuk lift keyboard
            { translateY: Animated.add(windowInitialTranslateYAnim, keyboardLiftAnim) },
          ],
        },
        !shouldRender && { display: 'none' }
      ]}
    >
      <KeyboardAvoidingView
        style={styles.kavWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={INTERNAL_KAV_OFFSET}
        enabled={isVisible}
      >
        <View style={[styles.chatWindow, { backgroundColor: GColors.card, shadowColor: GColors.shadowColor, borderColor: GColors.border }]}>
          <View style={[styles.header, { borderBottomColor: GColors.border }]}>
            <Text style={[styles.headerTitle, { color: GColors.headerText }]}>Bantuan Cepat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconX size={22} color={GColors.iconDefault} />
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
                <MessageCircle size={48} color={GColors.placeholderText} style={{marginBottom: 16, opacity: 0.7}}/>
                <Text style={[styles.emptyChatMessage, {color: GColors.placeholderText}]}>Ada yang bisa dibantu?</Text>
                <Text style={[styles.emptyChatSubMessage, {color: GColors.placeholderText}]}>Ketik pesan atau pilih opsi di bawah jika tersedia.</Text>
              </View>
            )}
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const prevMsg = messages[index - 1];
              const nextMsg = messages[index + 1];
              const isFirstInBlock = !prevMsg || prevMsg.sender !== msg.sender;
              const isLastInBlock = !nextMsg || nextMsg.sender !== msg.sender;

              const messageBubbleCustomStyle: ViewStyle = {};
              if (isUser) { messageBubbleCustomStyle.borderTopRightRadius = isFirstInBlock ? 20 : 8; messageBubbleCustomStyle.borderBottomRightRadius = isLastInBlock ? 20 : 8; messageBubbleCustomStyle.borderTopLeftRadius = 20; messageBubbleCustomStyle.borderBottomLeftRadius = 20;}
              else { messageBubbleCustomStyle.borderTopLeftRadius = isFirstInBlock ? 20 : 8; messageBubbleCustomStyle.borderBottomLeftRadius = isLastInBlock ? 20 : 8; messageBubbleCustomStyle.borderTopRightRadius = 20; messageBubbleCustomStyle.borderBottomRightRadius = 20;}

               if (msg.isTyping) {
                return (
                  <View key={msg.id} style={[styles.messageRow, styles.botMessageRow]}>
                    {!isUser && isFirstInBlock && (
                        <View style={[styles.botAvatarContainer, {backgroundColor: GColors.botAvatarBackground}]}>
                            <Bot size={18} color={GColors.botAvatarIconColor} />
                        </View>
                    )}
                    <View style={[
                        styles.messageBubble,
                        styles.typingBubble,
                        { backgroundColor: GColors.botBubbleBg},
                        messageBubbleCustomStyle,
                        !isUser && { marginLeft: isFirstInBlock ? 0 : (styles.botAvatarContainer.width + styles.botAvatarContainer.marginRight) }
                        ]}>
                      <View style={styles.typingDotsContainer}>
                        <View style={[styles.typingDot, {backgroundColor: GColors.typingIndicatorColor}]} />
                        <View style={[styles.typingDot, {backgroundColor: GColors.typingIndicatorColor, marginHorizontal: 3}]} />
                        <View style={[styles.typingDot, {backgroundColor: GColors.typingIndicatorColor}]} />
                      </View>
                    </View>
                  </View>
                );
              }

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
                          style={[styles.optionButton, { backgroundColor: GColors.optionButtonBg, shadowColor: GColors.shadowColor }]}
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
              style={[
                  styles.textInput,
                  { color: GColors.text, backgroundColor: GColors.inputBackground, borderColor: isInputFocused ? GColors.inputBorderFocused : GColors.border }
                ]}
              placeholder="Ketik pesan Anda..."
              placeholderTextColor={GColors.placeholderText}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
              multiline
              maxHeight={100}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: GColors.primary, opacity: !message.trim() ? 0.6 : 1 }]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send size={20} color={GColors.sendButtonIconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const CHAT_WINDOW_MARGIN_HORIZONTAL_STYLES = Platform.OS === 'web' ? 0 : 10;

interface ChatbotStyle { outerContainer: ViewStyle; kavWrapper: ViewStyle; chatWindow: ViewStyle; header: ViewStyle; botAvatarContainer: ViewStyle; headerTitle: TextStyle; closeButton: ViewStyle; messagesArea: ViewStyle; messagesContentContainer: ViewStyle; emptyChatContainer: ViewStyle; emptyChatMessage: TextStyle; emptyChatSubMessage: TextStyle; messageRow: ViewStyle; userMessageRow: ViewStyle; botMessageRow: ViewStyle; messageBubble: ViewStyle; typingBubble: ViewStyle; typingDotsContainer: ViewStyle; typingDot: ViewStyle; messageText: TextStyle; timestamp: TextStyle; inputContainer: ViewStyle; textInput: ViewStyle & TextStyle; sendButton: ViewStyle; optionsContainer: ViewStyle; optionButton: ViewStyle; optionButtonText: TextStyle; }
const styles = StyleSheet.create<ChatbotStyle>({
  outerContainer: {
    position: 'absolute',
    bottom: CHAT_WINDOW_MARGIN_BOTTOM_INITIAL, // Posisi bottom awal yang statis
    right: CHAT_WINDOW_MARGIN_HORIZONTAL_STYLES,
    left: Platform.OS === 'web' ? undefined : CHAT_WINDOW_MARGIN_HORIZONTAL_STYLES,
    width: Platform.OS === 'web' ? 370 : undefined,
    maxWidth: Platform.OS === 'web' ? 370 : screenWidth - (CHAT_WINDOW_MARGIN_HORIZONTAL_STYLES * 2),
    zIndex: 1000,
  },
  kavWrapper: {
    // flex: 1, // Pertimbangkan jika ada masalah sizing KAV
  },
  chatWindow: {
    width: '100%',
    minHeight: 360,
    maxHeight: screenHeight * (Platform.OS === 'web' ? 0.8 : 0.75),
    borderRadius: 22,
    borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
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
  botAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16.5,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
  },
  closeButton: {
    padding: 6,
    marginLeft: 10,
  },
  messagesArea: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 18,
    flexGrow: 1,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  emptyChatMessage: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 8,
  },
  emptyChatSubMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
    marginLeft: '18%',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight: '18%',
  },
  messageBubble: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  typingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    lineHeight: 23,
  },
  timestamp: {
    fontSize: 10.5,
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
    textAlign: 'right',
    opacity: 0.6,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: (32 + 8),
    marginBottom: 6,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 12 : 9,
    paddingBottom: Platform.OS === 'ios' ? 12 : 9,
    marginRight: 8,
    fontSize: 15.5,
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingChatbot;