const express = require('express');
const router = express.Router();
const Person = require('../Models/PersonSchema');

// Create and Save a Record of a Model:

router.post('/newperson', async (req, res) => {
    try {
        const {name, age, favoriteFoods} = req.body
        const newPerson = new Person({name, age, favoriteFoods});
        await newPerson.save();
 res.status(200).send({msg:'Person created successfully', newPerson})

    } catch (error) {
res.status(400).send({errors:[{msg:error.message}] , error:error.message})
    }
});

//rerieve all persons
router.get("/getAllPersons" , async (req , res) =>{
try {
    const persons = await Person.find();
    res.status(200).send({msg:'All persons', persons})

} catch (error) {
res.status (404).send({errors:[{msg:error.message}] , error:error.message})
}
})

//get one by id
router.get("/getPersonById/:id", async (req, res) => {
    const personId = req.params.id;

    try {
      // Use findById to find a person by their ID
      const person = await Person.findById(personId);

      if (!person) {
        return res.status(404).json({ errors: [{ msg: 'Person not found' }] });
      }

      res.status(200).json({ msg: 'Person found', person });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: error.message }] });
    }
  });

  //get one by favorite food
  router.get("/findPersonByFood/:food", async (req, res) => {
    const foodToSearch = req.params.food;

    try {
      // Use findOne to find a person with the specified food in their favorites
      const person = await Person.findOne({ favoriteFoods: foodToSearch });

      if (!person) {
        return res.status(404).json({ errors: [{ msg: 'Person not found' }] });
      }

      res.status(200).json({ msg: 'Person found', person });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: error.message }] });
    }
  });

  //get one by id edit and save
  router.get("/updateById/:id", async (req, res) => {
    const personId = req.params.id;

    try {
      // Use findById to find a person by their ID
      const person = await Person.findById(personId);

      if (!person) {
        return res.status(404).json({ errors: [{ msg: 'Person not found' }] });
      }

      // Add "hamburger" to the list of favoriteFoods
      person.favoriteFoods.push("hamburger");

      // Save the updated Person
      await person.save();

      res.status(200).json({ msg: 'Person found', person });
    } catch (error) {
      res.status(500).json({ errors: [{ msg: error.message }] });
    }
  });

//Update a person by the methos findOneAndUpdate()
router.put("/updatePersonByName/:name", async (req, res) => {
const personName = req.params.name;

try {

  const updatedPerson = await Person.findOneAndUpdate({name : personName}, {age :20}, {new:true})
  !updatedPerson ? res.status(400).send({msg:'Person not found'}) :
  res.status(200).json({msg:'Person updated successfully', updatedPerson})

} catch (error) {
res.status(500).json({ errors: [{ msg: error.message }] });
}

})

//Delete a person by the method findByIdAndRemove()
router.delete("/deletePersonById/:id", async (req, res) => {
  const personId = req.params.id;

  try {
    // Use findByIdAndRemove to find and remove a person by _id
    const deletedPerson = await Person.findByIdAndRemove(personId);

    if (!deletedPerson) {
      return res.status(404).json({ errors: [{ msg: 'Person not found' }] });
    }

    res.status(200).json({ msg: 'Person deleted', deletedPerson });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

//deleting all persons with a given name mary
router.delete("/deletePeopleByNameMary", async (req, res) => {
  try {
    // Use Model.remove() to delete all people with the name "Mary"
    const result = await Person.deleteMany({ name: "ahmed" });

    if (result.acknowledged && result.deletedCount !==0) {
      // The 'result' object contains information about the operation
      const deletedCountt = result.deletedCount;
      res.status(200).send({ msg: `${deletedCountt} people named Mary deleted` });
    } else {
      res.status(500).send({ errors: [{ msg: 'No person found containing the given name' }], result });
    }
  } catch (error) {
    res.status(500).send({ errors: [{ msg: error.message }] });
  }
});

//chain query helpers
router.get("/findBurritoLovers", async (req, res) => {

    await  Person.find({ favoriteFoods: "Sushi" }) // Find people who like burritos
    .sort({ name: 1 }) // Sort them by name in ascending order
    .limit(2) // Limit the results to two documents
    .select("-age") // Hide their age
    .exec().then(docs => {
     res.status(200).send({msg:'Burrito lovers', docs})
    })
   .catch(err => {
      res.status(500).send({ errors: [{ msg: err.message }] });
    })



});




module.exports = router;
