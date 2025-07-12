import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  // Subject name (e.g., "Data Structures", "Operating Systems")
  subject: {
    type: String,
    required: true,
  },
  // Topic within the subject (e.g., "Linked Lists", "Process Management")
  topic: {
    type: String,
    required: true,
  },
  // Array of PDF notes for this topic
  pdfNotes: [{
    title: { type: String, required: true }, // Title of the PDF (e.g., "Chapter 1 Notes")
    pdfUrl: { type: String, required: true }, // URL to the PDF file (for viewing only)
  }],
  // Array of most important questions for this topic
  importantQuestions: [{
    title: { type: String, required: true }, // Title of the question set (e.g., "Important Qs Unit 1")
    questionsText: { type: String }, // URL to the document/page with questions
  }],
  // Array of playlists for this topic
  playlists: [{
    title: { type: String, required: true }, // Title of the playlist (e.g., "DSA Playlist")
    thumbnailImg: { type: String, required: true }, // URL to the playlist thumbnail
    playlistLink: { type: String, required: true }, // Link to the actual playlist (e.g., YouTube)
  }],
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);