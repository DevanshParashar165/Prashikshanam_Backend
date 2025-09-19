import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullname: {
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
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        phoneNo : {
            type : String,
            required : true,
            minlength:10
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
    try {
        if (!this.isModified("password")) return;
        if (typeof this.password !== "string") {
            this.password = String(this.password);
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

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

userSchema.methods.generateRefreshToken = function () {
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
