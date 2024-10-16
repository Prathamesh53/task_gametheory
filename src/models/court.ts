import mongoose from "mongoose";

const Courts = new mongoose.Schema({
    type: String,
    site: {
        type: mongoose.Types.ObjectId,
        ref: "site"
    }
}, {
    timestamps: true
});

const Court = mongoose.model('court', Courts);
export default Court;
 