var express = require('express');
var router = express.Router();
const admins = require('../Schemas/Admin.schema')
const users = require('../Schemas/User.schema')
const multer = require('multer')

router.get('/', async (req, res, next) => {
  const getAdmins = await admins.find();
  res.send(getAdmins)
});

router.post('/addAdmin', async (req,res,next) => {
  const {
    name, 
    username, 
    email, 
    password,
    phoneNumber,
    address,
    country,
    profilePhoto,
    bio,
  } = req.body
  
  const checkUsernameAdmin = await admins.findOne({
    username
  })

  const checkEmailAdmin = await admins.findOne({
    email
  })

  const checkUsernameUser = await users.findOne({
    username
  })

  const checkEmailUser = await users.findOne({
    email
  })

  if(checkUsernameAdmin || checkUsernameUser) {
    res.send({checkUsername: true, message: 'Username already exists'})
  }else if(checkEmailAdmin || checkEmailUser) {
    res.send({checkEmail: true, message: 'Email already exists'})
  }else {
    const newAdmin = await admins.create({
      name, 
      username, 
      email, 
      password,
      phoneNumber,
      address,
      country,
      profilePhoto,
      bio,
    })
    res.send({createAccount: true, message: "The account has been created", adminId: newAdmin._id, DataAccount: {_id: newAdmin._id, case: newAdmin.case}})
  }
})

router.put('/adminUpdateAccount', async (req,res,next) => {
  const {_id, phoneNumber, country, address} = req.body;

  const updateAccount = await admins.findByIdAndUpdate(_id, {
    phoneNumber,
    country,
    address
  })
  res.send({update: true, meesage: "Successful update", DataAccount: {_id: updateAccount._id, case: updateAccount.case}})
})


const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, './ProfilePicture')
  },
  filename: (req,file,cb) => {
    cb(null, new Date().getSeconds() + file.originalname)
  }
})

const uploads = multer({
  storage
}).single('profilePicture')

router.put('/adminUpdateProfilePicture', uploads, async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const { _id } = req.body;
  const filename = req.file.filename;
  const profilePicture = url + '/Profile-Picture/' + filename;
  try {
    await admins.findByIdAndUpdate(_id, { profilePicture });
    res.send({ update: true, message: 'Successful update' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to update profile picture' });
  }
});

router.post('/loginAdmin', async (req,res,next) => {
  const {username, email, password} = req.body
  
  const checkEmailOrUsername = await admins.findOne({
    username
  })

  if(checkEmailOrUsername) {
    const checkusername = await admins.findOne({
      username
    })
    if(checkusername) {
      const checkAccount = await admins.findOne({
        username,
        password
      })
      if(checkAccount) {
        res.send({isLogin: true, userId: checkusername._id, isLoginEmail: true, isLoginPassword: true, DataAccount: {_id: checkAccount._id, case: checkAccount.case}})
      }else {
        res.send({isLoginPassword: false, message: 'Please check your password', isLoginEmail: true})
      }
    }else {
      res.send({isLogin: false, message: 'Please check your username', isLoginPassword: true})
    }
    
  } else if(email) {
    const checkEmail = await admins.findOne({
      email
    })
    if(checkEmail) {
      const checkAccount = await usadminsers.findOne({
        email,
        password
      })
      if(checkAccount) {
        res.send({isLogin: true, userId: checkEmail._id, isLoginEmail: true, isLoginPassword: true, DataAccount: {_id: checkAccount._id, case: checkAccount.case}})
      }else {
        res.send({isLoginPassword: false, message: 'Please check your password', isLoginEmail: true})
      }
    }else {
      res.send({isLoginEmail: false, message: 'Please check your email', isLoginPassword: true})
    }
  }
})


module.exports = router;
