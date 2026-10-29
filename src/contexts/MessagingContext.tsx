import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor' | 'pharmacy' | 'admin';
  receiverId: string;
  receiverName: string;
  receiverRole: 'patient' | 'doctor' | 'pharmacy' | 'admin';
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'voice' | 'video' | 'transcript' | 'prescription';
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'patient' | 'doctor' | 'pharmacy' | 'admin';
    isOnline: boolean;
    lastSeen?: Date;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isTyping: { [userId: string]: boolean };
  onlineUsers: Set<string>;
  sendMessage: (content: string, type?: Message['type'], metadata?: Record<string, unknown>) => void;
  createConversation: (participantId: string) => Conversation;
  setActiveConversation: (conversation: Conversation | null) => void;
  markAsRead: (conversationId: string) => void;
  setTyping: (isTyping: boolean) => void;
  loadMoreMessages: (conversationId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// Mock data generator for demo
const generateMockMessages = (conversationId: string, participants: Conversation['participants']): Message[] => {
  const messages: Message[] = [];
  const messageTemplates = [
    "Hello, I need help with my prescription.",
    "Sure, I can help you with that. What seems to be the issue?",
    "I'm experiencing some side effects from the medication.",
    "Let me review your prescription. Can you describe the symptoms?",
    "I've been having headaches and nausea.",
    "Based on your symptoms, I recommend we adjust the dosage.",
    "Thank you, doctor. When should I start the new dosage?",
    "You can start from tomorrow morning. Take it with food.",
    "Understood. Should I schedule a follow-up?",
    "Yes, let's schedule a follow-up in 2 weeks."
  ];

  const now = new Date();
  messageTemplates.forEach((content, index) => {
    const sender = participants[index % 2];
    const receiver = participants[(index + 1) % 2];
    messages.push({
      id: `msg-${conversationId}-${index}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverRole: receiver.role,
      content,
      timestamp: new Date(now.getTime() - (10 - index) * 60000),
      isRead: index < messageTemplates.length - 2,
      type: 'text'
    });
  });

  return messages;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<{ [userId: string]: boolean }>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Initialize mock conversations based on user role
  useEffect(() => {
    if (!user) return;

    const mockConversations: Conversation[] = [];
    
    if (user.role === 'patient') {
      // Patient has conversations with doctors
      mockConversations.push({
        id: 'conv-1',
        participants: [
          { id: user.id, name: user.name, role: 'patient', isOnline: true },
          { id: 'doc-1', name: 'Dr. Rajesh Kumar', role: 'doctor', isOnline: true }
        ],
        lastMessage: undefined,
        unreadCount: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      mockConversations.push({
        id: 'conv-2',
        participants: [
          { id: user.id, name: user.name, role: 'patient', isOnline: true },
          { id: 'doc-2', name: 'Dr. Priya Singh', role: 'doctor', isOnline: false, lastSeen: new Date(Date.now() - 3600000) }
        ],
        lastMessage: undefined,
        unreadCount: 0,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      });
    } else if (user.role === 'doctor') {
      // Doctor has conversations with patients
      mockConversations.push({
        id: 'conv-3',
        participants: [
          { id: user.id, name: user.name, role: 'doctor', isOnline: true },
          { id: 'pat-1', name: 'Harpreet Kaur', role: 'patient', isOnline: true }
        ],
        lastMessage: undefined,
        unreadCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      mockConversations.push({
        id: 'conv-4',
        participants: [
          { id: user.id, name: user.name, role: 'doctor', isOnline: true },
          { id: 'pat-2', name: 'Jaspreet Singh', role: 'patient', isOnline: false, lastSeen: new Date(Date.now() - 7200000) }
        ],
        lastMessage: undefined,
        unreadCount: 0,
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000)
      });
    }

    // Add last messages to conversations
    mockConversations.forEach(conv => {
      const mockMessages = generateMockMessages(conv.id, conv.participants);
      if (mockMessages.length > 0) {
        conv.lastMessage = mockMessages[mockMessages.length - 1];
      }
    });

    setConversations(mockConversations);
    
    // Set online users
    const online = new Set<string>();
    mockConversations.forEach(conv => {
      conv.participants.forEach(p => {
        if (p.isOnline) online.add(p.id);
      });
    });
    setOnlineUsers(online);
  }, [user]);

  // Load messages for active conversation
  useEffect(() => {
    if (activeConversation) {
      const conversationMessages = generateMockMessages(
        activeConversation.id,
        activeConversation.participants
      );
      setMessages(conversationMessages);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const sendMessage = useCallback((content: string, type: Message['type'] = 'text', metadata?: Record<string, unknown>) => {
    if (!activeConversation || !user) return;

    const otherParticipant = activeConversation.participants.find(p => p.id !== user.id);
    if (!otherParticipant) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      receiverId: otherParticipant.id,
      receiverName: otherParticipant.name,
      receiverRole: otherParticipant.role,
      content,
      timestamp: new Date(),
      isRead: false,
      type,
      metadata
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage,
          updatedAt: new Date()
        };
      }
      return conv;
    }));

    // Simulate auto-reply after 2 seconds (for demo)
    if (user.role === 'patient' && type === 'text') {
      setTimeout(() => {
        const autoReply: Message = {
          id: `msg-auto-${Date.now()}`,
          conversationId: activeConversation.id,
          senderId: otherParticipant.id,
          senderName: otherParticipant.name,
          senderRole: otherParticipant.role,
          receiverId: user.id,
          receiverName: user.name,
          receiverRole: user.role,
          content: "Thank you for your message. I'll review this and get back to you shortly.",
          timestamp: new Date(),
          isRead: false,
          type: 'text'
        };
        
        setMessages(prev => [...prev, autoReply]);
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversation.id) {
            return {
              ...conv,
              lastMessage: autoReply,
              updatedAt: new Date(),
              unreadCount: conv.unreadCount + 1
            };
          }
          return conv;
        }));
      }, 2000);
    }
  }, [activeConversation, user]);

  const createConversation = useCallback((participantId: string): Conversation => {
    if (!user) throw new Error('User not authenticated');

    const newConversation: Conversation = {
      id: `conv-new-${Date.now()}`,
      participants: [
        { id: user.id, name: user.name, role: user.role, isOnline: true },
        { id: participantId, name: 'New Contact', role: 'patient', isOnline: false }
      ],
      lastMessage: undefined,
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  }, [user]);

  const markAsRead = useCallback((conversationId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.conversationId === conversationId && msg.receiverId === user?.id) {
        return { ...msg, isRead: true };
      }
      return msg;
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
  }, [user]);

  const setTyping = useCallback((typing: boolean) => {
    if (!activeConversation || !user) return;

    setIsTyping(prev => ({
      ...prev,
      [user.id]: typing
    }));

    // Simulate other user typing (for demo)
    if (typing && user.role === 'patient') {
      setTimeout(() => {
        const otherUser = activeConversation.participants.find(p => p.id !== user.id);
        if (otherUser) {
          setIsTyping(prev => ({
            ...prev,
            [otherUser.id]: true
          }));
          
          setTimeout(() => {
            setIsTyping(prev => ({
              ...prev,
              [otherUser.id]: false
            }));
          }, 3000);
        }
      }, 1000);
    }
  }, [activeConversation, user]);

  const loadMoreMessages = useCallback((conversationId: string) => {
    // For demo, just add some older messages
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const olderMessages: Message[] = [];
    for (let i = 0; i < 5; i++) {
      const sender = conversation.participants[i % 2];
      const receiver = conversation.participants[(i + 1) % 2];
      olderMessages.push({
        id: `msg-old-${Date.now()}-${i}`,
        conversationId,
        senderId: sender.id,
        senderName: sender.name,
        senderRole: sender.role,
        receiverId: receiver.id,
        receiverName: receiver.name,
        receiverRole: receiver.role,
        content: `Older message ${i + 1}`,
        timestamp: new Date(Date.now() - (i + 20) * 3600000),
        isRead: true,
        type: 'text'
      });
    }

    setMessages(prev => [...olderMessages, ...prev]);
  }, [conversations]);

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        isTyping,
        onlineUsers,
        sendMessage,
        createConversation,
        setActiveConversation,
        markAsRead,
        setTyping,
        loadMoreMessages
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};