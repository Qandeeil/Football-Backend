var express = require('express');
var router = express.Router();
const users = require('../Schemas/User.schema')
const admins = require('../Schemas/Admin.schema')
const multer = require('multer')

router.get('/', async (req, res, next) => {
  const getUsers = await users.find();
  res.send(getUsers)
});

router.post('/addUser', async (req,res,next) => {
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

  const checkUsernameUser = await users.findOne({
    username
  })

  const checkEmailUser = await users.findOne({
    email
  })

  const checkUsernameAdmin = await admins.findOne({
    username
  })

  const checkEmailAdmin = await admins.findOne({
    email
  })

  if(checkUsernameUser || checkUsernameAdmin) {
    res.send({checkUsername: true, message: 'Username already exists'})
  }else if(checkEmailUser || checkEmailAdmin) {
    res.send({checkEmail: true, message: 'Email already exists'})
  }else {
    const newUser = await users.create({
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
    res.send({createAccount: true, message: "The account has been created", adminId: newUser._id, DataAccount: {_id: newUser._id, case: newUser.case}})
  }
})

router.put('/userUpdateAccount', async (req,res,next) => {
  const {_id, phoneNumber, country, address} = req.body;

  const updateAccount = await users.findByIdAndUpdate(_id, {
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

router.put('/userUpdateProfilePicture', uploads, async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const { _id } = req.body;
  const filename = req.file.filename;
  const profilePicture = url + '/Profile-Picture/' + filename;
  try {
    await users.findByIdAndUpdate(_id, { profilePicture });
    res.send({ update: true, message: 'Successful update' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to update profile picture' });
  }
});

router.post('/loginUser', async (req,res,next) => {
  const {username, email, password} = req.body
  
  const checkEmailOrUsername = await users.findOne({
    username
  })

  if(checkEmailOrUsername) {
    const checkusername = await users.findOne({
      username
    })
    if(checkusername) {
      const checkAccount = await users.findOne({
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
    const checkEmail = await users.findOne({
      email
    })
    if(checkEmail) {
      const checkAccount = await users.findOne({
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
