import { Schema, model, Document } from 'mongoose';

export interface IMJson extends Document {
    key: string;
    data: Record<string, unknown>;
    description?: string;
    updatedAt: Date;
    createdAt: Date;
}

const mJsonSchema = new Schema<IMJson>(
    {
        key: { type: String, required: true, unique: true, index: true, trim: true },
        data: { type: Object, required: true },
        description: { type: String, trim: true }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'mjson'
    }
);

export const mJson = model<IMJson>('mJson', mJsonSchema);
