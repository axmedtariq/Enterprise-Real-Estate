import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  property: mongoose.Types.ObjectId;
  lastMessage?: string;
  unreadCount: Map<string, number>; // Track unread per user
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  lastMessage: { type: String },
  unreadCount: { 
    type: Map, 
    of: Number, 
    default: {} 
  },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// Indexing for rapid retrieval during high-traffic sessions
ChatSchema.index({ participants: 1 });

export default mongoose.model<IChat>('Chat', ChatSchema);