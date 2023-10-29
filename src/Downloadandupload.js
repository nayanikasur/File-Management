import { useState, useEffect } from "react";
import { auth } from './firebaseInit';
import { storage } from "./firebaseInit";
import { db } from "./firebaseInit";
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import styled from "styled-components";

export const Container = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 18px; /* Adjust the font size for smaller screens */
  }
`;

export const FileInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 10px;
  margin-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px; 

  @media (min-width: 768px) {
    margin-right: 5px;
    margin-top: 0;
    width: auto;
  }
`;
export const UploadButton = styled.label`
  display: inline-block;
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 16px;
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 3px;
  font-size: 16px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden; 
  
  @media (max-width: 768px) {
    flex-direction: column; 
    align-items: flex-start;
  }
`;

export const FileTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;


export const DownloadButton = styled.button`
  background-color: #28A745;
  color: #fff;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
`;

export const DeleteButton = styled.button`
  background-color: #DC3545;
  color: #fff;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  margin:5px;
`;

const Downloadandupload = () => {
  const [file, setFile] = useState(null);
  const [everyoneRegistered, setEveryoneRegistered] = useState([]);
  const [Url, setUrl] = useState('');

  async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "individual"));
    const userData = [];


    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      const username = data.username;
      const filename = data.filename;
      const url = data.url;
      if (username === auth.currentUser.email) {
        userData.push({ username, filename, url, id });
      }
    });

    setEveryoneRegistered(userData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  console.log(everyoneRegistered);

  const downloadFileUrl = (url, filename) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = (event) => {
      const blob = xhr.response;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    xhr.open('GET', url);
    xhr.send();
  };

  const deleteFile = (index) => {
    async function remove(i) {
      const docref = doc(db, "individual", i);
      await deleteDoc(docref);
    }
    remove(index)
    fetchData()
  }

  const upload = () => {
    if (file === null) return;

    const fileRef = ref(storage, `/files/${file.name}`);

    uploadBytes(fileRef, file)
      .then(() => {
        alert("File Uploaded");

        getDownloadURL(fileRef)
          .then((url) => {
            setUrl(url);
            addIndividual(url);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      })
      .catch((error) => {
        console.error("Upload error", error);
      });


    async function addIndividual(url) {
      const filename = file.name;
      const docRef = await addDoc(collection(db, "individual"),
        {
          username: auth.currentUser.email,
          filename,
          url
        });
      console.log(docRef);
      fetchData()
    }
  }

  return (
    <>
      <Container>
        <Title>FILE MANAGEMENT</Title>

        <FileInput type="file" onChange={(e) => {
          setFile(e.target.files[0]);
        }} />
        <UploadButton onClick={upload}>Upload</UploadButton>
        <br />

        <FileList>
          {everyoneRegistered.map((doc, i) => {
            return (
              <ListItem key={i}>
                <FileTitle>{doc.filename}</FileTitle>
                <ButtonGroup>
                  <DeleteButton onClick={() => deleteFile(doc.id)}>Delete</DeleteButton>
                  <DownloadButton onClick={() => downloadFileUrl(doc.url, doc.filename)}>Download</DownloadButton>
                </ButtonGroup>
              </ListItem>
            );
          })}
        </FileList>
      </Container>


    </>
  )
}

export default Downloadandupload;
