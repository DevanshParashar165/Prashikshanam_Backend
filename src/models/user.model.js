import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["student", "admin", "recruiter"],
            default: "student",
        },
        education: [
            {
                degree: String,
                branch: String,
                college: String,
                startYear: Number,
                endYear: Number,
                cgpa: Number,
            },
        ],
        skills: [
            {
                type: String,
            },
        ],
        sectorInterests: [
            {
                type: String,
            },
        ],
        locationPreferences: [
            {
                type: String,
            },
        ],
        experiences: [
            {
                title: String,
                company: String,
                duration: String,
                description: String,
            },
        ],
        projects: [
            {
                title: String,
                description: String,
                techStack: [String],
                link: String,
            },
        ],

        resume: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        github: {
            type: String,
        },
        portfolio: {
            type: String,
        },
        savedInternships: [
            {
                internshipId: mongoose.Schema.Types.ObjectId,
                savedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        appliedInternships: [
            {
                internshipId: mongoose.Schema.Types.ObjectId,
                appliedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        recommendationHistory: [
            {
                internshipId: mongoose.Schema.Types.ObjectId,
                recommendedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
