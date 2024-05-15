import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import {Table, Modal, Button} from 'flowbite-react';
// import Loader from './Loader';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {FaCheck, FaTimes} from 'react-icons/fa'





const DashUsers = () => {
  const {userInfo} = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [showmore, setShowmore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users`);
        const data = await res.json();
        if(res.ok){
          setUsers(data.users);
          if(data.users.length < 9){
            setShowmore(false);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    };
    if(userInfo.isAdmin){
      fetchUsers();
    }
  }, [userInfo.isAdmin]);

  const handleShomore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(`/api/users?startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length < 9){
          setShowmore(false);
        }
      }
    } catch (error) {
      console.log(error.messsage)
    }

  }

  const deleteUser = async () => {
    
  } 

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500' 
    >
      {userInfo.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date de creation</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Nom</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Supprimer</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} user={user} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {user.createdAt.substring(0, 10)}
                  </Table.Cell>
                  <Table.Cell> 
                    <img 
                    src={user.profilePicture}
                    alt={user.name}
                    className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {user.name}
                  </Table.Cell>
                  <Table.Cell>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (<FaCheck className='text-green-500'/>): (<FaTimes className='text-red-500'/>)}
                  </Table.Cell>
                  <Table.Cell>
                    <span 
                    onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user._id)
                    }}
                    className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Supprimer
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ) )}
          </Table>
          {
            showmore && (
              <button 
              onClick={handleShomore}
              className='w-full text-teal-500 self-center text-sm py-7'
              >
                Voir Plus
              </button>
            )
          }
        </>
      ) : (
        <>
          <p>Aucun Utilisteur trouvé </p>
        </>
      )
      }

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
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Êtes-vous sûr de supprimer cette publication ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color='failure'
              onClick={() => deleteUser(users._id)}
              >
                Oui, supprimer
              </Button>
              <Button 
              onClick={() => setShowModal(false)}
              >
                Non, annuler
              </Button>

              {/* {loadingDelete && <Loader/>} */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
    
  )
}

export default DashUsers;