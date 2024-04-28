import { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {Table, Modal, Button} from "flowbite-react";
import {FaTrash, FaEdit} from "react-icons/fa";
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import {toast} from "react-toastify";


const DashPosts = () => {
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(false);

  const {userInfo} = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/getposts?userId=${userInfo._id}`);
        const data = await res.json();
        if(res.ok){
          setPosts(data.posts);
        };
        if(data.length < 9 ){
          setShowMore(false);
        }
      } catch (error) {
        
      }
    };
    if(userInfo.isAdmin){
      fetchPosts();
    }
  }, [userInfo._id]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/posts/getPosts?userId=${userInfo._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setPosts((prev) => [...prev, ...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      };

    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/posts/deletepost/${postIdToDelete}/${userInfo._id}`, 
      {
        method: 'DELETE',
      }
    );
    const data = await res.json();
    if(!res.ok){
      console.log(data.message);
    }else{
      setPosts((prev) => 
        prev.filter((post) => post._id !== postIdToDelete)
    )
    }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <div  className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {userInfo.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md '>
            <Table.Head>
              <Table.HeadCell>Date mise à jour</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Categorie</Table.HeadCell>
              <Table.HeadCell>Supprimer</Table.HeadCell>
              <Table.HeadCell> <span>Éditer</span> </Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body key={post._id} post={post} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                      src={post.image}
                      alt={post.title}
                      className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <FaTrash 
                    onClick={() => {
                      setShowModal(true)
                      setPostIdToDelete(post._id)
                    }}
                    className='h-5 w-5 text-red-500 hover:cursor-pointer hover:text-red-600 '
                    />
                  </Table.Cell>
                  <Table.Cell>
                   <Link className='text-indigo-500 hover:cursor-pointer hover:text-indigo-600' to={`/update-post/${post._id}`}>
                      <FaEdit className='h-5 w-5'/>
                   </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button 
              onClick={handleShowMore}
              className="w-full text-indigo-500 self-center text-sm py-7"
              >
                Voir plus
              </button>
            )
          }
        </>
      ) : (
        <p>Vous n'avez aucun post</p>
      )}

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
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Êtes-vous sûr de supprimer ce post ?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure'
              onClick={() => deletePostHandler(userInfo._id)}
              >
                Oui, supprimer
              </Button>
              <Button 
              onClick={() => setShowModal(false)}
              >
                Non, annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashPosts;

