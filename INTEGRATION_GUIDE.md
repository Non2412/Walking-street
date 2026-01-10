# Walking Street Market - Booking System

A Next.js application integrated with the Market API for managing market stall bookings.

## Features

✅ **Browse Bookings** - View all market stall bookings in real-time  
✅ **Create Bookings** - Submit new booking requests with validation  
✅ **Manage Status** - Approve or reject bookings (with admin token)  
✅ **Delete Bookings** - Remove bookings from the system (with admin token)  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Error Handling** - Comprehensive error messages and loading states  

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **API**: Market API (suppachai0/market-api)
- **Styling**: CSS Modules
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ or npm
- pnpm package manager (recommended)

### Installation

1. **Clone the repository**
```bash
cd Walking-street
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Environment Variables**

The `.env.local` file is already configured to use the live API:

```env
NEXT_PUBLIC_API_URL=https://market-api-n9paign16-suppchai0-projects.vercel.app/api
```

**For local development** (if running market-api locally):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. **Run the development server**
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

### Services (`src/services/api.ts`)

The API service provides methods for:

```typescript
// Get all bookings
getBookings(): Promise<Booking[]>

// Get single booking
getBookingById(id: string): Promise<Booking>

// Create new booking
createBooking(booking: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>): Promise<Booking>

// Update booking (requires admin token)
updateBooking(id: string, updates: Partial<Booking>, token?: string): Promise<Booking>

// Delete booking (requires admin token)
deleteBooking(id: string, token?: string): Promise<{ deletedCount: number }>

// Admin login
adminLogin(email: string, password: string): Promise<{ token: string }>

// User signup
userSignup(username: string, email: string, password: string, fullName: string): Promise<{ token: string; user: any }>

// User login
userLogin(email: string, password: string): Promise<{ token: string; user: any }>
```

### Hooks (`src/hooks/useBookings.ts`)

Custom React hook for managing bookings:

```typescript
const {
  bookings,           // Array of all bookings
  loading,            // Loading state
  error,              // Error message
  refetch,            // Manual refetch function
  addBooking,         // Create new booking
  updateBookingStatus, // Update booking status
  removeBooking       // Delete booking
} = useBookings();
```

### Components

#### BookingForm (`src/components/BookingForm.tsx`)
- Submit new booking requests
- Form validation
- Error/success messages

#### BookingList (`src/components/BookingList.tsx`)
- Display all bookings in a grid
- Status badges (pending, approved, rejected)
- Admin actions (approve, reject, delete)

## API Endpoints

The application connects to the following endpoints from market-api:

### Booking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/:id` | Get single booking |
| PUT | `/api/bookings/:id` | Update booking status (requires token) |
| DELETE | `/api/bookings/:id` | Delete booking (requires token) |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/user-login` | User login |

## Booking Data Structure

```typescript
interface Booking {
  _id?: string;
  storeName: string;        // Store name
  ownerName: string;        // Owner name
  phone: string;            // 10-digit phone number
  email: string;            // Valid email
  shopType: 'food' | 'clothing' | 'goods' | 'other';
  stallNumber: string;      // Stall/booth number
  bookingDate: string;      // ISO date string
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string;           // Additional notes
  createdAt?: string;       // Creation timestamp
  updatedAt?: string;       // Update timestamp
}
```

## Usage Examples

### Create a Booking

```typescript
const { addBooking } = useBookings();

const handleSubmit = async () => {
  await addBooking({
    storeName: "Coffee Shop",
    ownerName: "John Doe",
    phone: "0812345678",
    email: "john@example.com",
    shopType: "food",
    stallNumber: "A01",
    bookingDate: "2025-01-20"
  });
};
```

### Update Booking Status (Admin)

```typescript
const { updateBookingStatus } = useBookings();

// Approve booking
await updateBookingStatus(bookingId, 'approved', adminToken);

// Reject booking
await updateBookingStatus(bookingId, 'rejected', adminToken);
```

### Admin Operations

For admin operations (update/delete), you need to:

1. Obtain an admin token via `/api/auth/login`
2. Pass the token to the update/delete functions
3. Default credentials (from market-api docs):
   - Email: `admin@sisaket.go.th`
   - Password: `admin123`

```typescript
import { adminLogin } from '@/services/api';

const { token } = await adminLogin('admin@sisaket.go.th', 'admin123');
```

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main page component
│   ├── page.module.css       # Page styles
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── BookingForm.tsx       # Booking form component
│   ├── BookingForm.module.css
│   ├── BookingList.tsx       # Bookings list component
│   └── BookingList.module.css
├── hooks/
│   └── useBookings.ts        # Custom hook for bookings
├── services/
│   └── api.ts                # API service methods
└── ...
.env.local                     # Environment configuration
```

## Building for Production

```bash
npm run build
npm run start
```

Or deploy directly to Vercel:

```bash
npm install -g vercel
vercel
```

## Troubleshooting

### API Connection Error
- Check if `NEXT_PUBLIC_API_URL` is correct in `.env.local`
- Verify the market-api server is running and accessible
- Check browser console for CORS errors

### Bookings Not Loading
- Open browser DevTools (F12)
- Go to Network tab
- Check if API requests are successful
- Look for error messages in Console tab

### Form Validation Failing
- Phone number must be exactly 10 digits
- Email must be valid format
- All required fields must be filled
- Stall number is required

### Admin Operations Not Working
- Ensure you have a valid admin token
- Default credentials: admin@sisaket.go.th / admin123
- Token expires after 24 hours

## API Documentation

For more details about the market-api, visit:
https://github.com/suppachai0/market-api

Key API features:
- MongoDB Atlas integration
- JWT authentication
- Booking management system
- Admin dashboard
- Docker support

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Market API base URL | Yes | https://market-api-n9paign16-suppchai0-projects.vercel.app/api |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and can be accessed in client-side code.

## License

MIT

## Support

For issues or questions:
- Check the [market-api repository](https://github.com/suppachai0/market-api)
- Review the API_GUIDE.md in market-api repo
- Open an issue on GitHub

---

**Created**: January 10, 2026  
**Project**: Walking Street Market Booking System  
**Integrated with**: [Market API by suppachai0](https://github.com/suppachai0/market-api)
