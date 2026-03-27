import { Schema, model, Document } from 'mongoose';

export interface IMLead extends Document {
    name: string;
    email: string;
    phone: string;
    company?: string;
    service: string;
    budget?: string;
    message: string;
    source: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    createdAt: Date;
    updatedAt: Date;
}

const mLeadSchema = new Schema<IMLead>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, index: true },
        phone: { type: String, required: true, trim: true },
        company: { type: String, trim: true },
        service: { type: String, required: true, trim: true, index: true },
        budget: { type: String, trim: true },
        message: { type: String, required: true, trim: true },
        source: { type: String, required: true, default: 'website:expertise', index: true },
        status: {
            type: String,
            enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
            default: 'new',
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'mleads'
    }
);

export const mLead = model<IMLead>('mLead', mLeadSchema);
