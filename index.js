const express=require("express")
var jwt = require('jsonwebtoken');
require('dotenv').config()
const mongoose=require("mongoose")
const {connection}=require("./db")
const bcrypt = require("bcrypt");
const port=process.env.port
const app=express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("This is a Home page")
})
const {UserModel}=require("./models/userModel")
const {FlightModel}=require("./models/flightModel")
const {BookingModel}=require("./models/bookingModel")


// register user route 
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email }); // Use findOne with an object to match properties
        if (user) {
            res.status(400).json({ msg: "Email already exists" });
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                const newUser = new UserModel({ name, email, password: hash });
                await newUser.save();
                res.status(201).json({ msg: "New user has been registered" });
            });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
 
//   login user route 
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id }, 'masai', { expiresIn: '1h' });
                    res.status(201).json({ msg: "Login successful !!", token: token });
                } else {
                    res.status(400).json({ msg: "Password Mismatch !!" });
                }
            });
        } else {
            res.status(400).json({ msg: "Please create an account first !!" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});



//   3 .  getting list of all flights 

app.get("/flights",async(req,res)=>{
try {
    const flights=await FlightModel.find()
    res.status(200).json(flights);

} catch (error) {
    res.status(400).json({ msg: error.message });
}
})

// 4 . getting perticular flight with id 

app.get("/flights/:id",async(req,res)=>{
    try {
        const flights= await FlightModel.findById(req.params.id)

        res.status(200).json(flights);
    
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
    })

    // 5 .  users to add new flights to the system.

    app.post("/flights",async(req,res)=>{
     try {
        const{airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price}=req.body;
        const flight=new FlightModel({
            airline,
            flightNo,
            departure,
            arrival,
            departureTime,
            arrivalTime,
            seats,
            price
        })

        await flight.save()
        res.status(201).json(flight)
     } catch (error) {
        res.status(400).json({ msg: error.message });
     }
    })

    // 6. Update the detalis of flight by ID 

    app.put("/flights/:id",async(req,res)=>{
    try {
        const flight=await FlightModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!flight) return res.status(400).json({error:"Flight Not Found"})
        res.status(204).json({msg:"Flight updated Sucessfully !!"})
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
    })

    // 7 . Delete a Flight 
    app.delete("/flights/:id",async(req,res)=>{
       try {
        const flight=await FlightModel.findByIdAndDelete(req.params.id)
        if(!flight) return res.status(400).json({error:"Flight Not Found"})
        res.status(204).json({msg:"Flight Deleted Sucessfully !!"})
       } catch (error) {
        res.status(400).json({ msg: error.message });
       }
    })

    // 8 . Book a flight 

    app.post("/booking",async(req,res)=>{
   try {
     const {userId,flightId}=req.body
     const user=await UserModel.findById(userId)
     const flight=await FlightModel.findById(flightId)

     if(!user || !flight)
     {
        res.status(400).json({ msg: "User or flight Not found" });
     }

     const booking=new BookingModel({user:userId,flight:flightId})
     await booking.save()
     res.status(201).json({msg:"Booking Sucessfully !!"})

   } catch (error) {
    res.status(400).json({ msg: error.message });
   }
    })

    // 9 . getting the data Dashboard 

    app.get("/dashboard",async(req,res)=>{
        try {
            const bookings=await BookingModel.find().populate("UserModel")
            res.json(bookings)

        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    })

    // 10 . Update the booking 

    app.put("/dashboard/:id",async(req,res)=>{
        try {
            const booking=await BookingModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
            if(!booking) return res.status(400).json({error:"Booking Not Found"})
            res.status(204).json(booking)

        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    })

    // 11 . Delete a Booking 

    app.delete("/dashboard/:id",async(req,res)=>{
        try {
            const booking=await BookingModel.findByIdAndDelete(req.params.id)
            if(!booking) return res.status(400).json({error:"Booking Not Found"})
            res.status(202).json({msg:"Booking Deleted Sucessfully !"})

        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    })
app.listen(port,async()=>{
    try {
        await connection
        console.log("Connected to Database !!")
        console.log(`Server is live on ${port}`)
    } catch (error) {
        console.log(error)
    } 
})

