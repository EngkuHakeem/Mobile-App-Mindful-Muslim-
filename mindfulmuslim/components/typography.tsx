import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Text, type TextProps } from 'react-native'

const viewType = cva('transition-colors', {
  variants: {
    type: {
      default: 'dark:text-white',
      label: 'text-gray-500 uppercase font-semibold',
      title: 'text-3xl font-bold dark:text-white',
      subtitle: 'text-2xl font-semibold dark:text-white',
      icon: 'text-icon dark:text-icon-dark',
      link: 'text-tint dark:text-tint-dark'
    }
  },
  defaultVariants: {
    type: 'default'
  }
})

type TypographyProps = TextProps & VariantProps<typeof viewType>

export function Typography({ type, className, style, ...textProps }: TypographyProps) {
  return <Text {...textProps} className={cn(className, viewType({ type }))} style={style} />
}
