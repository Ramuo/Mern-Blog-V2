import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import illustration from '../assets/img/illustration.png';
import {toast} from 'react-toastify';
import OAuth from '../components/OAuth';

import {useRegisterMutation} from "../slices/userApiSlice";
import {setCredentials} from "../slices/authSlice";


const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [name, setName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');

  const [register, {isLoading}] = useRegisterMutation();

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
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <section className="container px-4 mx-auto min-h-screen mt-20">
      <main className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-10 lg:mb-0 sm:px-6">
            <div className="max-w-md">
              <img src={illustration} alt="blog" />
            </div>
          </div>
         
          <div className='flex-1 mx-4'>
            <h3 className="mb-3 text-2xl text-dark text-center font-bold font-heading pt-6">
                S'inscrire
            </h3>
            <form 
            className='flex flex-col gap-4'
            onSubmit={submitHandler}
            >
              <div>
                <Label value='Nom' className='text-lg '/>
                <TextInput
                  type='text'
                  id='username'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label value='Email' className='text-lg '/>
                <TextInput
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label value='Mot de Passe' className='text-lg '/>
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
                        <Spinner size='sm' />
                        <span className='pl-3'>Loading...</span>
                      </>
                    ) : (
                      'Envoyer'
                    )
                }
              </Button>
              <OAuth/>
            </form>
            <div className='flex gap-2 text-sm '>
              <span>Vous avez déjà un compte?</span>
              <Link  to={redirect ? `/login?redirect=${redirect}` : '/login'} className='text-blue-500'>
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default RegisterPage