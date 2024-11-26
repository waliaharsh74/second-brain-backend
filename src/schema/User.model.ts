import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,

    },
    password: {
        type: String,
        require: true,

    }

}, { timestamps: true })

const ContentSchema = new mongoose.Schema({
    title: String,
    link: String,
    type: String,
    tags: [String],

    // userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const ContentModel = mongoose.model("Content", ContentSchema);
const User = mongoose.model('users', userSchema)
export { User, ContentModel };
