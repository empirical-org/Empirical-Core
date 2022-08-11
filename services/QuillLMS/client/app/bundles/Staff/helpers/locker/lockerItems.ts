import { EVIDENCE, CONNECT, DIAGNOSTIC, GRAMMAR, LESSONS, PROOFREADER, CURRICULUM, PARTNERSHIPS, PRODUCT, SUPPORT } from "../../../Shared"

import {
  USERS, SCHOOLS, DISTRICTS, UNARCHIVE_UNITS, RESTORE_CLASSROOM_UNITS, RESTORE_UNIT_ACTIVITIES, RESTORE_ACTIVITY_SESSIONS,
  MERGE_STUDENT_ACCOUNTS, MERGE_TEACHER_ACCOUNTS, TRANSFER_STUDENT_TO_ANOTHER_CLASS, UNSYNC_USER_WITH_GOOGLE_CLASSROOM,
  MERGE_TWO_SCHOOLS, MERGE_TWO_CLASSROOMS, MERGE_ACTIVITY_PACKS, DELETE_LAST_ACTIVITY_SESSION,
  REMOVE_UNSYNCED_STUDENTS_FROM_CLASSES, TEACHER_FIXES, POSTS, ARTICLE_IMAGES, ANNOUNCEMENTS, UPLOAD_ROSTERS,
  ACTIVITIES, ACTIVITY_PACKS, ACTIVITY_PACKS_CATEGORIES, AUTHORS, CONCEPTS, ATTRIBUTES_MANAGER, RAILS_ADMIN, BACKPACK,
  TOOLS, CONCEPT_MANAGEMENT, ACTIVITY_MANAGEMENT, USER_MANAGEMENT, TEACHER_CENTER
} from "./lockerConstants";

import { LockerItemsInterface } from "../../interfaces/interfaces";

const baseUrl = process.env.DEFAULT_URL;

