// backend/utils/sendToken.js
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken(); // Method defined in User model

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Days
    httpOnly: true, // Secure: cannot be accessed by JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "None" 
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token
  });
};