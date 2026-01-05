import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cycleRoutes from "./routes/cycle.routes";
import partnerRoutes from "./routes/partner.routes";
import notificationRoutes from "./routes/notification.routes";
import cookieParser from "cookie-parser";
import "./cron/notification.cron";
import chatRoutes from "./routes/chat.routes";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL, // e.g. https://care-her.vercel.app
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());


app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cycle", cycleRoutes);
app.use("/partners", partnerRoutes);
app.use("/notifications", notificationRoutes);
app.use("/chat", chatRoutes);

export default app;
