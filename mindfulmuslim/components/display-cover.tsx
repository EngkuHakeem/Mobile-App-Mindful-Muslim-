import { ReactNode } from 'react'
import { Image } from 'react-native'

import { Box } from '@/components/box'

export function DisplayCover({ children }: { children?: ReactNode }) {
  return (
    <Box className='flex flex-col flex-1'>
      <Box className='flex-1 justify-center items-center gap-4'>
        <Image
          className='w-[220px] h-[250px]'
          source={require('../assets/images/pray-together.png')}
        />
        {children}
      </Box>
    </Box>
  )
}
