/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#fff'

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f3f2f7',
    accent: '#E4E7EB',
    card: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#ECEDEE',
    background: '#272727',
    accent: '#303030',
    card: '#1c1c1e',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark
  }
}

export const statusColors: { [key: string]: { color: string; explanation: string } } = {
  jamaah: { color: '#80b9fa', explanation: 'Jamaah - Prayer performed in congregation' },
  ontime: { color: '#21cb5a', explanation: 'On Time - Prayed on time (30 min)' },
  late: { color: '#d38b16', explanation: 'Late - Prayed late (30 min - 1 hour)' },
  missed: { color: '#cd2222', explanation: 'Missed - Prayer not performed' },
  upcoming: { color: '#5F5F5F', explanation: 'Upcoming - Prayer yet to be performed' },
  missing: { color: '#966A6A', explanation: 'Missing - No record of prayer' }
}
