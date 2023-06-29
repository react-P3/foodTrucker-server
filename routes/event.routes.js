const router = require("express").Router();
// const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const Foodtruck = require("../models/Foodtruck.model");

//  POST /api/events  -  Creates a new event
router.post("/", (req, res, next) => {
    const { name, description, foodtruckId, location, address, time, date, comments } = req.body;

    const newEventDetails = { 
        name: name, 
        description: description, 
        location: location,
        address: address,
        time: time, 
        date: date,
        comments: comments,
        foodtruck: foodtruckId
    };

    Event.create(newEventDetails)
        .then(eventFromDB => {
            return Foodtruck.findByIdAndUpdate(foodtruckId, { $push: { events: eventFromDB._id } });
        })
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new event", err);
            res.status(500).json({
                message: "error creating a new event",
                error: err
            });
        })
});


// GET /api/events -  Retrieves all of the events
router.get("/", (req, res, next) => {
    Event.find()
        .populate("events")
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of events", err);
            res.status(500).json({
                message: "error getting list of events",
                error: err
            });
        })
});


// PUT /api/events/:eventId  -  Updates a specific event by id
router.put("/:eventId", (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    const newDetails = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        address: req.body.address,
        time: req.body.time,
        date: req.body.date,
        comments: req.body.comments
    }


    Event.findByIdAndUpdate(eventId, newDetails, { new: true })
        .then((updatedEvent) => res.json(updatedEvent))
        .catch(err => {
            console.log("error updating Event", err);
            res.status(500).json({
                message: "error updating Event",
                error: err
            });
        })
});

// DELETE /api/event/:eventId  -  Delete a specific Event by id
router.delete('/:eventId', (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findByIdAndDelete(eventId)
    .then(() => {
      res.redirect("/foodtrucks");
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;


