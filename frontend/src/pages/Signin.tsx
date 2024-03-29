import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as appiClient from '../api-clients';
import { useAppContext } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';

export type LoginFormData = {
  email: string;
  password: string;
};
const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  const { showToast } = useAppContext();

  //invalidateQueries function is used to manually mark one or more queries as invalid. This means that the data for those queries will be considered stale, and React Query will automatically refetch the data the next time the affected query is used.
  const queryClient = useQueryClient();
  const mutation = useMutation(appiClient.Signin, {
    onSuccess: async () => {
      showToast({ message: 'Sign in Successful', type: 'SUCCESS' });
      await queryClient.invalidateQueries('validateToken');
      navigate('/');
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit}>
      <h2 className='text-3xl font-bold'> Sign in</h2>
      <div className='flex flex-col md:flex-row gap-5'>
        <label className='text-gray-700 text-sm font-bold flex-1'>
          Email
          <input
            type='email'
            className='border rounded w-full py-1 px-2 font-normal'
            {...register('email', { required: 'This Field is required' })}
          ></input>
          {errors.email && (
            <span className='text-red-500'>{errors.email.message}</span>
          )}
        </label>
        <label className='text-gray-700 text-sm font-bold flex-1'>
          Password
          <input
            type='password'
            className='border rounded w-full py-1 px-2 font-normal'
            {...register('password', {
              required: 'This Field is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          ></input>
          {errors.password && (
            <span className='text-red-500'>{errors.password.message}</span>
          )}
        </label>
      </div>

      <span className='flex items-center justify-between'>
        <span className='text-sm'>
          Not Registered?{' '}
          <Link to='/register' className='underline'>
            Create an account here
          </Link>
        </span>
        <button
          className='bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl'
          type='submit'
        >
          Sign In
        </button>
      </span>
    </form>
  );
};
export default Signin;
