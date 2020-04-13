import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String }
});
