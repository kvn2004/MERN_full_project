import Jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token" });
    }

    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    // ✅ FORCE attach user object
    req.user = { id: decoded.id };

    console.log("Decoded:", decoded);
    console.log("req.user AFTER SET:", req.user);

    next();
  } catch (error) {
    console.error("JWT verify failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
