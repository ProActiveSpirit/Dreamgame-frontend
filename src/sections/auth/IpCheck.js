import { useState, useEffect } from 'react';
// @mui
import { Typography } from '@mui/material';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function Ipcheck() {
  const [userIP, setUserIP] = useState('');
  const [region, setRegion] = useState('');
  const currentYear = new Date().getFullYear();
 
  useEffect(() => {
    const fetchUserIPAndRegion = async () => {
      try {  
        // Fetch the user's IP address from your server
        const ipResponse = await axios.post('/api/auth/ipcheck');
        setUserIP(ipResponse.data.userIp);
        const response = await axios.get(`https://ipinfo.io/${ipResponse.data.userIp}?token=80a03cd4011e9c`);
        console.log("response" , response);
        setRegion(`${response.data.country} - ${response.data.region}`);
      } catch (error) {
        console.error('Error fetching IP address or region:', error); 
      }
    };

    fetchUserIPAndRegion();
  }, []);

  return (
    <Typography variant="h7">
      © {currentYear} - {userIP || 'Loading IP...'} - {region || 'Loading region...'}
    </Typography>
  );
}