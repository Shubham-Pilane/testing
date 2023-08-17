const mongoose=require("mongoose")

const flightSchema=mongoose.Schema({
  
    airline: String,
    flightNo: String,
    departure: String,
    arrival: String,
    departureTime: String,
    arrivalTime: String,
    seats: Number,
    price: Number
},{
    versionKey:false
})
// {
//     "airline": "Indigo",
//     "flightNo": "12",
//     "departure": "yes",
//     "arrival": "yes",
//     "departureTime": 10/10/2000,
//     "arrivalTime": 12/10/2023,
//     "seats": 100,
//     "price": 5000
// }

const FlightModel=mongoose.model("Flight",flightSchema)

module.exports={
    FlightModel
}