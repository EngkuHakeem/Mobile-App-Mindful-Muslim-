import { Link, Stack } from 'expo-router'

import { Box } from '@/components/box'
import { Typography } from '@/components/typography'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Box className='flex-1 items-center justify-center p-5'>
        <Typography type='title'>This screen doesn't exist.</Typography>
        <Link href='/' className='mt-4 px-4'>
          <Typography type='link'>Go to home screen!</Typography>
        </Link>
      </Box>
    </>
  )
}
