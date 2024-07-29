// import express from 'express';
// import colors from 'colors';
// import dotenv from 'dotenv';
// import morgan from 'morgan';
const cors=require('cors');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoutes=require('./routes/authRoutes');
const categoryRoutes=require('./routes/categoryRoutes');
const productRoutes=require('./routes/productRoute');
const app=express();
dotenv.config();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.get("/",(req,res)=>{
    res.send({
        message:'welcome to website'
    })
})
app.use('/api/v1/auth',authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`.bgCyan.white);
})