import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Platform, StyleProp, View, ViewProps, ViewStyle } from 'react-native'

const viewType = cva('transition-colors', {
  variants: {
    type: {
      default: 'bg-transparent',
      card: 'bg-accent dark:bg-accent-dark p-4 rounded-lg',
      background: 'bg-background dark:bg-background-dark',
      accent: 'bg-accent dark:bg-accent-dark',
      tint: 'bg-tint dark:bg-tint-dark'
    }
  },
  defaultVariants: {
    type: 'default'
  }
})

type BoxProps = ViewProps & VariantProps<typeof viewType>

export function Box({ type, className, style, ...viewProps }: BoxProps) {
  // const platform = Platform.OS
  const isCard = type === 'card'
  const iosShadow: StyleProp<ViewStyle> = isCard
    ? {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
      }
    : {}
  const androidShadow: StyleProp<ViewStyle> = isCard
    ? {
        elevation: 5
      }
    : {}

  return (
    <View
      className={cn(viewType({ type }), className)}
      {...viewProps}
      style={[style]}
      // style={[platform === 'android' ? androidShadow : iosShadow, style]}
    />
  )
}
