const router = require("express").Router();
const mongoose = require("mongoose");

const Foodtruck = require("../models/Foodtruck.model");
const Event = require("../models/Event.model");
const fileUploader = require("../config/");

//  POST /api/foodtrucks  -  Creates a new truck
router.post("/", (req, res, next) => {
  const { name, category, imageUrl, owner, comments } = req.body;

  const newFoodtruck = {
    name: name,
    category: category,
    image: imageUrl,
    owner: owner,
    comments: comments,
  };

  Foodtruck.create(newFoodtruck)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("error creating a new Foodtruck", err);
      res.status(500).json({
        message: "error creating a new Foodtruck",
        error: err,
      });
    });
});

// GET /api/foodtrucks -  Retrieves all of the foodtrucks
router.get("/", (req, res, next) => {
  Foodtruck.find()
    .populate("events")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of foodtrucks", err);
      res.status(500).json({
        message: "error getting list of foodtrucks",
        error: err,
      });
    });
});

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});

// GET /api/foodtrucks/:foodtruckId  -  Retrieves one foodtrucks
router.get("/:foodtruckId", (req, res, next) => {
  const { foodtruckId } = req.params;

  Foodtruck.findById(foodtruckId)
    .populate("events")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of foodtrucks", err);
      res.status(500).json({
        message: "error getting list of foodtrucks",
        error: err,
      });
    });
});

// PUT /api/foodtrucks/:foodtruckId  -  Updates a specific foodtrucks by id
router.put("/:foodtruckId", (req, res, next) => {
  const { foodtruckId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(foodtruckId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const newDetails = {
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    owner: req.body.owner,
    comments: req.body.comments,
  };

  Foodtruck.findByIdAndUpdate(foodtruckId, newDetails, { new: true })
    .then((updatedFoodtruck) => res.json(updatedFoodtruck))
    .catch((err) => {
      console.log("error updating Foodtruck", err);
      res.status(500).json({
        message: "error updating Foodtruck",
        error: err,
      });
    });
});

// DELETE /api/foodtruck/:foodtruckId  -  Delete a specific Foodtruck by id
router.delete("/:foodtruckId", (req, res, next) => {
  const { foodtruckId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(foodtruckId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Foodtruck.findByIdAndRemove(foodtruckId)
    .then((deletedFoodtruck) => {
      return Event.deleteMany({ _id: { $in: deletedFoodtruck.event } }); // delete all events assigned to that foodtruck
    })
    .then(() =>
      res.json({
        message: `Foodtruck with id ${foodtruckId} & all associated events were removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("error deleting Foodtruck", err);
      res.status(500).json({
        message: "error deleting Foodtruck",
        error: err,
      });
    });
});

module.exports = router;
