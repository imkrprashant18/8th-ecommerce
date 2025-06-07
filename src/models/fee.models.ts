import mongoose, { Document, Schema } from 'mongoose';

// Role type
export type Role = 'student' | 'teacher' | 'admin' | 'parent';

// Interfaces for related models
export interface IUser extends Document {
        name: string;
        phone: string;
        email: string;
        avatar?: string;
        password: string;
        role: Role;
        faculty?: mongoose.Types.ObjectId;         // Ref to Faculty document
        fees?: mongoose.Types.ObjectId[];          // Ref to Fee documents
        parent?: mongoose.Types.ObjectId;           // Ref to User (parent)
        notices: mongoose.Types.ObjectId[];         // Ref to Notice
        events: mongoose.Types.ObjectId[];          // Ref to Event
        isBusUser: boolean;
        busUser?: mongoose.Types.ObjectId;          // Ref to BusUser document
        isHostelUser: boolean;
        createdAt: Date;
        updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
        {
                name: { type: String, required: true, trim: true },
                phone: {
                        type: String,
                        required: true,
                        unique: true,
                        match: [/^\d{10}$/, 'Phone number must be 10 digits'],
                },
                email: { type: String, required: true, unique: true, lowercase: true },
                avatar: { type: String, default: '' },
                password: { type: String, required: true, minlength: 6 },
                role: {
                        type: String,
                        enum: ['student', 'teacher', 'admin', 'parent'],
                        required: true,
                        default: 'student',
                },
                faculty: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Faculty',
                        required: function (this: IUser) {
                                return this.role === 'student' || this.role === 'teacher';
                        },
                },
                fees: [
                        {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: 'Fee',
                        },
                ],
                parent: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: function (this: IUser) {
                                return this.role === 'student';
                        },
                },
                notices: [
                        { type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }
                ],
                events: [
                        { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
                ],
                isBusUser: {
                        type: Boolean,
                        default: false,
                },
                busUser: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'BusUser',
                        required: function (this: IUser) {
                                return this.isBusUser === true;
                        },
                },
                isHostelUser: {
                        type: Boolean,
                        default: false,
                },
        },
        {
                timestamps: true,
        }
);

export default mongoose.model<IUser>('User', UserSchema);
