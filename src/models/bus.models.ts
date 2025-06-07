// BusUserModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBusUser extends Document {
        route: string;
        timing: string;
        pickupPoint?: string;
        dropPoint?: string;
        contactNumber?: string;
        isActive: boolean;
        notes?: string;
        createdAt: Date;
        updatedAt: Date;
}

const BusUserSchema = new Schema<IBusUser>(
        {
                route: { type: String, required: true },
                timing: { type: String, required: true },
                pickupPoint: { type: String },
                dropPoint: { type: String },
                contactNumber: { type: String },
                isActive: { type: Boolean, default: true },
                notes: { type: String },
        },
        { timestamps: true }
);

const BusUserModel = mongoose.model<IBusUser>('BusUser', BusUserSchema);
export default BusUserModel;
