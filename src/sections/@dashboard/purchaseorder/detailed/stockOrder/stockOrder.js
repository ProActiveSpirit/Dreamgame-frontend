import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import { DataGrid } from '@mui/x-data-grid';
import {
  Stack,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
// components
import Iconify from '../../../../../components/iconify';
import Label from '../../../../../components/label';
import _mock from '../../../../../_mock';

// ----------------------------------------------------------------------

// Helper function to generate realistic data
const generateRandomData = (count) => {
  // Sample first names
  const firstNames = ['Marcel', 'Anna', 'Thomas', 'Sophie', 'Jan', 'Maria', 'Felix', 'Laura', 'Lukas', 'Emma', 
                     'Paul', 'Julia', 'Max', 'Lena', 'David', 'Lisa', 'Michael', 'Sarah', 'Andreas', 'Nicole'];
  
  // Sample last names
  const lastNames = ['König', 'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz',
                    'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz'];
  
  // Email domains
  const emailDomains = ['hotmail.com', 'gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'mail.com', 'web.de', 'gmx.de', 'aol.com', 'protonmail.com'];
  
  // Country codes for IPs
  const countryCodes = ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'PL', 'SE', 'NO', 'DK', 'FI', 'PT'];
  
  // Statuses with weighted distribution
  const statuses = [
    'pending', 'pending', 'pending', 'pending',  // More pending entries
    'processing', 'processing', 'processing',
    'completed', 'completed',
    'error',
    'returned'
  ];
  
  // Generate data
  return Array(count).fill(0).map((_, index) => {
    // Generate name
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    // Generate email
    const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}@${emailDomains[Math.floor(Math.random() * emailDomains.length)]}`;
    
    // Generate IP and country
    const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    const country1 = countryCodes[Math.floor(Math.random() * countryCodes.length)];
    const country2 = countryCodes[Math.floor(Math.random() * countryCodes.length)];
    
    // Generate order number and notes
    const orderNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}${Math.floor(10000000 + Math.random() * 90000000)}`;
    const notes = Math.random() > 0.7 ? 'NULL' : ['Payment confirmed', 'Customer request', 'Priority delivery', 'Discount applied'][Math.floor(Math.random() * 4)];
    
    // Generate status
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate keys, sold, packed based on status
    let keys = '';
    let sold = 'N/A';
    let packed = 'N/A';
    
    if (status === 'completed') {
      const keyCount = Math.floor(Math.random() * 5) + 1;
      keys = `${keyCount} key${keyCount > 1 ? 's' : ''}`;
      sold = 'Yes';
      packed = 'Yes';
    } else if (status === 'processing') {
      const keyCount = Math.floor(Math.random() * 5) + 1;
      keys = `${keyCount} key${keyCount > 1 ? 's' : ''}`;
      sold = 'No';
      packed = Math.random() > 0.5 ? 'Yes' : 'No';
    }
    
    // Generate scheduled date (future dates for pending, past dates for others)
    let scheduledDate;
    if (status === 'pending') {
      // Future date (1-14 days ahead)
      scheduledDate = new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000);
    } else {
      // Past date (1-30 days in the past)
      scheduledDate = new Date(Date.now() - (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000);
    }
    
    // Format the date as requested
    const formattedDate = `${String(scheduledDate.getDate()).padStart(2, '0')}.${String(scheduledDate.getMonth() + 1).padStart(2, '0')}.${scheduledDate.getFullYear()} ${String(scheduledDate.getHours()).padStart(2, '0')}:${String(scheduledDate.getMinutes()).padStart(2, '0')}:${String(scheduledDate.getSeconds()).padStart(2, '0')}`;
    
    return {
      id: _mock.id(index),
      CUSTOMER: {
        name: fullName,
        email: email,
        ip: `${ip} (${country1}/${country2})`,
      },
      SCHEDULED_DATE: formattedDate,
      STATUS: status,
      ORDER_NUMBER: `${orderNumber} / ${notes}`,
      KEYS: keys,
      SOLD: sold,
      PACKED: packed,
    };
  });
};

