import React, { useRef, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { uploadImage } from '../utils/cloudinary';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const imageUrl = await uploadImage(file);
      onImageSelect(imageUrl);
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleFileUpload(file);
    }
  };

  return (
    <div
      className={`relative transition-all duration-500 ease-out
        ${isDragging ? 'scale-102' : 'scale-100'}
        ${isUploading ? 'opacity-70' : 'opacity-100'}
        ${currentImage 
          ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50'}
        rounded-3xl shadow-lg hover:shadow-xl
        border-2 ${isDragging ? 'border-indigo-400 border-dashed' : 'border-transparent'}
        p-5 sm:p-8 backdrop-blur-sm
        group overflow-hidden`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10 space-y-4">
        {currentImage ? (
          <div className="relative rounded-2xl overflow-hidden group/image">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-52 sm:h-72 object-cover transition-all duration-700 ease-out group-hover/image:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500">
              <div className="transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500">
                <button
                  onClick={() => onImageSelect('')}
                  className="px-4 py-2 bg-white/90 rounded-full text-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white transform hover:scale-105 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-52 sm:h-72 bg-white/40 rounded-2xl border-3 border-dashed border-indigo-200 group-hover:border-indigo-400 transition-all duration-500">
            <div className="transform group-hover:-translate-y-2 transition-all duration-500">
              <div className="p-5 bg-gradient-to-br from-white/90 to-white/70 rounded-full shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <Camera className="h-10 w-10 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-500" />
              </div>
            </div>
            <div className="space-y-4 text-center px-6">
              <div className="text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium focus-within:outline-none"
                >
                  <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
                    Select Image
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                  />
                </label>
                <p className="mt-2 text-sm">or drag and drop here</p>
              </div>
              <p className="text-xs text-gray-500">
                Supports PNG, JPG or GIF (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Background animation */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
          <div className="bg-white/90 px-8 py-4 rounded-full shadow-2xl transform -translate-y-2 transition-transform duration-500">
            <span className="text-indigo-600 font-medium flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Drop to upload</span>
            </span>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mt-2 text-red-500 text-sm text-center">
          {uploadError}
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
          <div className="bg-white px-8 py-4 rounded-full shadow-2xl">
            <span className="text-indigo-600 font-medium">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
} 