import React, { useEffect, useState } from 'react';
import { ListAllWithPathOutput, uploadData } from 'aws-amplify/storage';
import { list } from 'aws-amplify/storage';
import { remove } from 'aws-amplify/storage';
import { getUrl } from 'aws-amplify/storage';

export function App() {
  const [uploadFilename, setUploadFilename] = useState<string>();
  const [filesFromS3, setFilesFromS3] = useState<ListAllWithPathOutput>();
  const paths = filesFromS3?.items.map(item => item.path);

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

  const handleDeleteClick = async (deleteFilename) =>{
    try {
      await remove({ 
        path: `${deleteFilename}`,
        bucket: 'amplifyAdminDrive',
      });
      console.log('File Deletion success');
      await loadFiles();
    } catch (error) {
      console.log('File Deletion failed', error);
    }
  }

  const handleDownloadClick = async(downloadFilename) =>{
    try {
      const linkToStorageFile = await getUrl({
        path: `${downloadFilename}`,
      });
      window.open(linkToStorageFile.url, '_blank');
      console.log('File Download success');
      await loadFiles();
    } catch (error) {
      console.log('File Download failed', error);
    }
  }
  
  useEffect(() => {
    loadFiles();
  },[])

return (
  <div className='box'>
    <div>
      <input type="file" onChange={handleFileChange} />
      <button className = 'button' onClick={handleUploadClick}>Upload</button>
    </div>
    <div>
      <table>
        <tr>
          <th> File Name </th>
          <th> Delete </th>
          <th> Download </th>
        </tr>
        {paths && paths.map(path => 
        <tr>
          <td>{path}</td>
          <td> <button onClick={() => handleDeleteClick(path)}>X</button></td>
          <td> <button onClick={() => handleDownloadClick(path)}> {'\u2B07'} </button></td>
        </tr>
        )}
      </table>
    </div>
  </div>
);
}