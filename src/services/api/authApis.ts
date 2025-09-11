import { userAxiosInstance } from "../axiosInstance";

export const userLogin = async (formData: {
    "userName": string;
    "emailId": string; 
    "password": string;
    "isWhatsapp": boolean;
    "isSubscribe": boolean;
}) => {
    try {
        const response = await userAxiosInstance.post(
          "/api/user/login",
          formData
      );
        return response.data;
      } catch (error) {
          throw error;
      }
  };