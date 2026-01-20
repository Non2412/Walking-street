/**
 * User Schema for MongoDB
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'กรุณากรอกอีเมล'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'กรุณากรอกอีเมลที่ถูกต้อง',
            ],
        },
        password: {
            type: String,
            required: [true, 'กรุณากรอกรหัสผ่าน'],
            minlength: 6,
            select: false,
        },
        name: {
            type: String,
            required: [true, 'กรุณากรอกชื่อ'],
        },
        fullName: {
            type: String,
        },
        username: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: 'users',
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Delete existing model to avoid conflict during development
if (mongoose.models.User) {
    delete mongoose.models.User;
}

export default mongoose.model('User', userSchema);
