import redis from "redis";

const redisClient = redis.createClient();

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const saveOTP = async (email, otp) => {
    await redisClient.setEx(email, 300, otp); // OTP expires in 5 minutes
};

export const validateOTP = async (email, otp) => {
    const storedOTP = await redisClient.get(email);
    return storedOTP === otp;
};
