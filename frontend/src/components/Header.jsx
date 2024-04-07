import { Link, useLocation } from 'react-router-dom';
import {Navbar, TextInput, Button} from 'flowbite-react';
import {AiOutlineSearch} from 'react-icons/ai';
import {FaMoon} from 'react-icons/fa';



const Header = () => {
    const path = useLocation().pathname;
    return (
        <Navbar className='p-6 shadow-lg bg-neutral'>
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
                <Button className='w-12 h-10 sm:inline' color='gray' pill>
                    <FaMoon/>
                </Button>
                <Link to='/login'>
                    <Button gradientDuoTone='purpleToBlue' pill>
                        Connexion
                    </Button>
                </Link>
                <Navbar.Toggle/>
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'}  as={'div'}>
                    <Link to='/'>
                        Accueil
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>
                        À Propos
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects'>
                        Projets
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
};

export default Header;



