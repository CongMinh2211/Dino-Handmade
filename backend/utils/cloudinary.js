import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Cấu hình Cloudinary từ environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmtcounhw',
  api_key: process.env.CLOUDINARY_API_KEY || '366164861826468',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Tạo storage cho từng loại upload
const createCloudinaryUpload = (folder, maxFileSize = 5 * 1024 * 1024) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `dino-handmade/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxFileSize },
  });
};

export const uploadProduct = createCloudinaryUpload('products');
export const uploadBlog = createCloudinaryUpload('blog');
export const uploadGallery = createCloudinaryUpload('gallery', 10 * 1024 * 1024);
export { cloudinary };
