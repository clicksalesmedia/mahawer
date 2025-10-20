"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({ 
  onUpload, 
  currentImage, 
  label = "الصورة",
  required = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpload(data.url);
      } else {
        const error = await response.json();
        console.error('Upload error response:', error);
        
        let errorMessage = 'حدث خطأ غير معروف';
        
        if (error.details) {
          errorMessage = error.details;
        } else if (error.error) {
          errorMessage = error.error;
        }
        
        // Add suggestion if available
        if (error.suggestion) {
          errorMessage += `\n\nاقتراح: ${error.suggestion}`;
        }
        
        // If it's a Vercel error, show URL input option
        if (error.error === 'File upload not supported on Vercel') {
          setShowUrlInput(true);
          alert(`${errorMessage}\n\nيمكنك استخدام رابط صورة مباشر بدلاً من ذلك.`);
        } else {
          alert(`خطأ في رفع الصورة: ${errorMessage}`);
        }
        setPreview(currentImage || null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('حدث خطأ في رفع الصورة');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUpload('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim());
      onUpload(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition ${
                uploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                  جاري الرفع...
                </div>
              ) : (
                <>
                  {preview ? 'تغيير الصورة' : 'اختيار صورة'}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition"
            >
              رابط
            </button>
          </div>

          {/* URL Input */}
          {showUrlInput && (
            <div className="space-y-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="أدخل رابط الصورة (مثال: /catalogue/image.jpg)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
                >
                  استخدام
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500">
          الحد الأقصى: 5 ميجابايت. الصيغ المدعومة: JPG, PNG, WebP, GIF
        </p>
      </div>
    </div>
  );
}
