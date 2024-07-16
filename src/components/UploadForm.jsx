import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadForm = () => {
  const [text, setText] = useState(''); 
  const [image, setImage] = useState(null); 
  const [error, setError] = useState(''); 
  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 

    if (file) {
      const fileType = file['type']; 
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!validImageTypes.includes(fileType)) {
        setError('Only JPEG, PNG, and GIF files are allowed.'); 
        setImage(null); 
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB.'); 
        setImage(null); 
        return; 
      }
      
      setError(''); 
      setImage(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png, image/gif',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleImageChange({ target: { files: [file] } });
    }
  });

  const handleTextChange = (e) => {
    setText(e.target.value); 
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    setError(''); 

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    if (!text) {
      setError('Please enter some text.');
      return;
    }

    // changes needed just testing for now . 
    console.log('Image:', image);
    console.log('Text:', text);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-md">
        <div className='flex justify-between'>
          <div className='flex flex-col mt-10'>
            <label htmlFor="text" className='text-3xl font-bold text-gray-700 mb-2'>Enter your text here!</label>
            <input 
              type="text" 
              id="text" 
              className='w-full h-10 px-4 py-2 border-2 border-gray-400 rounded-md mt-2'
              ref={textInputRef}
              value={text} 
              onChange={handleTextChange}
            />
          </div>
          <div className='mt-10'>
            <div className='flex flex-col'>
              <label htmlFor="image" className='text-3xl font-bold text-gray-700 mb-2'>Upload Image :)</label>
              <input 
                type="file" 
                id="image" 
                onChange={handleImageChange}
              />
              <div {...getRootProps()} className="dropzone border-2 w-full h-96 mt-4 border-gray-500 border-dashed rounded-md">
                <input {...getInputProps()} />
                <div className='flex flex-col justify-center items-center mt-40'>
                  <p>Or drop your image here!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center mt-4'>
          <button className='border-2 border-gray-500 w-44 h-10 rounded-md mt-20'>Generate Results</button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </>
  );
};

export default UploadForm;
