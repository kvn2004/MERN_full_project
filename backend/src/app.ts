import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cycleRoutes from "./routes/cycle.routes";
import partnerRoutes from "./routes/partner.routes";
import notificationRoutes from "./routes/notification.routes";
import cookieParser from "cookie-parser";


const app = express();
app.use(cors());
app.use(express.json()); // it parses incoming JSON requests and puts the parsed data in req.body 
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cycle", cycleRoutes);
app.use("/partners", partnerRoutes);
app.use("/notifications", notificationRoutes);

export default app;
