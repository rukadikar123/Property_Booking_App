import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { MongodbConnect } from "./config/MongoDbConnect.js";
import User from "./Model/User.schema.js";
import Booking from "./Model/Booking.schema.js";
import Property from "./Model/Listing.schema.js";

dotenv.config();

// Function to seed the database
const seed = async () => {
  try {
    await MongodbConnect();

    // Clear existing data
    await Booking.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();

    // Hash password for demo users
    const password = await bcrypt.hash("19857656", 10);

    // Create a host user
    const hostUser = await User.create({
      fullname: "John Host",
      email: "host@example.com",
      password,
      isHost: true,
    });

    // Create a regular user
    const normalUser = await User.create({
      fullname: "Alice Guest",
      email: "user@example.com",
      password,
      isHost: false,
    });

    // Create two sample property listings
    const properties = await Property.insertMany([
      {
        title: "Cozy Cottage",
        description: "A nice place in the hills.",
        location: "Shimla",
        price: 2000,
        images: ["https://example.com/img1.jpg"],
        host: hostUser._id,
      },
      {
        title: "Beach House",
        description: "Ocean view and peaceful evenings.",
        location: "Goa",
        price: 4500,
        images: ["https://example.com/img2.jpg"],
        host: hostUser._id,
      },
    ]);

    // Create a booking by the normal user
    const booking = await Booking.create({
      property: properties[0]._id,
      user: normalUser._id,
      checkIn: new Date("2025-07-24"),
      checkOut: new Date("2025-07-25"),
      totalPrice: 4000,
      status: "ongoing",
    });

    console.log("✅ Seed data inserted");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seed();
