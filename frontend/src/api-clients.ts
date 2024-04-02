import { RegisterFormData } from "./pages/Register";
import { LoginFormData } from "./pages/Signin";
import { HotelType } from "../../backend/src/models/hotel"; //importing hotelType from backend, that is strange

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; //added || '' here because we are using single server, that is same port for backend and

export const Signin = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include", // include any https cookies along with the request
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include", // include any https cookies along with the request
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

// in case of form data, we are not sending form data with the type HotelFormData
//While FormData can handle simple key-value pairs (strings), it doesn't directly support sending complex types or custom objects along with it. Therefore, attempting to specify a type for FormData beyond basic key-value pairs might not align with its intended usage.
export const addHotel = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include", // include any https cookies along with the request
    body: formData,
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
    method: "GET",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during Sign out");
  }
};
