import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import Notes from "../db/Notes.js";
import { body, validationResult } from "express-validator";

//**********Fetch notes */
const Router = express.Router();
Router.get("/fetchnotes", fetchuser, async (req, res) => {
  let notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

//*******Add notes */
Router.post(
  "/addnotes",
  [
    body("title").isLength({ min: 2 }),
    body("description").isLength({ min: 2 }),
  ],
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      let saveNotes = await notes.save();
      res.json(saveNotes);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        result: "some error occured",
        message: error.message,
      });
    }
  }
);


//*********update note end point */

Router.put("/update/:id",fetchuser, async(req, res)=>{
    try {
        const { title, description, tag } = req.body;
        let newNotes = {};
        if(title){newNotes.title = title};
        if(description){newNotes.description = description};
        if(tag){newNotes.tag = tag};

        // find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){ return res.status(404).send("Not Found")};

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }

        note =  await Notes.findByIdAndUpdate(req.params.id, {$set: newNotes}, {new:true})
        res.json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({
          result: "some error occured",
          message: error.message,
        });  
    }
} )


//*********delete note end point */

Router.delete("/delete/:id",fetchuser, async(req,res)=>{
   
   try {
       let note = await Notes.findById(req.params.id);
       if(!note){ return res.status(404).send("Not Found")};
   
       if(note.user.toString() !== req.user.id){
           return res.status(401).send("Not allowed")
       }
   
       note = await Notes.findByIdAndDelete(req.params.id);
       res.send({msg:"deleted successfully"})
    
   } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "some error occured",
      message: error.message,
        });
   }   

})

export default Router;
