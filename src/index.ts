import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { mongoConnect } from './db/mongoConnect';
import { User, ContentModel } from './schema/User.model'
import { userMiddleware } from './middleware/userMiddleware';
const app = express();
const port = 3000
app.use(express.json())
app.use(cors())
interface SearchQuery {
    userId: String,
    type?: String
}
app.post('/api/v1/signup', async (req, res) => {
    console.log("object");
    try {
        const { email, password } = req?.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) res.status(403).json({
            message: "User already exists"
        })
        const passwordSalt = process.env.PASSWORD_SALT || ""
        const hashedPassword = await bcrypt.hash(password, passwordSalt)
        await User.create({ email, password: hashedPassword })
        res.json({
            msg: "Signup Success",
            status: 200
        })
    }
    catch (error) {
        console.log(error);
        // res.status(400).json({
        //     error
        // })
    }

})
app.post('/api/v1/signin', async (req, res) => {
    try {
        const { email, password } = req?.body;
        const passwordSalt = process.env.PASSWORD_SALT || ""
        const hashedPassword = await bcrypt.hash(password, passwordSalt)
        const existingUser = await User.findOne({ email, password: hashedPassword });

        if (existingUser) {
            const token = jwt.sign({
                id: existingUser._id
            }, process.env.JWT_PASSWORD || " ")

            res.json({
                token
            })
        } else {
            res.status(403).json({
                message: "Incorrrect credentials"
            })
        }
    } catch (error) {
        console.log(error);

    }
})


app.post("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        console.log("object", req?.userId);
        const link = req.body.link;
        const type = req.body.type;
        const tags = req.body.tags
        const content = req.body.content
        await ContentModel.create({
            link,
            type,
            title: req.body.title,
            // @ts-ignore
            userId: req.userId,
            tags,
            content
        })

        res.json({
            message: "Content added"
        })
    } catch (error) {
        console.log(error);

    }

})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    try {


        // @ts-ignore
        const userId = req.userId;
        const { type } = req?.query
        let searchQuery: SearchQuery = {
            userId: userId,

        }
        if (typeof type === 'string') {
            searchQuery.type = type
        }
        const content = await ContentModel.find(searchQuery).populate("userId", "email")
        // console.log("object", content);
        res.json({
            content
        })
    } catch (error) {
        console.log("err", error);
        res.status(400).json({
            error
        })
    }
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    try {


        const contentId = req.body.contentId;
        console.log("contentId", contentId);

        await ContentModel.deleteMany({
            _id: contentId,
            // @ts-ignore
            userId: req.userId
        })

        res.json({
            message: "Deleted"
        })
    } catch (error) {

    }
})
app.post('api/v1/brain/share', (req, res) => { })
app.post('api/v1/brain:share', (req, res) => { })
mongoConnect()

app.listen(port, () => {
    console.log(`server is listning on port ${port}`);
})