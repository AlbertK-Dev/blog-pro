import { Stack } from '@mui/material'
import React from 'react'
import PostCardSkeleton from '../../../../components/Skeletons/PostCardSkeleton'

function welcomePageSkeleton() {
  return (
      <Stack spacing={1}>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
          
          
    </Stack>
  )
}

export default welcomePageSkeleton