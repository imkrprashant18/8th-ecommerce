import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
        title: string;
        description: string;
        startDate: Date;
        endDate?: Date;
        location?: string;
        createdBy: mongoose.Types.ObjectId; // Reference to User who created the event
        targetRoles: ('student' | 'teacher' | 'admin' | 'parent')[];
        faculty?: mongoose.Types.ObjectId; // Reference to Faculty if event is faculty-specific
        createdAt: Date;
        updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
        {
                title: { type: String, required: true, trim: true },
                description: { type: String, required: true, trim: true },
                startDate: { type: Date, required: true },
                endDate: { type: Date },
                location: { type: String, trim: true, default: '' },
                createdBy: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true,
                },
                targetRoles: [
                        {
                                type: String,
                                enum: ['student', 'teacher', 'admin', 'parent'],
                                required: true,
                        },
                ],
                faculty: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Faculty',
                        required: false,
                },
        },
        {
                timestamps: true,
        }
);

export default mongoose.model<IEvent>('Event', EventSchema);
