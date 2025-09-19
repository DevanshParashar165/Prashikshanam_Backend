import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true, // e.g., Frontend Developer Intern
      trim: true,
    },
    company: {
      name: { type: String, required: true },
      website: { type: String },
      location: { type: String, required: true }, // e.g., Bangalore, Remote
      logo: { type: String }, // Cloudinary or company logo URL
    },

    // Internship Details
    description: {
      type: String,
      required: true,
    },
    responsibilities: [String], // e.g., "Develop frontend", "Work with APIs"
    requirements: [String], // e.g., "React.js", "Node.js", "MongoDB"

    // Skills for Recommendation Matching
    requiredSkills: [
      {
        type: String, // e.g., Python, Machine Learning
      },
    ],
    sector: {
      type: String, // e.g., Web Development, AI/ML
      required: true,
    },

    // Duration & Stipend
    duration: {
      type: String, // e.g., "3 Months"
    },
    stipend: {
      amount: { type: Number }, // e.g., 10000
      type: { type: String, enum: ["Paid", "Unpaid", "Performance-based"] },
      currency: { type: String, default: "INR" },
    },

    // Application Details
    applicationDeadline: {
      type: Date,
      required: true,
    },
    openings: {
      type: Number,
      default: 1,
    },

    // Links
    applyLink: {
      type: String, // External or internal application link
    },

    // Tracking Applicants
    applicants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["Applied", "Shortlisted", "Rejected", "Hired"],
          default: "Applied",
        },
      },
    ],

    // Recommendation Related
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // If recruiters/admins post internships
    },
    recommendedTo: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        recommendedAt: { type: Date, default: Date.now },
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

export const Internship =  mongoose.model("Internship", internshipSchema);
