import React, { useEffect, useState } from 'react';
import { ListAllWithPathOutput, uploadData } from 'aws-amplify/storage';
import { list } from 'aws-amplify/storage';
import { remove } from 'aws-amplify/storage';
import { getUrl } from 'aws-amplify/storage';

export function App() {
  const [uploadFilename, setUploadFilename] = useState<string>();
  const [filesFromS3, setFilesFromS3] = useState<ListAllWithPathOutput>();

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
  <>
    <header>
      Cloud Dashboard
    </header>
    <div className='container'>
      <div className='upload-area'>
        <input type="file" onChange={handleFileChange} />
        <button className = 'upload-button' onClick={handleUploadClick}>Upload</button>
      </div>
      <h2> Stored Files </h2>
      <div>
        <table >
          <tr>
            <th> File Name </th>
            <th> Size </th>
            <th> Date Modified </th>
            <th> Delete </th>
            <th> Download </th>
          </tr>
          {filesFromS3?.items && filesFromS3?.items.map(item =>  
          <tr>
            <td>{item.path}</td>
            <td>{(item.size / 1024).toFixed(2)} KB </td>
            <td>{JSON.stringify(item.lastModified).substring(1,11)}</td>
            <td> <button onClick={() => handleDeleteClick(item.path)}> X </button></td>
            <td> <button onClick={() => handleDownloadClick(item.path)}> {'\u2B07'} </button></td>
          </tr>
          )}
        </table>
      </div>
    </div>
  </>
);
}