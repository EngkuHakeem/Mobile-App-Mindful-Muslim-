export type Hadith = { text: string; source: string; action: string[] }

const FAJR_HADITH: Hadith[] = [
  {
    text: 'The two rak‘ahs of Fajr are better than this world and all that it contains.',
    source: 'Muslim',
    action: [
      'Sleep early with the intention of waking up for Fajr.',
      'Set multiple alarms and place them away from your bed.',
      'Recite the last two verses of Surah Al-Kahf before sleeping.'
    ]
  },
  {
    text: 'He who observes the Fajr and Asr prayers will enter Jannah.',
    source: 'Bukhari & Muslim',
    action: [
      'Make dua before sleeping, asking Allah to wake you up for Fajr.',
      'Drink water before sleeping to help wake up easily.',
      'Get a friend or family member to call you for Fajr.'
    ]
  },
  {
    text: 'Angels descend in succession by night and day, and they meet at the Fajr and ‘Asr prayers.',
    source: 'Bukhari',
    action: [
      'Read about the rewards of Fajr to increase motivation.',
      'Do wudhu before bed to maintain a pure state.',
      'Avoid using your phone excessively before sleeping.'
    ]
  }
] as const

const DHUHR_HADITH: Hadith[] = [
  {
    text: 'Whoever prays Dhuhr, it is as if he has prayed half the night.',
    source: 'Nasai',
    action: [
      'Set a reminder on your phone for Dhuhr prayer.',
      'Plan your schedule around the prayer.',
      'Have a designated prayer space at work/school.'
    ]
  },

  {
    text: 'The most beloved deeds to Allah are those performed regularly, even if they are small.',
    source: 'Bukhari & Muslim',
    action: [
      'Perform Sunnah prayers before and after Dhuhr.',
      'Try to pray in congregation whenever possible.',
      'Take short breaks at work or study to ensure you pray on time.'
    ]
  },
  {
    text: 'The first deed that a person will be called to account for on the Day of Judgment will be their prayer.',
    source: 'Tirmidhi',
    action: [
      'Make prayer a top priority in your daily routine.',
      'Remind yourself that Dhuhr is a shield against Hellfire.',
      'Avoid delaying your prayer to the last minute.'
    ]
  }
]

const ASR_HADITH: Hadith[] = [
  {
    text: 'Whoever misses Asr prayer intentionally, it is as if he lost his family and wealth.',
    source: 'Muslim',
    action: [
      'Set an alarm specifically for Asr prayer.',
      'Pause work/study and take a 5-minute break to pray.',
      'Keep a prayer mat near your workspace.'
    ]
  },
  {
    text: 'Whoever prays Fajr and Asr will enter Jannah.',
    source: 'Bukhari & Muslim',
    action: [
      'Plan activities around the prayer.',
      'Encourage family or friends to pray Asr together.',
      'Set daily goals to pray on time.'
    ]
  },
  {
    text: 'The angels of the night and the day meet at Asr and Fajr prayers.',
    source: 'Bukhari',
    action: [
      'Avoid unnecessary distractions during Asr time.',
      'Read a short Islamic reminder before Asr to boost motivation.',
      'Keep track of your prayer habits to see improvements.'
    ]
  }
]

const MAGHRIB_HADITH: Hadith[] = [
  {
    text: 'Whoever prays Maghrib in congregation, it is as if he has spent the whole night in prayer.',
    source: 'Muslim',
    action: [
      'Prepare for Maghrib 10 minutes before the adhan.',
      'Pray in congregation for extra rewards.',
      'Avoid delaying Maghrib unnecessarily.'
    ]
  },
  {
    text: 'The night prayers begin after Maghrib.',
    source: 'Tirmidhi',
    action: [
      'Stay in the masjid after Maghrib for extra prayers.',
      'Read Quran after Maghrib instead of using your phone.',
      'Reflect on your daily deeds and seek forgiveness.'
    ]
  },
  {
    text: 'The Prophet (SAW) never missed praying two Sunnah after Maghrib.',
    source: 'Bukhari',
    action: [
      'Make it a habit to pray the Sunnah prayers after Maghrib.',
      'Use Maghrib time to reset your energy for the night.',
      "Plan your night's activities around Maghrib."
    ]
  }
]

const ISHA_HADITH: Hadith[] = [
  {
    text: 'Whoever prays Isha in congregation, it is as if he has prayed half the night.',
    source: 'Muslim',
    action: [
      'Pray Isha as soon as possible.',
      'Avoid watching TV or using social media before Isha.',
      "Make dua after Isha for Allah's guidance."
    ]
  },
  {
    text: 'The most difficult prayers for hypocrites are Fajr and Isha.',
    source: 'Bukhari & Muslim',
    action: [
      'Remind yourself of the great reward of praying Isha on time.',
      'Sleep after Isha to wake up early for Fajr.',
      'Recite Surah Mulk before sleeping for protection.'
    ]
  },
  {
    text: 'Whoever prays Isha in congregation, it is as if he prayed the entire night.',
    source: 'Muslim',
    action: [
      'Aim to pray in congregation whenever possible.',
      'Set a fixed time for Isha daily.',
      'Use Isha as a closing moment to reflect on your day.'
    ]
  }
]

export const HADITHS_RECORD = {
  fajr: FAJR_HADITH,
  dhuhr: DHUHR_HADITH,
  asr: ASR_HADITH,
  maghrib: MAGHRIB_HADITH,
  isha: ISHA_HADITH
}