export default function StockOrderTable({ tableData, onDataChange }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [localData, setLocalData] = useState([]);
  
  useEffect(() => {
    setLocalData(tableData || []);
  }, [tableData]);

  // Calculate status counts
  const statusCounts = {
    all: localData.length,
    pending: localData.filter(item => item.STATUS === 'pending').length,
    processing: localData.filter(item => item.STATUS === 'processing').length,
    completed: localData.filter(item => item.STATUS === 'completed').length,
    error: localData.filter(item => item.STATUS === 'error').length,
    returned: localData.filter(item => item.STATUS === 'returned').length,
  };

  const handleChangeStatus = (event) => {
    setFilterStatus(event.target.value);
  };

  const columns = [
    {
      field: 'CUSTOMER',
      headerName: 'CUSTOMER',
      flex: 2,
      minWidth: 220,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack spacing={0.5} alignItems="center" sx={{ py: 2, width: '100%' }}>
          <Typography variant="body2">{params.value.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{params.value.email}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{params.value.ip}</Typography>
        </Stack>
      ),
    },
    {
      field: 'SCHEDULED_DATE',
      headerName: 'SCHEDULED DATE',
      flex: 1.5,
      minWidth: 160,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'STATUS',
      headerName: 'STATUS',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const getColor = (status) => {
          switch (status) {
            case 'pending':
              return 'warning';
            case 'processing':
              return 'info';
            case 'completed':
              return 'success';
            case 'error':
              return 'error';
            case 'returned':
              return 'default';
            default:
              return 'default';
          }
        };
        return <Label color={getColor(params.value)}>{params.value}</Label>;
      },
    },
    {
      field: 'ORDER_NUMBER',
      headerName: 'ORDER NUMBER / NOTES',
      flex: 2,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'KEYS',
      headerName: 'KEYS',
      flex: 0.8,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'SOLD',
      headerName: 'SOLD',
      flex: 0.8,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'PACKED',
      headerName: 'PACKED',
      flex: 1,
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'ACTION',
      headerName: 'ACTION',
      flex: 2,
      minWidth: 300,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        // Different actions based on status
        const actionButtons = [];
        
        // GET KEYS button (for pending and processing)
        if (['pending', 'processing'].includes(params.row.STATUS)) {
          actionButtons.push(
            <Button 
              key="getkeys" 
              variant="outlined" 
              size="small" 
              color="primary"
              sx={{ fontSize: '0.7rem' }}
            >
              GET KEYS
            </Button>
          );
        }
        
        // RETURN button (for completed and error)
        if (['completed', 'error'].includes(params.row.STATUS)) {
          actionButtons.push(
            <Button 
              key="return" 
              variant="outlined" 
              size="small" 
              color="warning"
              sx={{ fontSize: '0.7rem' }}
            >
              RETURN
            </Button>
          );
        }
        
        // FORCE BUY button (for all except completed)
        if (params.row.STATUS !== 'completed') {
          actionButtons.push(
            <Button 
              key="forcebuy" 
              variant="outlined" 
              size="small" 
              color="success"
              sx={{ fontSize: '0.7rem' }}
            >
              FORCE BUY
            </Button>
          );
        }
        
        // DELETE button (for all)
        actionButtons.push(
          <Button 
            key="delete" 
            variant="outlined" 
            size="small" 
            color="error"
            sx={{ fontSize: '0.7rem' }}
          >
            DELETE
          </Button>
        );
        
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            {actionButtons}
          </Stack>
        );
      },
    },
  ];

  // Filter data based on selected status
  const filteredData = filterStatus === 'all' 
    ? localData 
    : localData.filter(item => item.STATUS === filterStatus);

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center" 
        justifyContent="flex-start"
        sx={{ mb: 3, px: 2 }}
      >
        <RadioGroup
          row
          value={filterStatus}
          onChange={handleChangeStatus}
        >
          <FormControlLabel 
            value="all" 
            control={<Radio />} 
            label={`All (${statusCounts.all})`} 
          />
          <FormControlLabel 
            value="pending" 
            control={<Radio />} 
            label={`Pending (${statusCounts.pending})`} 
          />
          <FormControlLabel 
            value="processing" 
            control={<Radio />} 
            label={`Processing (${statusCounts.processing})`} 
          />
          <FormControlLabel 
            value="completed" 
            control={<Radio />} 
            label={`Completed (${statusCounts.completed})`} 
          />
          <FormControlLabel 
            value="error" 
            control={<Radio />} 
            label={`Error (${statusCounts.error})`} 
          />
          <FormControlLabel 
            value="returned" 
            control={<Radio />} 
            label={`Returned (${statusCounts.returned})`} 
          />
        </RadioGroup>
      </Stack>
      
      <DataGrid 
        columns={columns} 
        rows={filteredData} 
        checkboxSelection 
        disableSelectionOnClick 
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 100}
        sx={{
          width: '100%',
          '& .MuiDataGrid-cell': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            whiteSpace: 'normal',
            padding: '16px 8px',
          },
          '& .MuiDataGrid-row': {
            minHeight: '100px !important',
          },
          '& .MuiDataGrid-renderingZone': {
            '& .MuiDataGrid-row': {
              minHeight: '100px !important',
            }
          },
        }}
      />
    </Box>
  );
}

StockOrderTable.propTypes = {
  tableData: PropTypes.array,
  onDataChange: PropTypes.func,
};

// Export the data generation function for external use
export { generateRandomData };
