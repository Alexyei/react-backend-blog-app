import mongoose, {ConnectOptions} from "mongoose";
import config from "../configs/default";


export async function connectDB() {
    let dbUri = config.db.dbUri;

    return mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions)
        .then(() => {
            if (process.env.NODE_ENV !== 'test')
                console.log("Database connected");
        })
        .catch((error) => {
            console.error("db error", error);
            process.exit(1);
        });
}

export async function disconnectDB() {
    try {
        await mongoose.connection.close();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}


