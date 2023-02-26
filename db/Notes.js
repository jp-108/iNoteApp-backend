import mongoose, { Schema, model } from "mongoose";

const notesSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'users'},
  title: { type: String, require: true },
  description: { type: String, require: true },
  tag: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
});

const Notes = model("notes", notesSchema);
// Notes.createIndexes();
export default Notes;
