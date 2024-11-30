import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';
  import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice';

  import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
export default function DashProfile() {
    const dispatch=useDispatch();
    const { currentUser, error, loading } = useSelector((state) => state.user);
 
    const[imageFile,setImageFile]=useState(null);
    const[imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
    const [formData,setFormData]=useState({});
    const filePickerRef=useRef();
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }   
    };
    useEffect(()=>{
        if(imageFile){
            uploadImage();
        }
    },[imageFile]);
    const uploadImage=async()=>{
      setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError(
              'Could not upload image (File must be less than 2MB)'
            );
            setImageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
              setFormData({ ...formData, profilePicture:downloadURL });
              setImageFileUploading(false);
            });
          }
        );
    }
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
      };    
     

      const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
         setUpdateUserError("no changes made");
          return;
        }
       if(imageFileUploading){
        setUpdateUserError("please wait for image to upload")
        return;
       }
        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
setUpdateUserError(data.message);
          
          } else {
            dispatch(updateSuccess(data));
           setUpdateUserSuccess("user updated successfully");
          }
        } catch (error) {
          dispatch(updateFailure(error.message));
          setUpdateUserError(data.message);
        }
      };
     
  return (
    <div className='mx-auto p-3 max-w-lg w-full'>
    <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1> 
   
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
       <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/> 
    <div className='w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden' onClick={()=>filePickerRef.current.click()}>

        <img src={imageFileUrl||currentUser.profilePicture} alt='user' className='rounded-full border-8 border-[lightgray] w-full h-full object-cover'></img>
    </div>
    {imageFileUploadError && (
         <Alert color='failure'>{imageFileUploadError}</Alert>
       
        )}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}  onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}  onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password'  onChange={handleChange} />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            update
        </Button>
    </form>
    <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
    </div>
   {updateUserSuccess && (
    <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
   )}
   {updateUserError && (
    <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
   )}
    </div>
  )
}
