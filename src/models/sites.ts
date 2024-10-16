import mongoose from "mongoose";

const Sites = new mongoose.Schema({
    name: String,
    location: String
}, {
    timestamps: true
});

const Site = mongoose.model("site", Sites);
export default Site;
