import mongoose from 'mongoose';
import getModelName from 'Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('cart');

const cart = new Schema(
  {
    productId : {
      ref : 'products',
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      require: true
    },
    userId: {
      ref: 'users',
      type: mongoose.Schema.Types.ObjectId,
      require: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure virtual fields are serialised.
cart.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

// rename name Example to singular Model
export default mongoose.models[singularName] ||
  mongoose.model(pluralName, cart);
