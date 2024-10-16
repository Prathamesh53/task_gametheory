import mongoose from "mongoose";

const Books = new mongoose.Schema({
    date: {
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true,
    },
    court: {
        type: mongoose.Types.ObjectId,
        ref: "court",
        required:true
    }
}, {
    timestamps: true
});

const Book = mongoose.model('book', Books);
export default Book;
