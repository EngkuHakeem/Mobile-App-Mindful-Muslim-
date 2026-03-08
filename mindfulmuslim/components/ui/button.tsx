import { Button, ButtonProps } from 'react-native'

import { Box } from '@/components/box'

type ThemedButtonProps = ButtonProps & {
  icon?: React.ReactNode
  loading?: boolean
}

export default function ThemedButton({ icon, ...props }: ThemedButtonProps) {
  return (
    <Box className='flex-row items-center'>
      {icon && <Box className='mr-2'>{icon}</Box>}
      <Button {...props} />
    </Box>
  )
}
