import React, { useEffect, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { list } from 'aws-amplify/storage';
import { remove } from 'aws-amplify/storage';

export function App() {
  const [uploadFilename, setUploadFilename] = useState<string>();
  const [filesFromS3, setFilesFromS3] = useState<any[]>();
  const [deleteFilename, setDeleteFilename] = useState<string>();

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
  
  const handleFileChange = (event) => {
    setUploadFilename(event.target.files?.[0]);
  };

  const handleFilenameChange = (event) => {
    setDeleteFilename(event.target.value);
  }

  const handleUploadClick = async () => {
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

  const handleDeleteClick = async () =>{
    try {
      await remove({ 
        path: `uploads/${deleteFilename}`,
        bucket: 'amplifyAdminDrive',
      });
      console.log('File Deletion success');
      await loadFiles();
    } catch (error) {
      console.log('File Deletion failed', error);
    }
  }

return (
  <div>
    <>
    <input type="file" onChange={handleFileChange} />
    <button onClick={handleUploadClick}>Upload</button>
    </>
    <>
    <input type="text" onChange={handleFilenameChange} />
    <button onClick={handleDeleteClick}>Delete</button>
    </>
    <p>{JSON.stringify(filesFromS3)}</p>
  </div>
);
}