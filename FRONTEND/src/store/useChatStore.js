import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true
    ,
    toggleSound: () => {
        const newSoundState = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabbled", !get().isSoundEnabled)
        set({ isSoundEnabled: newSoundState })
    },
    setActiveTab: (tab) => {
        set({ activeTab: tab })
    },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
    getAllContacts: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/contacts")
            set({ allContacts: res.data })

        }
        catch (err) {
            toast.error(error.response.data.message)

        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/chats")
            set({ chats: res.data })
        }
        catch (err) {
            toast.error(error.response.data.message)

        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        } catch (err) {
            toast.error(error.response?.data?.message || "something went wrong")

        } finally {
            set({ isMessagesLoading: false })

        }

    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages, chats } = get();
        const { authUser } = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            senderId: authUser.id,
            receiverId: selectedUser.id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };

        // Optimistic update for messages
        set(state => ({
            messages: [...state.messages, optimisticMessage]
        }));
        set(state => {
            const chatIndex = state.chats.findIndex(c => c.id === selectedUser.id);
            if (chatIndex === -1) {
                const newChat = {
                    ...selectedUser,
                    lastMessage: optimisticMessage,
                    unreadCount: 0
                };
                return { chats: [newChat, ...state.chats] };
            } else {
                const updatedChats = state.chats.map(chat => {
                    if (chat.id === selectedUser.id) {
                        return { ...chat, lastMessage: optimisticMessage };
                    }
                    return chat;
                });
                return {
                    chats: updatedChats.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0))
                };
            }
        });

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser.id}`, messageData);
            set(state => ({
                messages: state.messages.map(msg =>
                    msg.id === tempId ? res.data : msg
                )
            }));
            set(state => {
                const updatedChats = state.chats.map(chat => {
                    if (chat.id === selectedUser.id) {
                        return { ...chat, lastMessage: res.data };
                    }
                    return chat;
                });
                return { chats: updatedChats.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)) };
            });

        } catch (error) {
            set(state => ({
                messages: state.messages.filter(msg => msg.id !== tempId)
            }));
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
    subscribeToMessage: () => {
        const { selectedUser, isSoundEnabled } = get()
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");

        socket.on("newMessage", async (newMessage) => {
            if (get().selectedUser && newMessage.senderId.toString() === get().selectedUser.id.toString()) {
                set(state => ({
                    messages: [...state.messages, newMessage]
                }));
            } else {
                if (isSoundEnabled) {
                    const notificationSound = new Audio("/sounds/notification.mp3");
                    notificationSound.play().catch((e) => console.log("Audio Failed:", e));
                }
            }
            set(state => {
                let chatExists = false;
                const updatedChats = state.chats.map(chat => {
                    if (chat.id === newMessage.senderId) {
                        chatExists = true;
                        const isChatActive = get().selectedUser?.id === chat.id;
                        return {
                            ...chat,
                            lastMessage: newMessage,
                            unreadCount: isChatActive ? 0 : (chat.unreadCount || 0) + 1
                        };
                    }
                    if (chat.id === get().selectedUser?.id && newMessage.senderId.toString() === get().authUser.id.toString()) {
                        return {
                            ...chat,
                            lastMessage: newMessage
                        };
                    }
                    return chat;
                });
                if (!chatExists && newMessage.senderId !== get().authUser.id) {
                    get().getMyChatPartners();
                }

                return { chats: updatedChats.sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0)) };
            });
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    }
}));