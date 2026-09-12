import mongoose, { Model } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  password: string;
  lastLogin?: Date | undefined;
  isVerified: boolean;
  resetPasswordToken?: string | undefined;
  resetPasswordExperiresAt?: Date | undefined;
  verificationToken?: string | undefined;
  verificationTokenExpiresAt?: Date | undefined;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExperiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
