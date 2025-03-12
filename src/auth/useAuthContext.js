import { useContext } from 'react';
//
import { AuthContext } from './JwtContext';
// import { AuthContext } from './Auth0Context';
// import { AuthContext } from './FirebaseContext';
// import { AuthContext } from './AwsCognitoContext';

// ----------------------------------------------------------------------

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return {
    ...context,
    // register: async (email, password, firstName, lastName) => {
    //   const response = await fetch('/api/auth/register', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password, firstName, lastName }),
    //   });
    //   console.log('Regsiter response', response);
    //   let data;
    //   const contentType = response.headers.get('content-type');

    //   try {
    //     // Only try to parse as JSON if the content-type is json
    //     if (contentType && contentType.includes('application/json')) {
    //       data = await response.json();
    //     } else {
    //       // If not JSON, get the text content
    //       const text = await response.text();
    //       throw new Error('Server returned an invalid response');
    //     }
    //   } catch (error) {
    //     throw new Error('Failed to process server response');
    //   }

    //   if (!response.ok) {
    //     throw new Error(data?.message || 'Registration failed');
    //   }

    //   return data;
    // },
  };
};
