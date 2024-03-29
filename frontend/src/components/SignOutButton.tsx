import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-clients';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    mutation.mutate();
  };

  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      showToast({ message: 'Signed Out', type: 'SUCCESS' });
      queryClient.invalidateQueries('validateToken');
      navigate('/sign-in');
    },
    onError: (err: Error) => {
      showToast({ message: err.message, type: 'ERROR' });
    },
  });

  return (
    <button
      onClick={handleClick}
      className='text-blue-600 px-3 font-bold bg-white hover:bg-gray-100'
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
