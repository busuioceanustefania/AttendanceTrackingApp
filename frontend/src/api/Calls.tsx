import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const api = axios.create({
    baseURL: 'http://localhost:9000/api',
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {           
            console.error('Error response:', error.response.data);
        } else if (error.request) {           
            console.error('No response received:', error.request);
        } else {           
            console.error('Error setting up the request:', error.message);
        }      
        return Promise.reject(error);
    }
);

// function AlertComponent() {
//     const [error, setError] = useState<string | null>(null); // Specify type as string | null
  
//     api.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError) => {
//         if (error.response) {
//           const errorMessage = 'Error response: ' + error.response.data;
//           console.error(errorMessage);
//           setError(errorMessage);
//         } else if (error.request) {
//           const errorMessage = 'No response received: ' + error.request;
//           console.error(errorMessage);
//           setError(errorMessage);
//         } else {
//           const errorMessage = 'Error setting up the request: ' + error.message;
//           console.error(errorMessage);
//           setError(errorMessage);
//         }
//         return Promise.reject(error);
//       }
//     );
  
//     // ... your other functions ...
  
//     return (
//       <div>
//         {/* ... your other components ... */}
  
//         {/* Render the Alert component based on the error state */}
//         {error && (
//           <Alert severity="error">
//             <AlertTitle>Error</AlertTitle>
//             {error}
//           </Alert>
//         )}
//       </div>
//     );
//   }

async function get(url: string, queryParams: any = null, id: any = null) {
    let newUrl = !id ? url : url + "/" + id;
    return (await api.get(newUrl, { params: queryParams })).data;
}

async function post(url: string, item: any) {
    return (await api.post(
        url,
        item,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )).data;
}

async function put(url: string, id: any, item: any) {
    return (await api.put(
        url + "/" + id,
        item,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )).data;
}

async function remove(url: string, id: any) {
    return (await api.delete(
        url + "/" + id
    )).data;
}

export { get, post, put, remove } 