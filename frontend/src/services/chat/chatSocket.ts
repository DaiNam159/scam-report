import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ChatSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(userId: number) {
    if (this.socket?.connected) {
      return;
    }

    // Disconnect old socket if exists
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(`${SOCKET_URL}/chat`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      // Register user
      this.socket?.emit("register", { userId });

      // Re-attach all listeners after connection
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          this.socket?.on(event, callback as any);
        });
      });
    });

    this.socket.on("disconnect", () => {
      // Socket disconnected
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    // Remove all old listeners for this event first
    if (this.socket) {
      this.socket.off(event);
    }

    // Clear listeners array for this event
    this.listeners.set(event, [callback]);

    // Attach new listener if socket exists
    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
      this.socket?.off(event, callback as any);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  emit(event: string, data: any, callback?: Function) {
    if (this.socket) {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
    }
  }

  sendMessage(receiverId: number, message: string, senderId: number) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.emit(
        "sendMessage",
        { receiverId, message, senderId },
        (response: any) => {
          if (response && response.success) {
            resolve(response.message);
          } else {
            reject(new Error(response?.error || "Failed to send message"));
          }
        }
      );
    });
  }

  getMessages(userId: number, isAdmin: boolean, otherUserId?: number) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      this.emit(
        "getMessages",
        { userId, isAdmin, otherUserId },
        (response: any) => {
          if (response && response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response?.error || "Failed to get messages"));
          }
        }
      );
    });
  }

  markAsRead(userId: number, otherUserId: number) {
    return new Promise((resolve, reject) => {
      this.emit("markAsRead", { userId, otherUserId }, (response: any) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const chatSocket = new ChatSocketService();
