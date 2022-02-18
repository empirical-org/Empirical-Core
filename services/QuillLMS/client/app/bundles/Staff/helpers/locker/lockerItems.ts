import {
  EVIDENCE, CONNECT, DIAGNOSTIC, GRAMMAR, LESSONS, PROOFREADER, CURRICULUM, PARTNERSHIPS,
  PRODUCT, SUPPORT, PATHWAYS
} from "../../../Shared"

import {
  USERS, SCHOOLS, UNARCHIVE_UNITS, TEACHER_FIXES, POSTS, POST_IMAGES,
  ANNOUNCEMENTS, UPLOAD_ROSTERS, ACTIVITIES, ACTIVITY_PACKS, ACTIVIVTY_PACKS_CATEGORIES,
  AUTHORS, CONCEPTS, ATTRIBUTES_MANAGER, RAILS_ADMIN, BACKPACK, TOOLS, CONCEPT_MANAGEMENT,
  ACTIVITY_MANAGEMENT, USER_MANAGEMENT, TEACHER_CENTER
} from "./lockerConstants";

const baseUrl = process.env.DEFAULT_URL;

export const lockerItems = {
  [USERS]: {
    label: USERS,
    href: `${baseUrl}/cms/${USERS}`,
    emoji: '👥',
    emojiLabel: 'busts in silhouette'
  },
  [SCHOOLS]: {
    label: SCHOOLS,
    href: `${baseUrl}/cms/${SCHOOLS}`,
    emoji: '🏫',
    emojiLabel: 'school'
  },
  // [unarchiveUnits]: {
  //   label: 'unarchive units',
  //   href: ``,
  //   emoji: '',
  //   emojiLabel: ''
  // },
  [TEACHER_FIXES]: {
    label: TEACHER_FIXES,
    href: ``,
    emoji: '',
    emojiLabel: ''
  },
  [POSTS]: {
    label: POSTS,
    href: `${baseUrl}/cms/blog_posts`,
    emoji: '📰',
    emojiLabel: 'newspaper'
  },
  [POST_IMAGES]: {
    label: POST_IMAGES,
    href: `${baseUrl}/cms/images`,
    emoji: '🖼',
    emojiLabel: 'framed picture'
  },
  [ANNOUNCEMENTS]: {
    label: ANNOUNCEMENTS,
    href: `${baseUrl}/cms/${ANNOUNCEMENTS}`,
    emoji: '📢',
    emojiLabel: 'loudspeaker'
  },
  // [uploadRosters]: {
  //   label: '',
  //   href: ``,
  //   emoji: '',
  //   emojiLabel: ''
  // },
  [ACTIVITIES]: {
    label: ACTIVITIES,
    href: `${baseUrl}/cms/activity_classifications`,
    emoji: '🍒',
    emojiLabel: 'cherries'
  },
  [ACTIVITY_PACKS]: {
    label: ACTIVITY_PACKS,
    href: `${baseUrl}/cms/unit_templates`,
    emoji: '🍇',
    emojiLabel: 'grapes'
  },
  [ACTIVIVTY_PACKS_CATEGORIES]: {
    label: ACTIVIVTY_PACKS_CATEGORIES,
    href: `${baseUrl}/cms/unit_template_categories`,
    emoji: '🍱',
    emojiLabel: 'bento box'
  },
  [AUTHORS]: {
    label: AUTHORS,
    href: `${baseUrl}/cms/${AUTHORS}`,
    emoji: '👩‍🍳',
    emojiLabel: 'chef'
  },
  [CONCEPTS]: {
    label: CONCEPTS,
    href: `${baseUrl}/cms/${CONCEPTS}`,
    emoji: '🔖',
    emojiLabel: 'bookmark'
  },
  [ATTRIBUTES_MANAGER]: {
    label: '',
    href: ``,
    emoji: '',
    emojiLabel: ''
  },
  [RAILS_ADMIN]: {
    label: 'overview (Rails Admin)',
    href: `${baseUrl}/staff/activity`,
    emoji: '🍚',
    emojiLabel: 'cooked rice'
  },
  [EVIDENCE]: {
    label: EVIDENCE,
    href: `${baseUrl}/cms/${EVIDENCE}`,
    emoji: '📖',
    emojiLabel: 'open book with writing'
  },
  [CONNECT]: {
    label: CONNECT,
    href: `${baseUrl}/${CONNECT}#/admin`,
    emoji: '🎯',
    emojiLabel: 'bullseye target'
  },
  [DIAGNOSTIC]: {
    label: DIAGNOSTIC,
    href: `${baseUrl}/${DIAGNOSTIC}#/admin`,
    emoji: '🔍',
    emojiLabel: 'magnifying glass tilted left'
  },
  [GRAMMAR]: {
    label: GRAMMAR,
    href: `${baseUrl}/${GRAMMAR}#/admin/lessons`,
    emoji: '🧩',
    emojiLabel: 'puzzle piece'
  },
  [LESSONS]: {
    label: LESSONS,
    href: `${baseUrl}/${LESSONS}#/admin/classroom-lessons`,
    emoji: '🍎',
    emojiLabel: 'red apple'
  },
  [PROOFREADER]: {
    label: PROOFREADER,
    href: `${baseUrl}/${PROOFREADER}#/admin/lessons`,
    emoji: '🚩',
    emojiLabel: 'triangular flag'
  },
  [BACKPACK]: {
    label: BACKPACK,
    href: `${baseUrl}/${BACKPACK}`,
    emoji: '🎒',
    emojiLabel: BACKPACK
  },
  [CURRICULUM]: {
    label: CURRICULUM,
    route: `locker/${CURRICULUM}`,
    emoji: '📚',
    emojiLabel: 'stack of books',
    lockers: {
      [TOOLS]: [EVIDENCE, CONNECT, DIAGNOSTIC, GRAMMAR, LESSONS, PROOFREADER],
      [ACTIVITY_MANAGEMENT]: [ACTIVITIES, ACTIVITY_PACKS, ACTIVIVTY_PACKS_CATEGORIES, AUTHORS, RAILS_ADMIN],
      [CONCEPT_MANAGEMENT]: [CONCEPTS]
    }
  },
  [PARTNERSHIPS]: {
    label: PARTNERSHIPS,
    route: `locker/${PARTNERSHIPS}`,
    emoji: '🎓',
    emojiLabel: 'graduation cap',
    lockers: {
      [TEACHER_CENTER]: [POSTS, POST_IMAGES, ANNOUNCEMENTS],
      [USER_MANAGEMENT]: [USERS, SCHOOLS]
    }
  },
  [PRODUCT]: {
    label: PRODUCT,
    route: `locker/${PRODUCT}`,
    emoji: '🚀',
    emojiLabel: 'rocket ship',
    lockers: {
      [USER_MANAGEMENT]: [USERS, SCHOOLS],
      [PRODUCT]: [BACKPACK]
    }
  },
  [SUPPORT]: {
    label: SUPPORT,
    route: `locker/${SUPPORT}`,
    emoji: '📞',
    emojiLabel: 'telephone',
    lockers: {
      [USER_MANAGEMENT]: [USERS, SCHOOLS]
    }
  },
  [PATHWAYS]: {
    label: PATHWAYS,
    route: `locker/${PATHWAYS}`,
    emoji: '🖋',
    emojiLabel: '',
    lockers: {

    }
  },
}
