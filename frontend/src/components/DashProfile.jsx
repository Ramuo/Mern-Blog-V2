import { useState,  useEffect, useRef} from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable, ref} from 'firebase/storage';
import {app} from '../firebase.config'
import {useNavigate, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { Button, TextInput, Modal, Alert, Spinner} from 'flowbite-react';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {toast} from 'react-toastify';
import Loader from './Loader';


import {
  useUpdateUserprofileMutation,
  useDeleteUserMutation,
  useLogoutMutation,
} from "../slices/userApiSlice";
import {setCredentials} from "../slices/authSlice";
import {logout} from '../slices/authSlice';








const DashProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userInfo}= useSelector((state) => state.auth);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [showModal, setShowModal] = useState(false);


  const [updateUserProfile, {isLoading, error}] = useUpdateUserprofileMutation();
  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();
  const [logoutApiCall] = useLogoutMutation();

  // Image upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);


  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if(imageFile){
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on('state_change', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageFileUploadingProgress(progress.toFixed(0));
    },
    (error) => {
      setImageFileUploadError("Téléchargement de l'image a échoué, l'image doit faire moins de 2MB");
      setImageFileUploadingProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
        setProfilePicture({...profilePicture, profilePicture: downloadURL});
      });
    }
  );
  }

 
  useEffect(() => {
    if(userInfo){
      setName(userInfo.name);
      setEmail(userInfo.email);
      setProfilePicture(userInfo.profilePicture);
      setPassword(userInfo.password);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);

    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try {
        const res = await updateUserProfile({name, email, password, profilePicture}).unwrap();
        toast.success('Profil modifié avec succès');
        dispatch(setCredentials(res));
    } catch (err) {
        toast.error(err?.data?.message || err.error);
        setUpdateUserError(err.message);   
    }   
};

const deleteUserHandler = async (id) => {
  setShowModal(false)
  try {
    await deleteUser(id);
    await logoutApiCall().unwrap();
    dispatch(logout());
    toast.success("Compte supprimé avec succès");
    navigate('/register')
  } catch (err) {
    toast.error(err?.data?.message || err.error)
  }
};

return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      { error ? (
        <Alert color='failure' className='mt-5'>
          {error.data.message}
        </Alert>
      ): (
        <>
        <h1 className='my-7 text-center font-semibold text-3xl'>{userInfo.name}</h1>
          <form className='flex flex-col gap-4' onSubmit={submitHandler}>
            <div>
              <input 
              type="file" 
              accept='/image/*'
              className='hidden'
              onChange={handleImageChange}
              ref={filePickerRef}
              />
            </div>
            <div 
            className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
            >
              <img src={imageFileUrl || userInfo.profilePicture} alt="" className='rounded-full w-full h-full border-8 object-cover border-[lightgray] '/>
            </div>
            {imageFileUploadError && (
              <Alert color='failure'>
                {imageFileUploadError}
              </Alert>
            )}
            <TextInput 
            type='text' 
            placeholder='Nom'
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            />
            <TextInput 
            type='email' 
            placeholder='E-mail'
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput 
            type='password' 
            placeholder='Mot de passe'
            value={password ||''}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button
            type='submit'
            gradientDuoTone={'purpleToBlue'} 
            disabled={isLoading || imageFileUploading}
            >
              {isLoading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Mettre à jour'
              )}
            </Button>

            {userInfo.isAdmin && (
              <Link to={'/creat-post'}>
                <Button
                type='button'
                gradientDuoTone="purpleToPink"
                className='w-full'>
                  Créer un post
                </Button>
              </Link>
            )}
          </form>
        </>
      )}
      
      <div className="text-red-500 mt-5">
        <span 
        className='cursor-pointer'
        onClick={() => setShowModal(true)}
        >
          Supprimer le compte
        </span>
      </div>

      <Modal 
      show={showModal} 
      onClick={() => setShowModal(false)}
      popup
      size='md'
      >
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle 
            className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'
            />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Êtes-vous sûr de supprimer ce compte ?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure'
              onClick={() => deleteUserHandler(userInfo._id)}
              >
                Oui, supprimer
              </Button>
              <Button 
              onClick={() => setShowModal(false)}
              >
                Non, annuler
              </Button>

              {loadingDelete && <Loader/>}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;







// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 *1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }