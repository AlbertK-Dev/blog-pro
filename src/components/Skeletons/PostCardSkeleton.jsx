import React from 'react'
import { useDimensions } from '../../hooks/useDimensions'
import {  Card, CardActions, CardHeader, Skeleton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';

function PostCardSkeleton({ widthDetail=false}) {

  const {innerWidth} = useDimensions()
    const SMALL_DEVICE_WIDTH = 600
    const onSmallDevice = innerWidth <= SMALL_DEVICE_WIDTH
      
    const CARD_HEIGHT = '600px';
    const CARD_IMG_HEIGHT = onSmallDevice? '400px':'500px'
   // const MIN_CARD_IMG_HEIGHT = '300px'
    
    

  return (
    <Card  sx={{ maxWidth:innerWidth <= 600 ? innerWidth - 50 :'100%', minHeight:CARD_HEIGHT}}>
    {!widthDetail && <CardHeader
      avatar={
        <Skeleton variant='circular' width={64} height={64}  />       
         
      }
      action={
          <MoreVertIcon/>
        
      }
      title={<Skeleton variant='text'/>}
      subheader={<Skeleton variant='text'/>}
      
        />}
    
        
    <Skeleton variant="rectangular" width={'100%'} height={CARD_IMG_HEIGHT} />
      
    
           
    <CardActions sx={{ position:'relative',height: 50, width:'100%', transform: 'translateZ(0px)', flexGrow: 1 }} disableSpacing>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />

    </CardActions>
    
  </Card>
  )
}

export default PostCardSkeleton