import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {Sidebar} from 'flowbite-react';
import {HiArrowSmRight, HiUser, HiDocumentText, HiOutlineUserGroup} from 'react-icons/hi';

import {useLogoutMutation} from "../slices/userApiSlice";
import { logout } from '../slices/authSlice';

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userInfo} = useSelector((state) => state.auth);

    const [logoutApiCall] = useLogoutMutation();
  
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
        setTab(tabFromUrl);
        }
    }, [location.search]);

    const logoutHandler = async () => {
      try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
      } catch (err) {
          console.log(err)
      }
    }


    return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items >
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item 
                    active={tab === 'profile'} 
                    icon={HiUser} label={userInfo.isAdmin ? 'Admin' : 'User' } 
                    labelColor='dark'
                    as='div'
                    >
                        Profil
                    </Sidebar.Item>
                </Link>

                {userInfo.isAdmin && (
                    <>
                        <Link to='/dashboard?tab=posts'>
                            <Sidebar.Item
                            active={tab === 'posts'}
                            icon={HiDocumentText}
                            as='div'
                            >
                                Publications
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item
                            active={tab === 'users'}
                            icon={HiOutlineUserGroup}
                            as='div'
                            >
                                Utilisateurs
                            </Sidebar.Item>
                        </Link>
                    </>
                ) }
                <Sidebar.Item 
                icon={HiArrowSmRight} 
                className='cursor-pointer'
                onClick={logoutHandler}
                >
                    Se deconnecter
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
    )
}

export default DashSidebar;