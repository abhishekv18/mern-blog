import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
         'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    isAdmin:{
      type:Boolean,
      default:false,
    },
    // boolean means true or false kuch bhi 
  },
  // it save the time of creation and updation
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;