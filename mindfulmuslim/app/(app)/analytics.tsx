import { Monthly } from '@/components/analytics/monthly'
import { Weekly } from '@/components/analytics/weekly'
import { Colors } from '@/constants/colors'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useState } from 'react'
import { useColorScheme, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

const renderScene = SceneMap({
  weekly: Weekly,
  monthly: Monthly
})

export default function TabTwoScreen() {
  const layout = useWindowDimensions()
  const colorScheme = useColorScheme()

  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'weekly', title: 'Weekly' },
    { key: 'monthly', title: 'Monthly' }
  ])

  return (
    <SafeAreaView
      className='flex-1 bg-background dark:bg-background-dark'
      edges={['top', 'left', 'right']}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}
            indicatorStyle={{ backgroundColor: Colors[colorScheme ?? 'light'].tint }}
            activeColor={Colors[colorScheme ?? 'light'].text}
            inactiveColor='#888'
          />
        )}
      />
    </SafeAreaView>
  )
}
