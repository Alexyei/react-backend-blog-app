import express, {Express} from "express";
import config from "./configs/default"
import cors from 'cors'
import {connectDB} from "./db/connect";
import errorMiddleware from "./middlewares/errorMiddleware";
import router from "./routes/routes";

const PORT = config.app.port;
const HOST = config.app.host;

const app = express();
app.use(express.json())



app.use(cors({
  credentials: true,
  origin: config.app.client_url
}));
app.use(`/api/${config.app.api_version}/`, router);
app.use(errorMiddleware);


function startListening(app: Express){
  return app.listen(PORT, HOST, () => {
    console.log(`Server started at ${HOST}:${PORT}`);
  })
}


if (process.env.NODE_ENV !== 'test')
  connectDB().then(() => {
        startListening(app)
      }
  )
export default app;