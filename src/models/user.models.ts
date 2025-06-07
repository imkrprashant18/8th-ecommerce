import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
export type Role = 'student' | 'teacher' | 'admin' | 'parent';

export interface IUser extends Document {
        name: string;
        phone: string;
        username: string;
        email: string;
        avatar?: string;
        password: string;
        role: Role;
        faculty?: mongoose.Types.ObjectId;
        fees?: mongoose.Types.ObjectId[];
        parent?: mongoose.Types.ObjectId;
        notices: mongoose.Types.ObjectId[];
        events: mongoose.Types.ObjectId[];
        isBusUser: boolean;
        busUser?: mongoose.Types.ObjectId;
        isHostelUser: boolean;
        refreshToken?: string;
        createdAt: Date;
        updatedAt: Date;

        isPasswordCorrect(password: string): Promise<boolean>;
        generateAccessToken(): string;
        generateRefreshToken(): string;
}

const UserSchema: Schema<IUser> = new Schema(
        {
                name: { type: String, required: true, trim: true },
                username: { type: String, required: true, trim: true, unique: true },
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
                        default: 'admin',
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
                notices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }],
                events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
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
                refreshToken: {
                        type: String,
                },
        },
        {
                timestamps: true,
        }
);

// Pre-save hook to hash password if modified
UserSchema.pre<IUser>('save', async function (next) {
        if (!this.isModified('password')) return next();
        try {
                this.password = await bcrypt.hash(this.password, 10);
                next();
        } catch (err) {
                next(err as any);
        }
});

// Methods
UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
};

// JWT Access Token method
UserSchema.methods.generateAccessToken = function (): string {
        return jwt.sign(
                { id: this._id, role: this.role },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '1d' }
        );
};
// JWT Refresh Token method
UserSchema.methods.generateRefreshToken = function (): string {
        return jwt.sign(
                { id: this._id },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: '7d' }
        );
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User