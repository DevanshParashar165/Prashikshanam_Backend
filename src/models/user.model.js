import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Authentication Info
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
      select: false, // Exclude password from queries by default
    },

    // Role (Student, Admin, Recruiter)
    role: {
      type: String,
      enum: ["student", "admin", "recruiter"],
      default: "student",
    },

    // Academic Details
    education: [
      {
        degree: String, // e.g., B.Tech, B.Sc, M.Tech
        branch: String, // e.g., CSE, IT
        college: String,
        startYear: Number,
        endYear: Number,
        cgpa: Number,
      },
    ],

    // Skills & Interests for Recommendations
    skills: [
      {
        type: String, // e.g., JavaScript, Python, Data Science
      },
    ],
    sectorInterests: [
      {
        type: String, // e.g., Web Development, AI/ML, Cyber Security
      },
    ],

    // Location Preferences for Internship
    locationPreferences: [
      {
        type: String, // e.g., Delhi, Bangalore, Remote
      },
    ],

    // Work Experience / Projects
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

    // Resume & Profile Links
    resume: {
      type: String, // Cloudinary/Drive link
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

    // Recommendation System Specific
    savedInternships: [
      {
        internshipId: mongoose.Schema.Types.ObjectId, // Reference to Internship collection
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

    // Metadata
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

export const User = mongoose.model("User", userSchema);
