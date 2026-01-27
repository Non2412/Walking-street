import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    userId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if we link properly, but current app uses string IDs often
        required: true,
    },
    booths: {
        type: [mongoose.Schema.Types.Mixed], // Flexible for now as we don't know exact booth structure
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'payment_pending'],
        default: 'pending',
    },
    paymentSlip: {
        type: String,
    },
    price: {
        type: Number,
    },
    date: {
        type: String, // "YYYY-MM-DD"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
