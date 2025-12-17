// Local upload helper replacing old Firebase upload logic
// Expects a multer-file object and returns the stored file path/URL

const uploadToFirebase = async (file) => {
  if (!file) return null;

  // Since multer already stored the file on disk, we just expose metadata here.
  const relativePath = file.path.replace(/\\/g, "/");
  const url = `/uploads/${relativePath.split("uploads/")[1]}`;

  return { path: relativePath, url };
};

export default uploadToFirebase;
