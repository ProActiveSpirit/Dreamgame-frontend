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
        console.log("ipResponse" , ipResponse.data.userIp);
        const ip = ipResponse.data.userIp; // Ensure it returns the IP as data.ip
        setUserIP(ip);

        // Use ip-api.com to get the user's region without an API key
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const regionData = geoResponse.data;
        setRegion(`${regionData.regionName} - ${regionData.country}`);
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