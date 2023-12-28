import React, { useState } from 'react';
import './App.css';

function App() {
  const [sourceImage, setSourceImage] = useState(null);
  const [sourceImageUrl, setSourceImageUrl] = useState('');
  const [targetImage, setTargetImage] = useState(null);
  const [targetImageUrl, setTargetImageUrl] = useState('');
  const [sourceImagePreview, setSourceImagePreview] = useState(null);
  const [targetImagePreview, setTargetImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleImageUpload = (event, setImage, setPreview) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (sourceImage) formData.append('source_image', sourceImage);
    formData.append('source_image_url', sourceImageUrl);
    if (targetImage) formData.append('target_image', targetImage);
    formData.append('target_image_url', targetImageUrl);
    formData.append('prompt', prompt);
    formData.append('negative_prompt', negativePrompt);

    const response = await fetch('http://localhost:8000/run_face_swap/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setGeneratedImage(data.image_url);
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face Swap Integration</h1>
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <div className="image-upload-container">
            <label htmlFor="source_image">Upload Source Image:</label><br />
            <div className="image-preview">
              {sourceImagePreview ? (
                <img src={sourceImagePreview} alt="Source Preview" />
              ) : (
                <button>+</button>
              )}
            </div>
            <input 
              type="file" 
              id="source_image" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, setSourceImage, setSourceImagePreview)} 
            /><br />
          </div>
          
          <label htmlFor="source_image_url">or Source Image URL:</label><br />
          <input type="text" id="source_image_url" value={sourceImageUrl} onChange={e => setSourceImageUrl(e.target.value)} /><br />

          <div className="image-upload-container">
            <label htmlFor="target_image">Upload Target Image:</label><br />
            <div className="image-preview">
              {targetImagePreview ? (
                <img src={targetImagePreview} alt="Target Preview" />
              ) : (
                <button>+</button>
              )}
            </div>
            <input 
              type="file" 
              id="target_image" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, setTargetImage, setTargetImagePreview)} 
            /><br />
          </div>

          <label htmlFor="target_image_url">or Target Image URL:</label><br />
          <input type="text" id="target_image_url" value={targetImageUrl} onChange={e => setTargetImageUrl(e.target.value)} /><br />

          <label htmlFor="prompt">Positive Prompt:</label><br />
          <input type="text" id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} /><br />
          <label htmlFor="negative_prompt">Negative Prompt:</label><br />
          <input type="text" id="negative_prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} /><br />

          <input type="submit" value="Swap Faces" />
        </form>
        {generatedImage && (
          <>
            <h2>Generated Image:</h2>
            <img src={generatedImage} alt="Face Swapped" />
          </>
        )}
      </header>
    </div>
  );
}

export default App;

