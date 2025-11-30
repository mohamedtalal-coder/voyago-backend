const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'voyago',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (filePath, folder = 'voyago') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      quality: 'auto',
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary')) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename.split('.')[0]}`;
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
};
