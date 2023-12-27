require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const userModel = require("../../models/userModel");
const hash = require('../../utils/toHash');
const otp = require('../../utils/sendOtp');
const { sendPassword } = require('../../utils/sendPassword');
const courseModel = require('../../models/courseModel');
const paymentModel = require('../../models/paymentModel');

const createUser = async (req, res) => {
  try {
    const { fullname, email, password, isTeacher } = req.body;
    console.log(req.body);
    const userData = await userModel.findOne({ email: email })

    if(userData){
        res.status(400).json({message: "This username already Exists"});
        return
    }

    const hashedPassword = await hash(password);

    const newUser = userModel({
        fullname,
        email,
        password: hashedPassword,
        role: isTeacher ? 3000 : 2000 
    })

    await newUser.save()
    const options = {
      maxAge: 90 * 1000,
      httpOnly: true,
    };

    const result = await otp.sendOtp({fullname,email});
    res.cookie('hashOtp', result, options);
    res.cookie('id', newUser._id, {httpOnly: true});
    res.status(200).json({message: "Account created successfully"})
  } catch (error) {
    console.log(error);
  }
};

const verifyOtp = async (req, res)=>{
  try {  
    console.log(req.cookies);
    const {hashOtp, id} = req.cookies;
    if(!hashOtp){
      res.status(403).json({message: "OTP is expired"});
      return;
    }
    const {otp} = req.body
    const verified = await bcrypt.compare(otp, hashOtp);
    // console.log(verified);
    if(!verified){
      res.status(403).json({message: "OTP is wrong"});
      return;
    }

    await userModel.findByIdAndUpdate(id, {$set: {isVerify: true}});
    res.status(200).json({message: "OTP verification success"});
  } catch (error) {
    console.log(error);
  }
}

const resendOtp = async (req, res)=>{
  try {

    const userData = await userModel.findById(req.cookies.id)
    console.log(req.cookies);
    const options = {
      maxAge: 90 * 1000,
      httpOnly: true,
    };
    const result = await otp.sendOtp({fullname: userData.fullname, email: userData.email});
    res.cookie('hashOtp', result, options);
    res.status(200).json({message: "Generate otp successfully"})

  } catch (error) {
    console.log(error);
  }
}


const handleLogin = async (req, res)=>{
  try {

    const { email, password} = req.body;
    
    const userData = await userModel.findOne({ email:email })

    if(!userData){
      res.status(400).json({message: "The account is not exist"})
      return
    }

    const passMatch = await bcrypt.compare(password, userData.password);

    if(!passMatch){
      res.status(400).json({message: "The Password is Wrong"})
      return
    }

    if(!userData.isAccess){
      res.status(400).json({message: "The account is banned"})
      return
    }

    const accessToken = jwt.sign(
      {"userId": userData._id},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s'}
    )
    
    const refreshToken = jwt.sign(
      {"userId": userData._id},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d'}
    )

    userData.refreshToken = refreshToken
    await userData.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.status(200).json({role: userData.role, accessToken, fullname: userData.fullname, userId: userData._id, message: "your account is verified"})
    
  } catch (error) {
    console.log(error)
  }
}

const handleGoogleLogin = async (req, res)=>{
  try {
    const {email, picture, name } = req.body.payload;
    const existedUser = await userModel.findOne({email})



    if (!existedUser) {
        console.log("lsdfa");

        const hashPassword = await sendPassword({fullname: name, email})

        const newUser = userModel({
          fullname: name,
          email,
          password: hashPassword,
          isGoogle: true,
        });

        const newUserData = await newUser.save();

        const accessToken = jwt.sign(
          { userId: newUserData._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );

        const refreshToken = jwt.sign(
          { userId: newUserData._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        newUserData.refreshToken = refreshToken
        await newUserData.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        res.status(200).json({role: newUserData.role, accessToken, fullname: newUserData.fullname, userId: newUserData._id, message: "your account is verified"})
        return
    }

    if(!existedUser.isAccess){
      res.status(400).json({message: "The account is banned"})
      return
    }

    const accessToken = jwt.sign(
      {"userId": existedUser._id},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s'}
    )
    
    const refreshToken = jwt.sign(
      {"userId": existedUser._id},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d'}
    )
    
    existedUser.refreshToken = refreshToken
    await existedUser.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    res.status(200).json({role: existedUser.role, accessToken, fullname: existedUser.fullname, userId: existedUser._id, message: "your account is verified"})

  } catch (error) {
    console.log(error);
  }
}

const forgotPassword = async (req, res)=>{
  try {
    const {email} = req.body
    const userData = await userModel.findOne({ email: email })

    if(!userData){
      res.status(400).json({message: "No account exists in the email"});
      return
  }


  const options = {
    maxAge: 90 * 1000,
    httpOnly: true,
  };

  const result = await otp.sendOtp({fullname: userData.fullname,email});
  res.cookie('hashOtp', result, options);
  res.cookie('id', userData._id, {httpOnly: true});
  res.status(200).json({message: "Mail send successfully"})
  } catch (error) {
    console.log(error);
  }
}

const changePassword = async (req, res)=>{
  try {
    console.log("hello");
    const {password, email} = req.body;

    const hashedPassword = await hash(password);

    await userModel.findOneAndUpdate({email},{$set: {password: hashedPassword}})
    res.status(200).json({message: "Password Changed succefully"})
  } catch (error) {
    console.log(error);
  }
}


const handleRefreshToken = async (req, res)=>{
  try {

    const cookies = req.cookies

    if(!cookies?.jwt) return res.sendStatus(401); 
    const refreshToken = cookies.jwt
    
    const userData = await userModel.findOne({ refreshToken: refreshToken })
    if(!userData) return res.sendStatus(403)

    //evalute jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded)=>{
        console.log(!(userData._id.equals(decoded.userId)));
        console.log(userData._id);
        console.log(decoded.userId);
        if(err || !(userData._id.equals(decoded.userId)) ) return res.sendStatus(403);
        const accessToken = jwt.sign(
          {"userId": decoded.userId},
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: '30s'}
        );
        res.json({ accessToken })
      }
    )
    
  } catch (error) {
    console.log(error)
  }
}

const handleLogout = async (req, res)=>{
  try {

    const cookies = req.cookies

    if(!cookies?.jwt) return res.sendStatus(204); //NO content
    const refreshToken = cookies.jwt
    
    // is refreshToken in db
    const userData = await userModel.findOne({ refreshToken: refreshToken })
    if(!userData){
      res.clearCookie('jwt', {httpOnly: true})
      return res.sendStatus(204)
    }

     userData.refreshToken = ""
    await userData.save();

    res.clearCookie('jwt', { httpOnly: true })
    res.sendStatus(204)
    
  } catch (error) {
    console.log(error)
  }
}

const handleSuccessPayment = async (req, res)=>{
  try {
    const {userId, courseId, session_id} = req.query
    const userData = await userModel.findById(userId)
    const course = await courseModel.findById(courseId)
    await courseModel.findByIdAndUpdate(courseId,{
      $addToSet: {users: userData._id}
    })

    const payment = new paymentModel({
      strip_id: session_id,
      course_id: course._id,
      teacher_id: course.teacher,
      amount: course.price,
      user_id: userData._id
    })

    await payment.save();
    res.redirect('http://localhost:5173/user/myCourse');

  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  createUser,
  handleLogin,
  handleRefreshToken,
  handleLogout,
  verifyOtp,
  resendOtp,
  forgotPassword,
  changePassword,
  handleGoogleLogin,
  handleSuccessPayment
};
