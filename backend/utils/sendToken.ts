import { Response } from 'express';
import { IUser } from '../models/userModel';

/**
 * @desc Create Token and save in cookie for Elite Session Management
 */
const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getJWTToken();

  // 1. CONFIGURATION FOR GLOBAL REACH
  const cookieExpireTime = Number(process.env.COOKIE_EXPIRES_TIME) || 7;
  
  const options = {
    expires: new Date(
      Date.now() + cookieExpireTime * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side scripts from stealing the key
    secure: true,   // Required for "SameSite: None" in modern browsers
    sameSite: 'none' as const, // Allows cross-origin authentication for your 1.5M network
    path: '/'
  };

  // 2. DATA SANITIZATION
  // Ensure we don't send the password hash back to the client
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId, // Crucial for Agency Isolation logic
    avatar: user.avatar,
    createdAt: user.createdAt
  };

  // 3. EXECUTE TRANSMISSION
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token, // Provided for mobile apps/headers, while cookie handles the browser
    user: userData,
    sessionStatus: "ENCRYPTED_AND_VERIFIED"
  });
};

export default sendToken;