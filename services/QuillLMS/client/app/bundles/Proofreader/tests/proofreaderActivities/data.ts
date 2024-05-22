import { ProofreaderActivity } from "../../interfaces/proofreaderActivities"
import { ProofreaderActivityState } from "../../reducers/proofreaderActivitiesReducer"

export const currentActivity: ProofreaderActivity = {
  description: "Correct the following nine errors.",
  flag: "production",
  passage:
    "Coney Island is both a neighborhood in {+Brooklyn, New York,-Brooklyn New York|1AJtvwkbBLHzYg2a4eRcBA} and an amusement park. {+There are-They’re|8NObTn-ErGu5tADF0LWxbQ} many tourist attractions at Coney Island like the Cyclone rollercoaster and the Wonder Wheel ferris wheel. Coney means rabbit. There is a theory that the island is named Coney because there was a large population of wild rabbits when the area was {+an-a|5s-r1281DV8EpHyc9qJfiw} English colony in the 1600s. The Cyclone roller coaster was built in 1927, and it is one of the few wooden roller coasters still in use in the United States. The Cyclones {+is-are|Tlhrx6Igxn6cR_SD1U5efA} also the name of the minor league baseball team that plays at the stadium in the neighborhood.  There is a  parachute jump from the 1939 {+World's-Worlds|nAcT-C3UfPFuhWcf0JJNMw} Fair still intact, and although it is no longer used, it is a landmark occasionally referred {+to-too|Oo9MdluHtJFdh5d1uL9qYQ} as the Effiel Tower of Brooklyn. The New York Aquarium is near Coney Island, just one subway stop away at a station {+called-call|IDyiKUM8LLD7Bz8ftg6p0A} West Eighth Street. The Coney Island stop is the last stop on the F line subway. <br/><br/>\n\nOver the years, Coney Island has expanded to have a few parks with rides. There is a park called {+Astroland-astroland|YkA1YFe-dUvXqkEXxbNgQw} and another section called Luna Park that has rides for smaller kids. The boardwalk of Coney Island is thriving with food stands, including the original Nathan’s Hot Dog stand. Every year at Coney Island, Nathan’s hosts a hot dog eating contest. The winner of the contest usually  eats around 150 hot dogs in an {+extremely-extreme|Jm8fUXNgIR66RYWt51OVyQ} short period of time. Also annually at Coney Island is the Mermaid Parade, where people dress up as mermaids. The mayor of New York is always in attendance.<br/><br/>",
  standard: {
    name: "CCSS Grade 7 Summative Assessments",
    uid: "pM3sNYWnNnWdR5YKu7lAHw",
  },
  standardLevel: {
    name: "7th Grade CCSS",
    uid: "8g1_400wzXuijt4NB9uqtw",
  },
  title: "Coney Island",
  standardCategory: {
    name: "Summative Assessments",
    uid: "XSx6hcLxlSf1WKaJFWgsNA",
  },
  underlineErrorsInProofreader: false,
}

export const ProofreaderActivityReducer: ProofreaderActivityState = {
  currentActivity,
  hasreceiveddata: true,
  data: {
    "-KMyh3LulfVL0_KuPb8u": currentActivity,
  },
  states: {},
}

export const conceptsFeedback = {
  hasreceiveddata: false,
  submittingnew: false,
  data: {},
  states: {},
  newConceptModalOpen: false,
}
