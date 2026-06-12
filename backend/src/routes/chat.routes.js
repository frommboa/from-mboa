import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
} from '../controllers/chat.controller.js';

const router = express.Router();

// Send message
router.post('/messages', authenticateToken, sendMessage);

// Get conversation with user
router.get('/conversations/:userId', authenticateToken, getConversation);

// Get all conversations
router.get('/conversations', authenticateToken, getConversations);

// Mark message as read
router.put('/messages/:messageId/read', authenticateToken, markAsRead);

export default router;
