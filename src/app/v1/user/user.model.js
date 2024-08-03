import mongoose from 'mongoose';
import getModelName from 'Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('user');

const user = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    profilePic: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ['admin', 'general'],
      default: 'general',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure virtual fields are serialised.
user.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

// rename name Example to singular Model
export default mongoose.models[singularName] ||
  mongoose.model(pluralName, user);
