const router=require('express').Router()
const userModel=require('../model/userModel')
const passport = require('passport')
const {user,homepage,login,logout,googlesignUp,redirect}=require('../controller/userController')
const { model } = require('mongoose')

router.post('/create',user)
router.post('/homepage',homepage)
router.post('/login',login)
router.post('/logout',logout)
router.get('/signUpGoogle',googlesignUp)
router.get('/google/callback',redirect)
router.get("/auth/google/success",async(req,res)=>{
 try {
    if(req.user){
        // console.log(req.user)
        // req.user._json=models
        email=req.user._json.email
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({message:'user with this email '+ email + " already exist"})
        }else if(!existingUser){
            const user=await userModel.create({
                fullName:req.user._json.name,
                picture:req.user._json.picture,
                email:req.user._json.email,
                sub:req.user._json.sub
    
        
        
            })
            return res.status(201).json({message:'successfully created',user})
        }

 
    }else
  
    // console.log(req.use._json)
   return res.status(400).json('something went wrong')

    
 } catch (error) {
    res.status(500).json(error.message)
 }
})

module.exports=router     