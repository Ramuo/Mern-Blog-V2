import {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import {Button, Label, Spinner, TextInput } from 'flowbite-react';
import blog from '../assets/img/blog.png';
import OAuth from '../components/OAuth';


import {useLoginMutation} from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';




const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  

  const [login, {isLoading}] = useLoginMutation();

  const {userInfo} = useSelector((state) => state.auth);


  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({email, password}).unwrap();
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <section className="container px-4 mx-auto min-h-screen mt-2">
      <main className="max-w-5xl mx-auto ">
        <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 sm:px-6">
              <div className="max-w-md">
                <img src={blog} alt="blog" />
              </div>
            </div>
          
            <div className='flex-1 mx-4'>
              <h3 className="mb-4 text-2xl text-dark text-center font-bold font-heading pt-6">
                  Se Connecter
              </h3>
              <form 
              className='flex flex-col gap-4'
              onSubmit={submitHandler}
              >
                <div>
                  <Label value='Email' className="text-lg" />
                  <TextInput
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label value='Mot de Passe' className="text-lg"/>
                  <TextInput
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  gradientDuoTone='purpleToPink'
                  type='submit'
                  className="my-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size='sm'/>
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Connexion"
                  )}
                </Button>
                <OAuth/>
              </form>
              <div className='flex justify-between text-sm'>
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className='text-blue-500'>
                  Vous n'avez pas de compte ?
                </Link>
                <Link to='/#!' className='text-blue-500 ml-6'>
                  Mot de passe oublié ?
                </Link>
              </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default LoginPage;