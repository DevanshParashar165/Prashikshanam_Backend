import { User } from "../models/user.model.js";
import { ApiError } from "../utilities/apiError.js";
import { ApiResponse} from "../utilities/apiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

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

const loginUser = asyncHandler(async (req, res) => {
    //req body ->data
    const { username, email, password } = req.body
    console.log((username || email)," : Login successfully!!!!!")
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    }


    //check for username or email in database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    //find the user
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    //password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }
    //access and refresh token

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send cookies

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user : loggedInUser,
            accessToken,
            refreshToken,
            message : "User logged In successfully"

        })
    )

})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $unset : {refreshToken : 1}//this removes the fields from document
    })
    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "None",
        path : "/"
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged Out")
    )
})

export {registerUser,loginUser,logoutUser}