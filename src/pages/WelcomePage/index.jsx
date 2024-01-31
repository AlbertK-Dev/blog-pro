
import React from 'react'

import { Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

function WelcomePage() {
    const user = useLoaderData();

    return (
        <>
            <Typography variant='button'>
                {`${user.displayName} - ${user.email}`}
            </Typography>
            <div>Bienvenu dans l'ultra superberbe app BLOG-PRO</div>
      </>
    
  )
}

export default WelcomePage