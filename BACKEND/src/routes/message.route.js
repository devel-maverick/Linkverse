const express=require('express');
const router=express.Router();
router.get('/send',(req,res)=>{
    res.send('message send route')
})

module.exports=router;