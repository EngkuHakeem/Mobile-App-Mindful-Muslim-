import { Box } from '@/components/box'
import { Typography } from '@/components/typography'
import { cn } from '@/lib/utils'
import { Image, type ImageProps } from 'react-native'

type AvatarProps = ImageProps & {
  url: string | null | undefined
  displayName?: string | null
}

export function Avatar({ className, url, displayName, ...textProps }: AvatarProps) {
  if (!url || url === '')
    return (
      <Box className={cn('rounded-full bg-green-950 flex justify-center items-center', className)}>
        <Typography className='text-white'>
          {displayName ? displayName.charAt(0).toUpperCase() : 'N/A'}
        </Typography>
      </Box>
    )

  return <Image {...textProps} className={cn('rounded-full', className)} source={{ uri: url }} />
}
