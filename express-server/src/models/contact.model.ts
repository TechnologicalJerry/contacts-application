import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface ContactInput {
  user: UserDocument["_id"];
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  address?: string;
  category?: string;
  tags?: string[];
  avatar?: string;
  notes?: string;
  favorite?: boolean;
}

export interface ContactDocument extends ContactInput, mongoose.Document {
  contactId: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: true,
      unique: true,
      default: () => `contact_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    address: { type: String, trim: true },
    category: { type: String, default: "Personal", trim: true },
    tags: { type: [String], default: [] },
    avatar: { type: String, trim: true },
    notes: { type: String, trim: true },
    favorite: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Add compound index for user + contactId for fast lookup
contactSchema.index({ user: 1, contactId: 1 });
contactSchema.index({ user: 1, createdAt: -1 });

// Add text index for search across contacts
contactSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
  phone: "text",
  company: "text",
});

const ContactModel = mongoose.model<ContactDocument>("Contact", contactSchema);

export default ContactModel;