export const lockerItems: LockerItemsInterface = {
  [USERS]: {
    label: USERS,
    href: `${baseUrl}/cms/users`,
    emoji: '👥',
    emojiLabel: 'busts in silhouette'
  },
  [SCHOOLS]: {
    label: SCHOOLS,
    href: `${baseUrl}/cms/schools`,
    emoji: '🏫',
    emojiLabel: 'school'
  },
  [DISTRICTS]: {
    label: DISTRICTS,
    href: `${baseUrl}/cms/districts`,
    emoji: '🏫',
    emojiLabel: 'district'
  },
  [UNARCHIVE_UNITS]: {
    label: UNARCHIVE_UNITS,
    href: `${baseUrl}/teacher_fix/unarchive_units`,
    emoji: '✨',
    emojiLabel: 'sparkles',
    tooltipInfo: 'Use when a teacher has purposefully or accidentally deleted an activity pack and wants it back.'
  },
  [RESTORE_ACTIVITY_SESSIONS]: {
    label: RESTORE_ACTIVITY_SESSIONS,
    href: `${baseUrl}/teacher_fix/recover_activity_sessions`,
    emoji: '🌙',
    emojiLabel: 'crescent moon',
    tooltipInfo: 'Use as a first line of defense when teachers complain about missing activity sessions, frequently seen with the diagnostic.'
  },
  [RESTORE_CLASSROOM_UNITS]: {
    label: RESTORE_CLASSROOM_UNITS,
    href: `${baseUrl}/teacher_fix/recover_classroom_units`,
    emoji: '👩‍🏫',
    emojiLabel: 'teacher',
    tooltipInfo: 'Use this when a teacher has archived and then unarchived a classroom and wants their data back.'
  },
  [RESTORE_UNIT_ACTIVITIES]: {
    label: RESTORE_UNIT_ACTIVITIES,
    href: `${baseUrl}/teacher_fix/recover_unit_activities`,
    emoji: '🌟',
    emojiLabel: 'glowing star',
    tooltipInfo: 'Use when a teacher has purposefully or accidentally deleted an activity from an activity pack and wants it back.'
  },
  [MERGE_STUDENT_ACCOUNTS]: {
    label: MERGE_STUDENT_ACCOUNTS,
    href: `${baseUrl}/teacher_fix/merge_student_accounts`,
    emoji: '👯',
    emojiLabel: 'kids with bunny ears'
  },
  [MERGE_TEACHER_ACCOUNTS]: {
    label: MERGE_TEACHER_ACCOUNTS,
    href: `${baseUrl}/teacher_fix/merge_teacher_accounts`,
    emoji: '🧑‍🤝‍🧑',
    emojiLabel: 'people holding hands'
  },
  [TRANSFER_STUDENT_TO_ANOTHER_CLASS]: {
    label: TRANSFER_STUDENT_TO_ANOTHER_CLASS,
    href: `${baseUrl}/teacher_fix/move_student`,
    emoji: '🏃‍♀️',
    emojiLabel: 'person running'
  },
  [UNSYNC_USER_WITH_GOOGLE_CLASSROOM]: {
    label: UNSYNC_USER_WITH_GOOGLE_CLASSROOM,
    href: `${baseUrl}/teacher_fix/google_unsync`,
    emoji: '📩',
    emojiLabel: 'envelope with arrow'
  },
  [MERGE_TWO_SCHOOLS]: {
    label: MERGE_TWO_SCHOOLS,
    href: `${baseUrl}/teacher_fix/merge_two_schools`,
    emoji: '👨‍👩‍👧‍👦',
    emojiLabel: 'family of four people'
  },
  [MERGE_TWO_CLASSROOMS]: {
    label: MERGE_TWO_CLASSROOMS,
    href: `${baseUrl}/teacher_fix/merge_two_classrooms`,
    emoji: '👨‍👩‍👦',
    emojiLabel: 'family of three people'
  },
  [MERGE_ACTIVITY_PACKS]: {
    label: MERGE_ACTIVITY_PACKS,
    href: `${baseUrl}/teacher_fix/merge_activity_packs`,
    emoji: '🎊',
    emojiLabel: 'confetti balls'
  },
  [DELETE_LAST_ACTIVITY_SESSION]: {
    label: DELETE_LAST_ACTIVITY_SESSION,
    href: `${baseUrl}/teacher_fix/delete_last_activity_session`,
    emoji: '🔥',
    emojiLabel: 'fire',
    tooltipInfo: 'Use when you have completed an activity session on behalf of a student and need to erase the evidence.'
  },
  [REMOVE_UNSYNCED_STUDENTS_FROM_CLASSES]: {
    label: REMOVE_UNSYNCED_STUDENTS_FROM_CLASSES,
    href: `${baseUrl}/teacher_fix/remove_unsynced_students`,
    emoji: '👷',
    emojiLabel: 'construction worker'
  },
  [POSTS]: {
    label: POSTS,
    href: `${baseUrl}/cms/blog_posts`,
    emoji: '📰',
    emojiLabel: 'newspaper'
  },
  [ARTICLE_IMAGES]: {
    label: ARTICLE_IMAGES,
    href: `${baseUrl}/cms/images`,
    emoji: '🖼',
    emojiLabel: 'framed picture'
  },
  [ANNOUNCEMENTS]: {
    label: ANNOUNCEMENTS,
    href: `${baseUrl}/cms/announcements`,
    emoji: '📢',
    emojiLabel: 'loudspeaker'
  },
  [UPLOAD_ROSTERS]: {
    label: UPLOAD_ROSTERS,
    href: `${baseUrl}/cms/rosters`,
    emoji: '💾',
    emojiLabel: 'floppy disk'
  },
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
  [ACTIVITY_PACKS_CATEGORIES]: {
    label: ACTIVITY_PACKS_CATEGORIES,
    href: `${baseUrl}/cms/unit_template_categories`,
    emoji: '🍱',
    emojiLabel: 'bento box'
  },
  [AUTHORS]: {
    label: AUTHORS,
    href: `${baseUrl}/cms/authors`,
    emoji: '👩‍🍳',
    emojiLabel: 'chef'
  },
  [CONCEPTS]: {
    label: CONCEPTS,
    href: `${baseUrl}/cms/concepts`,
    emoji: '🔖',
    emojiLabel: 'bookmark'
  },
  [ATTRIBUTES_MANAGER]: {
    label: ATTRIBUTES_MANAGER,
    href: `${baseUrl}/cms/attributes_manager`,
    emoji: '🧮',
    emojiLabel: 'abacus'
  },
  [RAILS_ADMIN]: {
    label: 'Overview (Rails Admin)',
    href: `${baseUrl}/staff/activity`,
    emoji: '🍚',
    emojiLabel: 'cooked rice',
    overrideTitleCase: true
  },
  [EVIDENCE]: {
    label: EVIDENCE,
    href: `${baseUrl}/cms/evidence`,
    emoji: '📖',
    emojiLabel: 'open book with writing'
  },
  [CONNECT]: {
    label: CONNECT,
    href: `${baseUrl}/connect#/admin`,
    emoji: '🎯',
    emojiLabel: 'bullseye target'
  },
  [DIAGNOSTIC]: {
    label: DIAGNOSTIC,
    href: `${baseUrl}/diagnostic#/admin`,
    emoji: '🔍',
    emojiLabel: 'magnifying glass tilted left'
  },
  [GRAMMAR]: {
    label: GRAMMAR,
    href: `${baseUrl}/grammar#/admin/lessons`,
    emoji: '🧩',
    emojiLabel: 'puzzle piece'
  },
  [LESSONS]: {
    label: LESSONS,
    href: `${baseUrl}/lessons#/admin/classroom-lessons`,
    emoji: '🍎',
    emojiLabel: 'red apple'
  },
  [PROOFREADER]: {
    label: PROOFREADER,
    href: `${baseUrl}/proofreader#/admin/lessons`,
    emoji: '🚩',
    emojiLabel: 'triangular flag'
  },
  [BACKPACK]: {
    label: BACKPACK,
    href: `${baseUrl}/backpack`,
    emoji: '🎒',
    emojiLabel: BACKPACK
  },
  [CURRICULUM]: {
    label: CURRICULUM,
    route: CURRICULUM,
    emoji: '📚',
    emojiLabel: 'stack of books',
    lockers: {
      [TOOLS]: [EVIDENCE, CONNECT, DIAGNOSTIC, GRAMMAR, LESSONS, PROOFREADER],
      [ACTIVITY_MANAGEMENT]: [ACTIVITIES, ACTIVITY_PACKS, ACTIVITY_PACKS_CATEGORIES, AUTHORS, RAILS_ADMIN],
      [CONCEPT_MANAGEMENT]: [CONCEPTS, ATTRIBUTES_MANAGER]
    }
  },
  [PARTNERSHIPS]: {
    label: PARTNERSHIPS,
    route: PARTNERSHIPS,
    emoji: '🎓',
    emojiLabel: 'graduation cap',
    lockers: {
      [TEACHER_CENTER]: [POSTS, ARTICLE_IMAGES, ANNOUNCEMENTS],
      [USER_MANAGEMENT]: [USERS, SCHOOLS, DISTRICTS, UPLOAD_ROSTERS],
      [TEACHER_FIXES]: [UNARCHIVE_UNITS, RESTORE_CLASSROOM_UNITS, RESTORE_UNIT_ACTIVITIES, RESTORE_ACTIVITY_SESSIONS,
        MERGE_STUDENT_ACCOUNTS, MERGE_TEACHER_ACCOUNTS, TRANSFER_STUDENT_TO_ANOTHER_CLASS, UNSYNC_USER_WITH_GOOGLE_CLASSROOM,
        MERGE_TWO_SCHOOLS, MERGE_TWO_CLASSROOMS, MERGE_ACTIVITY_PACKS, DELETE_LAST_ACTIVITY_SESSION,
        REMOVE_UNSYNCED_STUDENTS_FROM_CLASSES]
    }
  },
  [PRODUCT]: {
    label: PRODUCT,
    route: PRODUCT,
    emoji: '🚀',
    emojiLabel: 'rocket ship',
    lockers: {
      [USER_MANAGEMENT]: [USERS, SCHOOLS],
      [PRODUCT]: [BACKPACK]
    }
  },
  [SUPPORT]: {
    label: SUPPORT,
    route: SUPPORT,
    emoji: '📞',
    emojiLabel: 'telephone',
    lockers: {
      [USER_MANAGEMENT]: [USERS, SCHOOLS, DISTRICTS, UPLOAD_ROSTERS],
      [TEACHER_CENTER]: [POSTS, ARTICLE_IMAGES, ANNOUNCEMENTS],
      [TEACHER_FIXES]: [UNARCHIVE_UNITS, RESTORE_CLASSROOM_UNITS, RESTORE_UNIT_ACTIVITIES, RESTORE_ACTIVITY_SESSIONS,
        MERGE_STUDENT_ACCOUNTS, MERGE_TEACHER_ACCOUNTS, TRANSFER_STUDENT_TO_ANOTHER_CLASS, UNSYNC_USER_WITH_GOOGLE_CLASSROOM,
        MERGE_TWO_SCHOOLS, MERGE_TWO_CLASSROOMS, MERGE_ACTIVITY_PACKS, DELETE_LAST_ACTIVITY_SESSION,
        REMOVE_UNSYNCED_STUDENTS_FROM_CLASSES]
    }
  },
  'index': {
    label: 'all lockers',
    route: 'index',
    emoji: '🔐',
    emojiLabel: 'locked with key',
    lockers: {
      [USER_MANAGEMENT]: [USERS, SCHOOLS, DISTRICTS, UPLOAD_ROSTERS],
      [TEACHER_FIXES]: [UNARCHIVE_UNITS, RESTORE_CLASSROOM_UNITS, RESTORE_UNIT_ACTIVITIES, RESTORE_ACTIVITY_SESSIONS,
        MERGE_STUDENT_ACCOUNTS, MERGE_TEACHER_ACCOUNTS, TRANSFER_STUDENT_TO_ANOTHER_CLASS, UNSYNC_USER_WITH_GOOGLE_CLASSROOM,
        MERGE_TWO_SCHOOLS, MERGE_TWO_CLASSROOMS, MERGE_ACTIVITY_PACKS, DELETE_LAST_ACTIVITY_SESSION,
        REMOVE_UNSYNCED_STUDENTS_FROM_CLASSES],
      [TOOLS]: [EVIDENCE, CONNECT, DIAGNOSTIC, GRAMMAR, LESSONS, PROOFREADER],
      [ACTIVITY_MANAGEMENT]: [ACTIVITIES, ACTIVITY_PACKS, ACTIVITY_PACKS_CATEGORIES, AUTHORS, RAILS_ADMIN],
      [CONCEPT_MANAGEMENT]: [CONCEPTS, ATTRIBUTES_MANAGER],
      [PRODUCT]: [BACKPACK]
    }
  },
  'personal locker': {
    label: 'create your own locker',
    route: 'personal-locker',
    emoji: '➕',
    emojiLabel: 'addition sign'
  }
}
