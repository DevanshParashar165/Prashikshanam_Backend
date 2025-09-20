import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getCandidateRecommendation } from "../controllers/recommendation.controller.js";

const recommendRouter = Router();

recommendRouter.route('/').post(verifyJWT,getCandidateRecommendation)

export default recommendRouter