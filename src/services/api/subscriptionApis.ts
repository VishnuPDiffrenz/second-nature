import { subscriptionAxiosInstance } from "../axiosInstance";

export const getBreedDetails = async (catOrDog: string) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/${catOrDog}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCrossBreedDetails = async (catOrDog: string) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/${catOrDog}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const createAddress = async (formData: {
    user_id: string;
    shippingAddress: Array<{
      firstName: string;
      lastName: string;
      contactNo: string;
      address: string;
      aptSuite: string;
      municipality: string;
    }>;
    billingAddress: Array<{
      firstName: string;
      lastName: string;
      contactNo: string;
      address: string;
      aptSuite: string;
      municipality: string;
      useDifferentBilling?: boolean;
    }>;
    
}) => {
  

try {
    const response = await subscriptionAxiosInstance.post(
      "/api/subscription/createAddress",
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getAllPlan = async () => {
  
try {
    const response = await subscriptionAxiosInstance.post(
      "/api/subscription/plan/getAllplan",
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getAllProtein = async () => {
  
try {
    const response = await subscriptionAxiosInstance.post(
      "/api/subscription/protein/getAllProtein",
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getAllBowl = async () => {
  
try {
    const response = await subscriptionAxiosInstance.post(
      "/api/subscription/bowl/getAllbowl",
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getPrice = async (formData: {
    weight: number;
    proteinType: string;
    activityLevel: string;
    bowlSize: string;
    planType: string;
}) => {
  
try {
    const response = await subscriptionAxiosInstance.post(
      "/api/subscription/setting/getPrice",
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getAddressById= async (userId: string) => {
  
try {
    const response = await subscriptionAxiosInstance.get(
      `/api/subscription/getAddressByUserId/${userId}`,
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getPromoOffer= async (promoCode: string) => {
  
try {
    const response = await subscriptionAxiosInstance.get(
      `/api/subscription/promocode/getpromocodeByCode/${promoCode}`,
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const createPet = async (formData: {
    user_id: string;
    name: string;
    type: string;
    gender: string;
    location: string;
    dateOfBirth: string;
    ageMonth: number;
    ageYear: number;
    breed: string;
    crossBreeds: Array<string>;
    allergiesOrIntolerances: Array<string>;
    eatingPreferences: Array<string>;
    activityLevel: string;
    currentWeight: number;
    targetWeight: number;
    plan: {
      type: string;
      duration: string;
      price: number;
      protein: string;
      bowlSize: string;
    }
}) => {
  
try {
    const response = await subscriptionAxiosInstance.post(
      "api/subscription/createPet",
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const createSubscription = async (formData: {
    user_id: string;
    account: {
      firstName: string;
      lastName: string;
      email: string;
      mobileNumber: string;
      password: string;
    },
    shippingDetails: {
      firstName: string;
      lastName: string;
      contactNo: string;
      address: string;
      aptSuite: string;
      municipality: string;
    },
    billingDetails: {
      firstName: string;
      lastName: string;
      contactNo: string;
      address: string;
      aptSuite: string;
      municipality: string;
      useDifferentBilling: boolean;
    },
    subscriptiondate: string;
    promoCode: string;
    subscribeToOffers: boolean;
    pets: Array<{
      petId: string;
      name: string;
      type: string;
      gender: string;
      location: string;
      dateOfBirth?: string;
      ageMonth?: number;
      ageYear?: number;
      breed?: string;
      crossBreeds?: Array<string>;
      activityLevel?: string;
      currentWeight: number;
      targetWeight: number;
      plan: {
        type: string;
        duration: string;
        price: number;
        protein: string;
        bowlSize: string;
        planStatus: string;
        isChangedprotein: boolean;
        isDowngrade: boolean;
        isUpgrade: boolean;
      };
    }>;
    payment: {
      method: string;
      cardNumber: string;
      cardExpiry: string;
      cardCVV: string;
      totalAmount: number;
    }
    isDeleted: boolean;
}) => {
  
try {
    const response = await subscriptionAxiosInstance.post(
      "/api/subscription/createSubscription",
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const updateAddressById = async (
  addressId: string,
  subId: string,
  type: string,
  formData: {
    shippingAddress: {
      firstName: string;
      lastName: string;
      contactNo: string;
      address: string;
      aptSuite: string;
      municipality: string;
    },
    billingAddress: {
      firstName: string;
      lastName: string;
      contactNo: string;
      address: string;
      aptSuite: string;
      municipality: string;
      useDifferentBilling?: boolean;
    }
  }
) => {

  try {
    const response = await subscriptionAxiosInstance.put(
      `/api/subscription/updateAddressById/${addressId}/${subId}/${type}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPetDetailsByUserId = async (userId: string) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/getPetByUserId/${userId}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePetByPetId = async (
  {
    petId,
    formData,
  } : {
    petId: string;
    formData: {
      user_id: string;
      name: string;
      type: string;
      gender: string;
      location: string;
      dateOfBirth: string;
      ageMonth: number;
      ageYear: number;
      breed: string;
      crossBreeds: Array<string>;
      activityLevel: string;
      currentWeight: number;
      targetWeight: number;
      plan: {
        type: string;
        duration: string;
        price: number;
        protein: string;
        bowlSize: string;
      }
    }
  }
) => {
  
try {
    const response = await subscriptionAxiosInstance.put(
      `/api/subscription/updatePetById/${petId}`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getSubscriptionDetailsByUserId = async (userId: string) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/getSubscriptionByUserId/${userId}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubscriptionDetailsByUserIdAndPetId = async (userId: string, petId: string) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/getSubscriptionById/${userId}/${petId}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getInvoiceBySubIdAndPetId = async (subId: string, petId: string) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/invoiceGeneration/${subId}/${petId}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeProteinBySubIdPetIdUserId = async (
  {
    subId,
    petId,
    userId,
    proteinType,
  } : {
    subId: string;
    petId: string;
    userId: string;
    proteinType: string;
  }
) => {
  

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/changeProtein/${subId}/${petId}/${userId}`,
      { "proteinType": proteinType }
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const upgradePlanBySubIdPetIdUserId = async (
  {
    subId,
    petId,
    userId,
    upgradeReason,
  } : {
    subId: string;
    petId: string;
    userId: string;
    upgradeReason: string;
  }
) => {
  

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/upgradePlan/${subId}/${petId}/${userId}`,
      upgradeReason
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const downgradePlanBySubIdPetIdUserId = async (
  {
    subId,
    petId,
    userId,
    downgradeReason,
  } : {
    subId: string;
    petId: string;
    userId: string;
    downgradeReason: string;
  }
) => {
  

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/downgradePlan/${subId}/${petId}/${userId}`,
      downgradeReason
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const pausePlanBySubIdPetIdUserId = async (
  {
    subId,
    petId,
    userId,
    formData,
  } : {
    subId: string;
    petId: string;
    userId: string;
    formData: {
      pauseReason: string;
      weeks: number;
      startDate: string;
      endDate: string;
    }
  }
) => {
  

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/pausePlan/${subId}/${petId}/${userId}`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const cancelPlanBySubIdPetIdUserId = async (
  {
    subId,
    petId,
    userId,
    formData,
  } : {
    subId: string;
    petId: string;
    userId: string;
    formData: {
      cancelReason: string;
    }
  }
) => {
  

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/cancelPlan/${subId}/${petId}/${userId}`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const restartPlanBySubIdPetIdUserId = async (
  {
    subId,
    petId,
    userId,
  } : {
    subId: string;
    petId: string;
    userId: string;
  }
) => {

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/restartPlan/${subId}/${petId}/${userId}`,
      {}
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const createFaq = async (
  {
    formData
  } : {
    formData: {
      firstName: string;
      lastName: string;
      emailId: string;
      contactNo: string;
      message: string;
      isActive: boolean;
      isDeleted: boolean;
      createdOn: string;
      modifiedOn: string;
    };
  }
) => {

try {
    const response = await subscriptionAxiosInstance.post(
      `/api/subscription/faq/createfaq`,
      formData
  );
    return response.data;
  } catch (error) {
      throw error;
  }
};

export const getAllOffers = async () => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/promocode/getAllOffers`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAllergies = async () => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/getPetAllergies`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllEatingPreferences = async () => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/getEatingPreferences`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubscriptionHistoryById = async ({ userId, petId }: { userId: string; petId: string }) => {
  try {
      const response = await subscriptionAxiosInstance.get(
        `/api/subscription/getSubscriptionHistoryById/${userId}/${petId}`,
    );
      return response.data;
    } catch (error) {
        throw error;
    }
};