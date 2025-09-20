import axios from "axios";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/apiResponse.js";

const getCandidateRecommendation = asyncHandler(async(req,res)=>{
    const candidateData = req.body;

    // Send data to Flask ML model
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/recommend/candidate",
      candidateData
    );

    // Return the ML model's response back to frontend
    return res.status(200)
              .json(
                new ApiResponse(200,flaskResponse.data,"Recommendations fetched succesfully")
              )
})

export {getCandidateRecommendation}