import {useEffect, useState} from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {Textarea, Button} from "flowbite-react";
import {FaThumbsUp, FaTrash, FaEdit} from 'react-icons/fa';

const Comment = ({com, onLike, onEdit, onDelete}) => {
    const {userInfo} = useSelector((state) => state.auth);

    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(com.content);
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/${com.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [com]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(com.content);
    };

    const handleSave = async () => {
        try {
          const res = await fetch(`/api/comments/editComment/${com._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: editedContent,
            }),
          });
          if (res.ok) {
            setIsEditing(false);
            onEdit(com, editedContent);
          }
        } catch (error) {
          console.log(error.message);
        }
    };

    return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img 
            src={user.profilePicture} 
            alt={user.name}
            className='w-10 h-10 rounded-full bg-gray-200'
            />
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.name}` : ' utilisateur anonyme'}</span>
                <span className='text-gray-500 text-xs'>
                    {moment(com.createdAt).fromNow()}
                </span>
            </div>
            {isEditing ? (
                <>
                    <Textarea
                    className='mb-2'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className='flex justify-end gap-2 text-xs'>
                        <Button
                            type='button'
                            size='sm'
                            gradientDuoTone='purpleToBlue'
                            onClick={handleSave}
                        >
                            Sauvegarder
                        </Button>
                        <Button
                            type='button'
                            size='sm'
                            gradientDuoTone='purpleToBlue'
                            outline
                            onClick={() => setIsEditing(false)}
                        >
                            Annuler
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <p className='text-gray-500 pb-2'>{com.content}</p>
                    <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                        <button 
                        type="button" 
                        className={`text-gray-400 hover:text-blue-500 ${
                            userInfo &&
                            com.likes.includes(userInfo._id) &&
                            '!text-blue-500'
                        }`}
                        onClick={() => onLike(com._id)}
                        >
                            <FaThumbsUp className='text-sm hover:cursor-pointer'/>
                        </button>
                        <p className='text-gray-400'>
                            {com.numberOfLikes > 0 &&
                            com.numberOfLikes +
                                ' ' +
                                (com.numberOfLikes === 1 ? 'like' : 'likes')}
                        </p>
                        {
                            userInfo && (userInfo._id === userInfo.userId || userInfo && userInfo.isAdmin) && (
                                <>
                                    <FaEdit 
                                    className='text-sm text-gray-400 hover:text-blue-500 hover:cursor-pointer'
                                    onClick={handleEdit}
                                    />
                                     <FaTrash 
                                    className='text-sm text-red-400 hover:text-red-600 hover:cursor-pointer'
                                    onClick={() => onDelete(com._id)}
                                    />
                                </>
                            )
                        }
                      
                    </div>
                </>
            )}
        </div>
    </div>
    )
}

export default Comment;