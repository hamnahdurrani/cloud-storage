import React, { useEffect, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { list } from 'aws-amplify/storage';

export function App() {
  const [uploadFilename, setUploadFilename] = useState<string>();
  const [filesFromS3, setFilesFromS3] = useState<any[]>();

  const loadFiles = async () => {
    try {
      const response = await list({
        path: 'uploads/',
        options: {
          listAll: true,
        },
      });
      setFilesFromS3(response);
      console.log('list success:', response);
    } catch (error) {
      console.error('list failed:', error);
    }
    
  };
  
  const handleChange = (event) => {
    setUploadFilename(event.target.files?.[0]);
  };

  const handleClick = async () => {
    if (!uploadFilename) return;
  
    try {
      const result = await uploadData({
        path: `uploads/${uploadFilename.name}`,
        data: uploadFilename,
      }).result;
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }

    await loadFiles();
  };

return (
  <div>
    <input type="file" onChange={handleChange} />
    <button onClick={handleClick}>Upload</button>
    <p>{JSON.stringify(filesFromS3)}</p>
  </div>
);
}