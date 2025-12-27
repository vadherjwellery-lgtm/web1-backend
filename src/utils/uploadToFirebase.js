// Convert uploaded file buffer to base64 data URL for database storage
// This ensures images persist in MongoDB instead of ephemeral file system

const uploadToFirebase = async (file) => {
  if (!file || !file.buffer) return null;

  try {
    // Convert buffer to base64
    const base64Data = file.buffer.toString('base64');

    // Create data URL with proper MIME type
    const dataUrl = `data:${file.mimetype};base64,${base64Data}`;

    return { url: dataUrl };
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

export default uploadToFirebase;
