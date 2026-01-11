# API Integration Examples

This file demonstrates how to use the integrated market-api in your Walking Street project.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Advanced Examples](#advanced-examples)
3. [Error Handling](#error-handling)
4. [Admin Operations](#admin-operations)

## Basic Usage

### Using the useBookings Hook (Recommended)

```typescript
// In any React component
import { useBookings } from '@/hooks/useBookings';

export default function MyComponent() {
  // Hook automatically fetches bookings on mount
  const { bookings, loading, error, addBooking } = useBookings();

  // Display bookings
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.storeName}</h3>
          <p>Owner: {booking.ownerName}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using API Service Directly

```typescript
// In any function or component
import { getBookings, createBooking } from '@/services/api';

// Get all bookings
const allBookings = await getBookings();
console.log(allBookings);

// Create a new booking
const newBooking = await createBooking({
  storeName: "Thai Restaurant",
  ownerName: "Somchai",
  phone: "0812345678",
  email: "somchai@example.com",
  shopType: "food",
  stallNumber: "B03",
  bookingDate: "2025-02-01"
});
console.log(newBooking);
```

## Advanced Examples

### Example 1: Create a Booking from a Modal

```typescript
'use client';

import { useState } from 'react';
import { createBooking } from '@/services/api';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const booking = await createBooking({
        storeName: formData.get('storeName') as string,
        ownerName: formData.get('ownerName') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        shopType: formData.get('shopType') as any,
        stallNumber: formData.get('stallNumber') as string,
        bookingDate: formData.get('bookingDate') as string,
      });

      console.log('Booking created:', booking);
      setIsOpen(false);
      // Trigger refetch or notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Booking Form</button>
      
      {isOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <input name="storeName" placeholder="Store Name" required />
            <input name="ownerName" placeholder="Owner Name" required />
            <input name="phone" placeholder="Phone" required />
            <input name="email" type="email" placeholder="Email" required />
            <select name="shopType" required>
              <option value="food">Food</option>
              <option value="clothing">Clothing</option>
              <option value="goods">Goods</option>
              <option value="other">Other</option>
            </select>
            <input name="stallNumber" placeholder="Stall Number" required />
            <input name="bookingDate" type="date" required />
            
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
            <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </>
  );
}
```

### Example 2: Fetch and Display a Single Booking

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getBookingById } from '@/services/api';
import { Booking } from '@/services/api';

export default function BookingDetail({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div>
      <h1>{booking.storeName}</h1>
      <p>Owner: {booking.ownerName}</p>
      <p>Phone: {booking.phone}</p>
      <p>Email: {booking.email}</p>
      <p>Shop Type: {booking.shopType}</p>
      <p>Stall: {booking.stallNumber}</p>
      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p>Status: <span style={{
        color: booking.status === 'approved' ? 'green' : 
               booking.status === 'rejected' ? 'red' : 'orange'
      }}>{booking.status || 'pending'}</span></p>
    </div>
  );
}
```

### Example 3: Search and Filter Bookings

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getBookings } from '@/services/api';
import { Booking } from '@/services/api';

export default function BookingSearch() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const bookings = await getBookings();
      setAllBookings(bookings);
      setFiltered(bookings);
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = allBookings;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(b =>
        b.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter(b => b.status === statusFilter);
    }

    setFiltered(result);
  }, [searchTerm, statusFilter, allBookings]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by store name, owner, or email..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <p>Found {filtered.length} bookings</p>

      {filtered.map(booking => (
        <div key={booking._id}>
          <h3>{booking.storeName}</h3>
          <p>{booking.ownerName} - {booking.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
import { createBooking } from '@/services/api';

async function handleCreateBooking(bookingData: any) {
  try {
    const booking = await createBooking(bookingData);
    console.log('Success:', booking);
    // Show success message
    showNotification('Booking created successfully!', 'success');
  } catch (error) {
    // Handle different error types
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        showNotification('Network error. Check your internet connection.', 'error');
      } else if (error.message.includes('Invalid')) {
        showNotification('Invalid data. Please check your inputs.', 'error');
      } else {
        showNotification(`Error: ${error.message}`, 'error');
      }
    } else {
      showNotification('An unexpected error occurred', 'error');
    }
  }
}
```

## Admin Operations

### Admin Login and Operations

```typescript
'use client';

import { useState } from 'react';
import { adminLogin, updateBooking, deleteBooking } from '@/services/api';

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@sisaket.go.th');
  const [password, setPassword] = useState('admin123');

  const handleLogin = async () => {
    try {
      const { token: adminToken } = await adminLogin(email, password);
      setToken(adminToken);
      console.log('Logged in as admin');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    if (!token) {
      console.error('No admin token');
      return;
    }

    try {
      const updated = await updateBooking(
        bookingId,
        { status: 'approved' },
        token
      );
      console.log('Booking approved:', updated);
    } catch (err) {
      console.error('Failed to approve booking:', err);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!token) {
      console.error('No admin token');
      return;
    }

    try {
      const result = await deleteBooking(bookingId, token);
      console.log('Booking deleted:', result);
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  return (
    <div>
      {!token ? (
        <div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>Logged in as admin</p>
          <button onClick={() => setToken(null)}>Logout</button>
          {/* Admin operations here */}
        </div>
      )}
    </div>
  );
}
```

### Batch Operations

```typescript
import { updateBooking } from '@/services/api';

// Approve multiple bookings
async function approvePendingBookings(
  bookingIds: string[],
  token: string
) {
  try {
    const results = await Promise.all(
      bookingIds.map(id =>
        updateBooking(id, { status: 'approved' }, token)
      )
    );
    console.log(`Approved ${results.length} bookings`);
    return results;
  } catch (error) {
    console.error('Batch operation failed:', error);
    throw error;
  }
}
```

## Type Safety

### Using TypeScript Interfaces

```typescript
import { Booking, ApiResponse } from '@/services/api';

// Function with type safety
function processBooking(booking: Booking): void {
  console.log(`Processing ${booking.storeName}`);
  console.log(`Status: ${booking.status || 'pending'}`);
}

// Async function with return type
async function getAndProcessBookings(): Promise<void> {
  const bookings: Booking[] = await getBookings();
  bookings.forEach(processBooking);
}
```

## Testing in Browser Console

You can test the API directly from the browser console:

```javascript
// Get all bookings
fetch('https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings')
  .then(r => r.json())
  .then(d => console.log(d))

// Create a booking
fetch('https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeName: "Test Store",
    ownerName: "Test Owner",
    phone: "0812345678",
    email: "test@example.com",
    shopType: "food",
    stallNumber: "Z99",
    bookingDate: "2025-02-01"
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

---

For more information, see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
