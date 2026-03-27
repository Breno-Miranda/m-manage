import { Schema, model, Document } from 'mongoose';

export interface IMLog extends Document {
    action: string; // e.g., 'LOGIN', 'CREATE_USER', 'UPDATE_BLOG'
    details: string; // Description of what happened
    user?: string; // User email or ID
    level: 'info' | 'warning' | 'error';
    ip?: string;
    userAgent?: string;
    path?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

const mLogSchema = new Schema<IMLog>(
    {
        action: { type: String, required: true },
        details: { type: String, required: true },
        user: { type: String },
        level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
        ip: { type: String },
        userAgent: { type: String },
        path: { type: String },
        metadata: { type: Object }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'mlogs'
    }
);

export const mLogs = model<IMLog>('mLogs', mLogSchema);
