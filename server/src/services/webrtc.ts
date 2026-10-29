import { Server as SocketIOServer, Socket } from 'socket.io';

export function setupWebRTCSignaling(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [WebRTC] Peer connected: ${socket.id}`);

    // Join clinical consultation room
    socket.on('join-room', ({ roomId, userId, userName, role }: { roomId: string; userId: string; userName: string; role: string }) => {
      socket.join(roomId);
      console.log(`🏥 [WebRTC] ${userName} (${role}) joined consultation room: ${roomId}`);
      
      // Notify other participants in the room
      socket.to(roomId).emit('peer-joined', {
        socketId: socket.id,
        userId,
        userName,
        role
      });
    });

    // Relay SDP Offer
    socket.on('offer', ({ roomId, offer }: { roomId: string; offer: any }) => {
      socket.to(roomId).emit('offer', {
        from: socket.id,
        offer
      });
    });

    // Relay SDP Answer
    socket.on('answer', ({ roomId, answer }: { roomId: string; answer: any }) => {
      socket.to(roomId).emit('answer', {
        from: socket.id,
        answer
      });
    });

    // Relay ICE Candidate
    socket.on('ice-candidate', ({ roomId, candidate }: { roomId: string; candidate: any }) => {
      socket.to(roomId).emit('ice-candidate', {
        from: socket.id,
        candidate
      });
    });

    // In-call chat message
    socket.on('chat-message', ({ roomId, message, senderName }: { roomId: string; message: string; senderName: string }) => {
      io.to(roomId).emit('chat-message', {
        id: `msg-${Date.now()}`,
        senderName,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    // Leave room
    socket.on('leave-room', ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('peer-left', { socketId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log(`❌ [WebRTC] Peer disconnected: ${socket.id}`);
    });
  });
}
