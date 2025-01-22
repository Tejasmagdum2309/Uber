import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 0 }, // TTL index, expiry will be dynamically set
        
    }
});

const BlacklistToken = mongoose.model('BlacklistToken', blackListTokenSchema);

export default BlacklistToken