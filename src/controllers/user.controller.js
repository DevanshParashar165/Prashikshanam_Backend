import { User } from "../models/user.model.js";
import { ApiError } from "../utilities/apiError.js";
import { ApiResponse} from "../utilities/apiResponse.js";
import { asyncHandler } from "../utilities/asyncHndler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating refresh and access token, Error : ${error.message}`)
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {fullname,username,email, password ,phoneNo} = req.body
    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }
    const user = await User.create({
        fullname,
        username,
        email,
        password,
        phoneNo
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);
     if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }
     return res.status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken,options)
              .json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export {registerUser}