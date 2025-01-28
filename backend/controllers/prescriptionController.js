const uploadPrescription = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  res.status(200).json({
    message: 'Prescription uploaded successfully!',
    file: {
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
    },
  });
};

export { uploadPrescription };
