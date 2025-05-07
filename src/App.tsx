import React from 'react';
import { uploadData } from 'aws-amplify/storage';

export function App() {
  const [file, setFile] = React.useState();

  const handleChange = (event) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = async () => {
    if (!file) return;
  
    try {
      const result = await uploadData({
        path: `uploads/${file.name}`,
        data: file,
      }).result;
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleClick}>Upload</button>
    </div>
  );
}