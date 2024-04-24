import {Link} from 'react-router-dom';
import {FaGithub, FaLinkedin, FaTwitter, FaDiscord} from "react-icons/fa";

const Footer = () => {
    const footerYear = new Date().getFullYear();
    return (
        <footer className="border border-t-8 border-purple-500">
            <div className="container py-10 mx-auto">
                <div className="flex flex-col items-center mb-8 space-y-6 md:flex-row md:space-y-0 md:justify-between md:items-start">
                    <div className="flex flex-col items-center space-y-8 md:items-start md:space-y-5">
                        <div className="h-8 pl-3"> 
                            <Link to='/' 
                            className='self-center whitespace-nowrap text-sm 
                            sm:text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 
                            to-pink-500 rounded p-2 text-white hover:text-gray-300 
                            '
                            >
                                <span>BARRY</span>
                                -BLOG
                            </Link>
                        </div>
                        <div className="flex flex-col items-center space-y-4 text-gray-800  font-semibold md:flex-row md:space-y-0 md:space-x-6 md:ml-3 dark:text-gray-200"> 
                            <div className=" h-10 group">
                                <Link to="/home">Accueil</Link>
                                <div className="group-hover:border-b group-hover:border-gray-800 dark:group-hover:border-gray-200"></div>
                            </div>
                            <div className=" h-10 group">
                                <Link to="/about">À Propos</Link>
                                <div className="group-hover:border-b group-hover:border-gray-800 dark:group-hover:border-gray-200"></div>
                            </div>
                            <div className=" h-10 group">
                                <Link to="/projects">Projets</Link>
                                <div className="group-hover:border-b group-hover:border-gray-800 dark:group-hover:border-gray-200 "></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between space-y-4 text-gray-500">
                        <div className="flex items-center justify-center mx-auto space-x-4 md:justify-end md:mx-0"> 
                            <div className="h-8 group">
                                <Link to='https://support.discord.com/hc/fr/profiles/22690334605591' target='_blank' className="hover:text-violet-600 text-3xl">
                                    <FaDiscord />
                                </Link>
                            </div>
                            <div className="h-8 group">
                                <Link to='https://twitter.com/baosaram' target='_blank' className="hover:text-blue-500 text-3xl">
                                    <FaTwitter />
                                </Link>
                            </div>
                            <div className="h-8 group">
                                <Link to='https://github.com/Ramuo' target='_blank'>
                                    <FaGithub className="hover:text-gray-700 text-3xl"/>
                                </Link>
                            </div>
                            <div className="h-8 group">
                                <Link to='https://www.linkedin.com/in/alpha-barry-paris/' target='_blank'>
                                    <FaLinkedin className="hover:text-blue-500 text-3xl mr-4"/>
                                </Link>
                            </div>
                        </div>
                        <div className="text-xs font-bold">
                            &copy; Tous droits réservés {footerYear}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer