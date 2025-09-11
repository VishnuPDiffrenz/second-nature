import { userAxiosInstance } from "../axiosInstance";

export const createUser = async (formData: {
    "firstname": string;
    "lastname": string;
    "emailId": string;
    "contactNo": string;
    "password": string;
}) => {
    
  try {
      const response = await userAxiosInstance.post(
        "/api/user/createUser",
        formData
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserDetails = async (userId: string) => {
  try {
      const response = await userAxiosInstance.get(
        `/api/user/getCustomerById/${userId}`
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (
  userId: string,
  formData: {
    firstname: string;
    lastname: string;
    emailId: string;
    alternativeEmail: string;
    contactNo: string;
    alternativeMobile: string;
  }
) => {

  try {
    const response = await userAxiosInstance.put(
      `/api/user/${userId}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
  confirmNewPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  try {
    const response = await userAxiosInstance.post(
      `/api/user/changePassword/${userId}`,
      {
        currentPassword,
        newPassword,
        confirmNewPassword,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendEmailForPassword = async (
  {
    emailId,
  } : {
    emailId: string;
  }
) => {
  

try {
    const response = await userAxiosInstance.post(
      `/api/user/sendEmailforPassword`,
      { emailId: emailId }
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const forgotPassword = async (
  {
    formData,
  } : {
    formData: {
      userId: string;
      newPassword: string;
      confirmNewPassword: string;
    }
  }
) => {
  

try {
    const response = await userAxiosInstance.post(
      `/api/user/forgotPassword/${formData.userId}`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const emailVerification = async (
  {
    formData,
  } : {
    formData: {
      name: string;
      email: string;
    }
  }
) => {
  

try {
    const response = await userAxiosInstance.post(
      `/api/user/emailVerification`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const verifyOtp = async (
  {
    formData,
  } : {
    formData: {
      email: string;
      contactNo: string;
      otp: string;
      isWhatsapp: boolean;
      isSubscribe: boolean;
    }
  }
) => {
  

try {
    const response = await userAxiosInstance.post(
      `/api/user/verifyOtp`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};