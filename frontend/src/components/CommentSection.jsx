import { useEffect, useState } from 'react';
import {useSelector} from "react-redux"
import { Link, useNavigate } from 'react-router-dom';
import { Textarea, Button, Alert, Modal } from 'flowbite-react'; 
import Comment from './Comment';
import {HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({postId}) => {
    const navigate = useNavigate();

    const {userInfo} = useSelector((state) => state.auth);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
   

    const submitHandler = async (e) => {
        e.preventDefault();

        if(comment.length > 200 ){
            return;
        };
        try {
            const res = await fetch('/api/comments/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: comment, postId, userId: userInfo._id })
            });
    
            const data = await res.json();
            if(res.ok){
                setComment('');
                setCommentError(null);
                setComments(data, ...comments);
            }
        } catch (error) {
            console.log(error);
            setCommentError(error.message)
        };
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comments/getPostComments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getComments();
    }, [postId]);

    const handleLike = async (comId) => {
        try {
            if(!userInfo){
                navigate('/login')
                return;
            };
            const res = await fetch(`/api/comments/likeComment/${comId}`, {
                method: "PUT",
            });
            if(res.ok){
                const data = await res.json();
               setComments(comments.map((comment) => 
                    comment._id === comId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length,
                    } : comment
               ));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEdite = async (com, editedContent)  => {
        setComments(
            comments.map((c) =>
              c._id === com._id ? { ...c, content: editedContent } : c
            )
         );
    };

    const handleDelete = async (comId) => {
        setShowModal(false);
        try {
          if (!userInfo) {
            navigate('/login');
            return;
          }
          const res = await fetch(`/api/comments/deleteComment/${comId}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            const data = await res.json();
            setComments(comments.filter((comment) => comment._id !== comId));
          }
        } catch (error) {
          console.log(error.message);
        }
      };

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {userInfo ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Connecté en tant que:</p>
                    <img 
                    src={userInfo.profilePicture} 
                    alt="" className='h-5 w-5 object-cover rounded-full'
                    />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-indigo-600 hover:underline'>
                        @{userInfo.name}
                    </Link>
                </div>
            ) : (
                <div className='text-sm text-red-600 my-5'>
                    Vous devez être connecté pour commenter
                    <Link to={'/login'} className='text-indigo-700 hover:underline'></Link>
                </div>
            )}

            {userInfo && (
                <form 
                className='border border-teal-500 rounded-md p-3'
                onSubmit={submitHandler}
                >
                    <Textarea
                    placeholder='Commenter...'
                    rows="3"
                    maxLength="200"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>
                            {200 - comment.length} characters remaining
                        </p>
                        <Button 
                        type='submit'
                        gradientDuoTone='purpleToBlue'
                        >
                            Envoyer
                        </Button>
                    </div>
                    {commentError && (
                    <Alert color="failure" className='mt-5'>
                        {commentError}
                    </Alert>
                    )}
                </form>
            ) }
            {comments.length === 0 ? (
                <p className='text-sm my-5'>Aucun commentaire</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Commentaires</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>

                    {comments.map((com) => (
                        <Comment 
                        key={com._id} 
                        com={com} 
                        onLike={handleLike} 
                        onEdit={handleEdite} 
                        onDelete={(comId) => {
                            setShowModal(true);
                            setCommentToDelete(comId)
                        }}
                        />
                    ) )}
                </>
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
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Êtes-vous sûr de supprimer ce commentaire ?</h3>
                    <div className="flex justify-center gap-4">
                    <Button color='failure'
                    onClick={() => handleDelete(commentToDelete)}
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

export default CommentSection