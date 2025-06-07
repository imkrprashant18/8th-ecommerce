import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
        title: string;
        description: string;
        date: Date;
        createdBy: mongoose.Types.ObjectId;  // Ref to User who created the notice
        targetRoles: ('student' | 'teacher' | 'admin' | 'parent')[]; // Which roles this notice is for
        createdAt: Date;
        updatedAt: Date;
}

const NoticeSchema: Schema<INotice> = new Schema(
        {
                title: { type: String, required: true, trim: true },
                description: { type: String, required: true, trim: true },
                date: { type: Date, required: true },
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
        },
        {
                timestamps: true,
        }
);

export default mongoose.model<INotice>('Notice', NoticeSchema);
