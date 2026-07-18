'use client';

import React, { useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import toast from 'react-hot-toast';

export default function CaptionGenerator({ onGenerated }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setLoading(false);
      setLoading(true);
      toast.loading('Analyzing styling details...', { id: 'caption-ai' });

      // Build multipart form data
      const formData = new FormData();
      formData.append('image', imageFile);

      // Hit API
      const result = await apiClient.post('/api/ai/generate-caption', formData);

      toast.dismiss('caption-ai');
      toast.success('Generated metadata successfully!');
      
      if (result.title && result.description) {
        onGenerated(result.title, result.description);
      }
    } catch (err) {
      toast.dismiss('caption-ai');
      toast.error(err.message || 'AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">AI Copywriter</h4>
        <span className="text-[9px] bg-dark text-[#C9FA75] px-2 py-0.5 rounded-full font-heading font-bold uppercase tracking-wide">Sonnet 3.5 Vision</span>
      </div>

      <div className="flex gap-4 items-center">
        {/* Preview image box */}
        <div className="relative w-16 h-20 rounded-xl bg-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-300">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
          ) : (
            <span className="text-zinc-400 text-lg">📸</span>
          )}
        </div>

        {/* Upload controller */}
        <div className="flex-grow space-y-2">
          <input
            id="ai-image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <label
              htmlFor="ai-image-upload"
              className="px-4 py-2 border border-zinc-200 hover:border-dark text-dark text-[10px] font-heading font-bold uppercase tracking-widest rounded-lg cursor-pointer transition"
            >
              Choose Photo
            </label>
            {imageFile && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="bg-dark hover:bg-[#C9FA75] text-white hover:text-dark px-4 py-2 text-[10px] font-heading font-bold uppercase tracking-widest rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Thinking...' : '✨ Generate Title & Desc'}
              </button>
            )}
          </div>
          <p className="text-[9px] text-zinc-400 font-body uppercase">Upload a product photo, and Claude will curate details.</p>
        </div>
      </div>
    </div>
  );
}
