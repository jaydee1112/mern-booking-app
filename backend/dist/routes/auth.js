"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/login', [
    (0, express_validator_1.check)('email', 'Email is required').isString(),
    (0, express_validator_1.check)('password', 'Password is required').isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array() });
    }
    try {
        const user = yield user_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).json({ message: 'Invalid Credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid Credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000,
        });
        res.status(200).json({ userId: user.id });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something Went Wrong' });
    }
}));
router.get('/validate-token', auth_1.default, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
router.post('/logout', (req, res) => {
    res.cookie('auth_token', '', {
        expires: new Date(0),
    });
    res.send();
});
exports.default = router;
/*This route handler is for handling a POST request to the '/logout' endpoint. It logs out a user by clearing the 'auth_token' cookie and sending an empty response.

Here's a breakdown of the code:

router.post('/logout', ...) - Defines a route handler for handling POST requests to the '/logout' endpoint.

(req: Request, res: Response) => { ... } - Arrow function that takes a request (req) and response (res) object as parameters.

res.cookie('auth_token', '', { expires: new Date(0) }) - Clears the 'auth_token' cookie by setting its value to an empty string and setting its expiration date to a past date (specifically, January 1, 1970, which is commonly used to expire cookies).

res.send() - Sends an empty response back to the client to indicate that the logout was successful.

This code snippet is typically used in an Express.js application to handle user logout functionality by clearing the authentication token cookie. */
