import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {Navbar, TextInput, Button, Dropdown, Avatar} from 'flowbite-react';
import {AiOutlineSearch} from 'react-icons/ai';
import {FaMoon, FaSun} from 'react-icons/fa';


import {useLogoutMutation} from "../slices/userApiSlice";
import {logout} from "../slices/authSlice";
import { toggleTheme } from '../slices/themeSlice';




const Header = () => {
    const path = useLocation().pathname;

    const {userInfo} = useSelector((state) => state.auth);
    const {theme} = useSelector((state) => state.theme);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.log(err)
        }
    }

    //Dark mode
    const htmlDoc = document.documentElement;
    if(theme === "light"){
        htmlDoc.classList.remove("dark")
        localStorage.theme = "light";
    }
    if(theme === "dark"){
        htmlDoc.classList.add("dark");
        localStorage.theme = "dark";
    };
    
  
    return (
        <Navbar className='p-6  shadow-md '>
            <Link to='/' 
            className='self-center whitespace-nowrap text-sm 
            sm:text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 
            to-pink-500 rounded p-2 text-white hover:text-gray-300
            dark:text-white'
            >
                <span>BARRY</span>
                -BLOG
            </Link>
            <form>
                <TextInput
                type='text'
                placeholder='Rechercher...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
                />
            </form>
            <Button
            className='w-12 h-10 lg:hidden' 
            color='gray' pill
            >
                <AiOutlineSearch/>
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button className='w-12 h-10 sm:inline' color='gray' pill
                onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'light' ? <FaSun/> : <FaMoon/>}
                </Button>
                {userInfo ? (
                    <Dropdown
                    arrowIcon={false}
                    inline
                    label= {
                        <Avatar
                        alt="User"
                        img={userInfo.profilePicture}
                        rounded
                        />
                    }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{userInfo.name}</span>
                            <span className='block text-sm font-medium truncate'>{userInfo.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>
                                Profil
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider/>
                        <Dropdown.Item  onClick={logoutHandler}>
                            Déconnexion
                        </Dropdown.Item>
                    </Dropdown>
                ) : (     
                    <Link to='/login'>
                        <Button gradientDuoTone='purpleToBlue' pill>
                            Connexion
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle/>
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'}  as={'div'}>
                    <Link to='/'className='text-lg font-semibold hover:border-b hover:border-gray-800 dark:hover:border-white'>
                        Accueil
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about' className='text-lg font-semibold  hover:border-b hover:border-gray-800 dark:hover:border-white'>
                        À Propos
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects' className='text-lg font-semibold  hover:border-b hover:border-gray-800 dark:hover:border-white'>
                        Projets
                    </Link>
                </Navbar.Link>
                {userInfo && userInfo.isAdmin && (
                <Navbar.Link active={path === '/creat-post '} as={'div'}>
                    <Link to={'/creat-post'} className='text-lg font-semibold  hover:border-b hover:border-gray-800 dark:hover:border-white'>
                        Créer 
                    </Link>
                </Navbar.Link>
                )}
            </Navbar.Collapse>
        </Navbar>
    )
};

export default Header;



