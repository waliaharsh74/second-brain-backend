import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true,
        minLength: 3,
        maxLength: 10
    },
    password: {
        type: String,
        require: true,
        unique: true,
        minLength: 3,
        maxLength: 10
    }

}, { timestamps: true })

const ContentSchema = new mongoose.Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const ContentModel = mongoose.model("Content", ContentSchema);
const User = mongoose.model('users', userSchema)
export { User, ContentModel };
