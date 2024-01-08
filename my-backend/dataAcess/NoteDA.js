import Note from '../entities/Note.js';
import LikeOp from "./Operators.js"

async function getNotes() {
    return await Note.findAll({include: ["Tags", "Subject","User"]});
}

async function getNoteById(id) {
    return await Note.findByPk(id,{include: ["Tags"]});
}
async function deleteNote(id) {
    let note = await Note.findByPk(id);
    return await note.destroy();
}
async function createNote(note) {
    return await Note.create(note);
}
async function updateNote(id, note) {
    try {
      let updateNote = await getNoteById(id);
      if (!updateNote) return { error: true, msg: "No entity found" };
      await updateNote.update(note);
      updateNote = await getNoteById(id);
      return { error: false, msg: "User updated successfully", obj: updateNote };
    } catch (error) {
      return { error: true, msg: "Error updating user" };
    }
  }

// Query Route Ex: http://localhost:9000/api/employeeFilter?employeeName=Ionut&take=2&skip=1&employeeSurName=Alex
async function getNotesWithFilterAndPagination(filter){
  //pagination
  if (!filter.take)
    filter.take = 10;

  if (!filter.skip)
    filter.skip = 1;
  //filter
  let whereClause = {};
  if (filter.Title)
      whereClause.Title = {[LikeOp]: `%${filter.Title}%`};

  // if (filter.Tags.TagName)
  //   whereClause.Tags.TagName = {[LikeOp]: `%${filter.Tags.TagName}%`};
  
  if (filter.UserID)
  whereClause.UserID = {[LikeOp]: `%${filter.UserID}%`};

  if (filter.SubjectID)
  whereClause.SubjectID = {[LikeOp]: `%${filter.SubjectID}%`};

  // let whereIncludeClause = {};

  // // if (filter.UserID)
  // //   whereIncludeClause.UserID = {[LikeOp]: `%${filter.UserID}%`};

  return await Note.findAndCountAll (
    {   
      distinct: true,         
      // include:
      //  [
      //    {
      //     model: Adresa,
      //     as: "Adrese",
      //     where: whereIncludeClause
      //    }
      //  ],
      include: ["Tags", "Subject", "User"],
       where: whereClause,
       limit: parseInt(filter.take),
       offset: parseInt(filter.skip - 1) * parseInt(filter.take), // skip este pagina curenta iar take sunt cate inregistrari vin pe pagina
    });
}

export{
    getNotes,
    getNoteById,
    deleteNote,
    createNote,
    updateNote,
    getNotesWithFilterAndPagination
};