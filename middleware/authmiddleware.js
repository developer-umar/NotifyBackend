
import jwt from "jsonwebtoken"
export const protect = (req, res, next) => {



    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized " })
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user ={ id: decoded.id};          ///jab user verify ho gya to ham ne ek naya pobject daala reust me req.user usme id attribute daal dia smjhe 
        next();



    } catch (error) {
        return res.status(401).json({ message: "Token expired" });

    }
}