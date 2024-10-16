import Note from "../model/note.model.js";
import { errorHandler } from "../utils/error.js";

// ADD NOTES
export const addNote = async (req,res,next) => {
    const {title,content,tags,isPinned} = req.body;
    // console.log(req.user);

    const {id} = req.user;

    if(!title){
        return errorHandler(400,"Title is required field");
    }

    if(!content){
        return errorHandler(400,"Content is required field");
    }

    try {
        const note = new Note({
            title,
            content,
            tags : tags || [],
            isPinned : isPinned || false,
            userId : id,
        });

        await note.save();

        res.status(201).json({
            success : true,
            message : "Note added successfully",
            note,
        })


    } catch (error) {
        next(error);
    }
}

// EDIT NOTES
export const editNote = async (req,res,next) => {
    const note = await Note.findById(req.params.noteId)

    if(!note){
        return next(errorHandler(404,"Note not found!"));
    }

    if (req.user.id !== note.userId) {
        return next(errorHandler(401, "You can only update your own note!"))
    }

    const {title,content,tags,isPinned} = req.body;

    if(!title && !content && !tags){
        return next(errorHandler(404,"No changes provided"));
    }

    try {
        if(title){
            note.title = title;
        }

        if(content){
            note.content = content;
        }

        if(tags){
            note.tags = tags;
        }

        if(isPinned){
            note.isPinned = isPinned;
        }

        await note.save();

        res.status(200).json({
            success : true,
            message : "Note updated successfully",
            note,
        })
    } catch (error) {
        next(error);
    } 
}

// GET ALL NOTES
export const getAllNotes =  async (req,res,next) => {
    const userId = req.user.id;

    try {
        const notes =  await Note.find({userId : userId}).sort({isPinned : -1});

        return res.status(200).json({
            success : true,
            message : "All notes get fetched",
            notes,
        });
    } catch (error) {
        next(error);
    }

}

// DELETING THE NOTE
export const deleteNote = async (req,res,next) => {
    const userId = req.user.id;

    try {
        const {noteId} = req.params;
        const note = await Note.findById(noteId);
        if(!note){
            return next(errorHandler(404,"Note not found"));
        }
        if (note.userId.toString() !== userId) {
            return next(errorHandler(403, "You are not authorized to delete this note"));
        }

        await Note.findOneAndDelete({_id : noteId , userId});

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        })
    } catch (error) {
        next(error);
    }
}

// UPDATING NOTE PINNED
export const updateNotePinned = async (req,res,next) => {
    try {
        const note = await Note.findById(req.params.noteId);

        if(!note){
            return next(errorHandler("404","Note not found"));
        }
        if (req.user.id !== note.userId) {
            return next(errorHandler(401, "You can only update your own note!"))
        }

        const {isPinned} = req.body;

        note.isPinned = isPinned;

        await note.save();

        res.status(200).json({
            success: true,
            message: "Note Pinned successfully",
            note,
        })

    } catch (error) {
        next(error);
    }
}

// SEARCHING
export const searchNote = async (req,res,next) => {
    const {query} = req.query;
    const userId  = req.user.id;

    if(!query){
        return next(errorHandler(400,"Search query is required"));
    }

    try {
        const matchingNotes = await Note.find({
            userId,
            $or:[
                {title : {$regex: new RegExp(query,"i")} },
                {content : {$regex: new RegExp(query,"i")} },
            ]            
        })

        res.status(200).json({
            success : true,
            message : "matched notes get retrived successfully",
            notes : matchingNotes,
        })
    } catch (error) {
        next(error);
    }
}