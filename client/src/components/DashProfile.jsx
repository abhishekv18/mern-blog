import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';
  import { updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutSuccess } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
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
  const[showModal,setShowModal]=useState(false);
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
      const handleDeleteUser = async () => {
        setShowModal(false);
        try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(deleteUserFailure(data.message));
          } else {
            dispatch(deleteUserSuccess(data));

          }
        } catch (error) {
          dispatch(deleteUserFailure(error.message));
        }
      };
      const handleSignout = async () => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signoutSuccess());
          }
        } catch (error) {
          console.log(error.message);
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
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
    </div>
   {updateUserSuccess && (
    <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
   )}
   {updateUserError && (
    <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
   )}
     {error && (
    <Alert color='failure' className='mt-5'>{error}</Alert>
   )}
   <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
   <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray"  onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
   </Modal>
    </div>
  )
}
