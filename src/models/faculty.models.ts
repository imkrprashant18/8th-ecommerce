import mongoose, { Document, Schema } from 'mongoose';

interface Grade {
        name: string;    // e.g., "Grade 10"
        section: string; // e.g., "A"
}

export interface IFaculty extends Document {
        name: string;
        grade: Grade;
        departmentHead?: string;
        description?: string;
        createdAt: Date;
        updatedAt: Date;
}

const GradeSchema = new Schema<Grade>({
        name: { type: String, required: true },
        section: { type: String },
}, { _id: false });

const FacultySchema = new Schema<IFaculty>(
        {
                name: { type: String, required: true, unique: true },
                grade: { type: GradeSchema, required: true },
                departmentHead: { type: String },
                description: { type: String },
        },
        { timestamps: true }
);



export default mongoose.model<IFaculty>('Faculty', FacultySchema);