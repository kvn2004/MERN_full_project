import  Jwt, { JwtPayload }  from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = decoded.id;
        next();
    } catch (error) {
        console.log("Error verifying token:", error);
        return res.status(401).json({ error: "Invalid token" });
    }

}