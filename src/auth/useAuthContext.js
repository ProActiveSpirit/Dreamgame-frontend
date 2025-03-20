import { useContext } from 'react';
//
import { AuthContext } from './JwtContext';
import axios from '../utils/axios';
// import { AuthContext } from './Auth0Context';
// import { AuthContext } from './FirebaseContext';
// import { AuthContext } from './AwsCognitoContext';

// ----------------------------------------------------------------------

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return {
    ...context,
    register: async (email, password, firstName, lastName) => {
      console.log("auth register", email, password, firstName, lastName);
      const response = await axios.post('/api/auth/register', 
        { email, password, firstName, lastName }
      );
      console.log("auth response1", response.data);

      if (!response.ok) {
        const error = await response.data.json();
        throw new Error(error.message);
      }

      // At this point, your backend should send a verification email with a code
      return response.data.json();
    },
  };
};
