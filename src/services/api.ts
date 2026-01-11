/**
 * API Services - Market API Integration
 */

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://market-api-n9paign16-suppchai0-projects.vercel.app/api';

export interface Booking {
  _id?: string;
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  shopType: 'food' | 'clothing' | 'goods' | 'other';
  stallNumber: string;
  bookingDate: string;
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ========================================
// BOOKINGS API (สำหรับใช้ในอนาคต)
// ========================================

export const getBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    const data: ApiResponse<Booking[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch bookings');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getBookingById = async (id: string): Promise<Booking> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    const data: ApiResponse<Booking> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch booking');
    }

    return data.data!;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const createBooking = async (booking: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    const data: ApiResponse<Booking> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create booking');
    }

    return data.data!;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBooking = async (
  id: string,
  updates: Partial<Booking>,
  token?: string
): Promise<Booking> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });

    const data: ApiResponse<Booking> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update booking');
    }

    return data.data!;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};

export const deleteBooking = async (id: string, token?: string): Promise<{ deletedCount: number }> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data: ApiResponse<{ deletedCount: number }> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to delete booking');
    }

    return data.data!;
  } catch (error) {
    console.error(`Error deleting booking ${id}:`, error);
    throw error;
  }
};

// ========================================
// AUTH API
// ========================================
export const adminLogin = async (email: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: ApiResponse<{ token: string; user: { email: string }; expiresIn: string }> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Login failed');
    }

    return { token: data.data!.token };
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};


export const userSignup = async (
  username: string,
  email: string,
  password: string,
  fullName: string
): Promise<{ token: string; user: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, fullName }),
    });

    const data: ApiResponse<{ token: string; user: any; expiresIn: string }> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Signup failed');
    }

    return { token: data.data!.token, user: data.data!.user };
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};


export const userLogin = async (email: string, password: string): Promise<{ token: string; user: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: ApiResponse<{ token: string; user: any; expiresIn: string }> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Login failed');
    }

    return { token: data.data!.token, user: data.data!.user };
  } catch (error) {
    console.error('Error during user login:', error);
    throw error;
  }
};
