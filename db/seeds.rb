# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

now = DateTime.now
users = {}

[:admin, :teacher, :student].each do |role|
  users[role] = User.create(
    name: role.capitalize,
    email: "#{role}@quill.org",
    password: role,
    password_confirmation: role,
    created_at: now,
    updated_at: now,
    classcode: nil,
    active: true,
    username: role,
    token: nil,
    role: role.to_s
  ) unless User.find_by_role(role)
end

classroom = Classroom.create(
  name: "Test Classroom",
  teacher_id: users[:teacher].id, 
  created_at: now,
  updated_at: now
) unless Classroom.find_by_id(1)

users[:student].classcode = classroom.code 
users[:student].save

unless Chapter.find_by_id(1)
  Assessment.create(
    body: "In 1914, Ernest Shackleton set {+off-of|1} on an exploration across the Antarctic. In 1915 his ship, Endurance, became trapped in the ice, and {+its-it's|2} crew was stuck. Ten months later {+their-there|3} ship sank, and {+Shackleton's-Shackletons|4} crew was forced to live on {+an-a|5} iceberg. They reached Elephant Island in {+April-april|6} of 1916 using three lifeboats. \r\n\r\nShackleton promised to {+find-found|7} help. In a small boat with five crew members, he spent 16 days crossing 800 miles of ocean. The remaining men were then rescued {+in-on|8} August of 1916. Amazingly, Shackleton did not {+lose-loose|9} anyone on the trip. ",
    chapter_id: 1,
    instructions: 'There are **nine errors** in this passage. *To edit a word, click on it and re-type it.*',
    chapter: Chapter.create(
      id: 1,
      title: '111. Shackleton Returns from the Antarctic.',
      article_header: 'Shackleton Returns from the Antarctic',
      rule_position: %w(1 2 3 4 5 6 7 8 9),
      description: 'Shackleton Returns from the Antarctic.',
      practice_description: 'Lose vs. loose, it\'s vs. its, they\'re vs. their vs. there etc...',
      chapter_level_id: 16,
    )
  )

  Rule.create([
 {id: 9,
  title: "Lose vs. Loose",
  category_id: 28,
  description: "<b>Lose:</b> I <b>lose</b> my keys; I <b>lose</b> my balance.  \r\n<b>Loose:</b> The screws were <b>loose</b>; It broke <b>loose</b>. \r\n\r\n<b>Lose</b> refers to a loss.  \r\n<b>Loose</b> means to let go or the opposite of tight.",
  classification: "Commonly Confused Words"},
 {id: 8,
  title: "Prepositions (Time): At, In, On. ",
  category_id: 28,
  description: "<b>At:</b> I will meet my friend <b>at</b> <u>2:30</u>.\r\n<b>In:</b> I will meet my friend <b>in</b> <u>the fall</u>.\r\n<b>On:</b> I will meet my friend <b>on</b> <u>Monday</u>.\r\n\r\nWe use <b>at</b> for <b>specific times</b>, like <u>1:30 PM</u> or <u>7:00 AM</u>.\r\nWe use <b>in</b> for <b>months</b>, <b>seasons</b>, and <b>times of day</b>, like <u>October</u>, <u>winter</u>, or <u>morning</u>.\r\nWe use <b>on</b> for <b>days of the week</b> and <b>certain dates</b>, like <u>Monday</u> or <u>October 30th</u>.",
  classification: "Prepositions (Time)"},
 {id: 4,
  title: "Possessive Nouns",
  category_id: 28,
  description: "<b>Example:</b> My <b>father's</b> stamp collection is huge. [My father owns the stamp collection]\r\n<b>Example:</b> The <b>ship's</b> sails were filled with a gust of wind. [The sails belong to the ship]\r\n\r\n<b>Possessive nouns</b> are used to show ownership. To make most common or proper nouns possessive, we add an apostrophe and an \"s\" to the end of the word. Whatever comes after the possessive noun belongs to it. For example, my father's stamp collection and the ship's sail are possessive nouns. ",
  classification: "Possessive Nouns"},
 {id: 6,
  title: "Capitalize Dates",
  category_id: 28,
  description: "<b>Incorrect:</b> My birthday is on <u>wednesday</u>, <u>may</u> 4th, 1994.\r\n<b>Correct:</b> My birthday is on <u>Wednesday</u>, <u>May</u> 4th, 1994.\r\n\r\nWe capitalize the names of <b>specific days</b> and <b>months</b> (<u>Wednesday</u>, <u> May</u>).",
  classification: "Capitalize Dates"},
 {id: 7,
  title: "Irregular Verbs in the Past Tense: Find",
  category_id: 28,
  description: "<b>Incorrect:</b> I finally <b>finded</b> my phone in my backpack.\r\n<b>Correct:</b> I finally <b>found</b> my phone in my backpack.\r\n\r\nThe past tense of \"find\" is <b>found</b>.",
  classification: "Irregular Verbs in the Past Tense"},
 {id: 2,
  title: "It's vs. Its",
  category_id: 28,
  description: "<b>It's:</b> <b>It's</b> a nice day.\r\n<b>Its:</b> The dog wags <b>its</b> tail. \r\n\r\n<b>It's</b> is the same as \"it is\". <b>Its</b> means the object (tail) belongs to the subject (dog). ",
  classification: "Commonly Confused Words"},
 {id: 5,
  title: "Articles: A, An",
  category_id: 28,
  description: "<b>A:</b> I climbed <b>a</b> <u>tree.</u>\r\n<b>An:</b> I climbed <b>an</b> <u>oak tree.</u>\r\n\r\nArticles (<b>a, an</b>) are used before nouns (<u>tree</u>, <u>oak tree</u>). \r\nWe use \"<b>a</b>\" before nouns that start with a consonant sound (everything but a, e, i, o, u). We use \"<b>an</b>\" before nouns that start with vowel sounds (a, e, i, o, u).\r\n",
  classification: "Articles"},
 {id: 3,
  title: "There, They're, Their",
  category_id: 28,
  description: "<b>There:</b> <b>There</b> is a park by the lake.\r\n<b>They're:</b> <b>They're</b> going to the park. \r\n<b>Their:</b>  They left <b>their</b> Frisbee at the park. \r\n\r\n<b>There</b> is used for locations. <b>They're</b> is the same as \"they are\". <b>Their</b> is used when something (they) owns something else (frisbee). ",
  classification: "Commonly Confused Words"},
 {id: 1,
  title: "Off vs. Of",
  category_id: 28,
  description: "<b>Of:</b> a bunch of bananas, member of a team, son of a friend, north of Chicago.\r\n<b>Off:</b> turn off the lights, my shoes are off, break off some bread.\r\n<br>\r\nWe use the word <b>of</b> to show how one thing is connected to another thing. We use <b>off</b> to say that something is no longer connected to something else. \r\n<br>",
  classification: "Commonly Confused Words"}])

  Category.create(id: 28, title: "111. Shackleton Rules")

  RuleQuestion.create([
 {id: 28,
  body: ["My grandmother was born on Tuesday, June 2nd, 1970."],
  rule_id: 6,
  prompt: "My grandmother was born on tuesday, june 2nd, 1970.",
  instructions: "Rewrite the sentence using proper capitalization.",
  hint: ""},
 {id: 7,
  body: ["It looks like it's going to rain."],
  rule_id: 2,
  prompt: "It looks like _____ going to rain.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of its or it's.",
  hint: ""},
 {id: 24,
  body: ["I would like a loaf of bread."],
  rule_id: 5,
  prompt: "I would like <u>a / an</u> loaf of bread.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 3,
  body: ["Unless the crew worked together, they would not get off the ice."],
  rule_id: 1,
  prompt:
   "Unless the crew worked together, they would not get <u>off / of</u> the ice.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 5,
  body: ["One of the issues Shackleton's crew faced was the constant cold."],
  rule_id: 1,
  prompt:
   "One <u>off/ of</u> the issues Shackleton's crew faced was the constant cold.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 4,
  body:
   ["When his ship became stuck, Shackleton ordered all the supplies off the ship."],
  rule_id: 1,
  prompt:
   "When his ship became stuck, Shackleton ordered all the supplies <u>off / of</u> the ship.\r\n\r\n",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 21,
  body: ["I really want a puppy!"],
  rule_id: 5,
  prompt: "I really want <u>a / an</u> puppy!",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 22,
  body: ["Can you get an egg or two from the fridge?"],
  rule_id: 5,
  prompt: "Can you get <u>a / an</u> egg or two from the fridge?",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 23,
  body: ["We have to write a paper tonight for English class."],
  rule_id: 5,
  prompt: "We have to write <u>a / an</u> paper tonight for English class.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 25,
  body: ["I saw an eagle flying over my house yesterday."],
  rule_id: 5,
  prompt: "I saw <u>a / an</u> eagle flying over my house yesterday.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 26,
  body: ["Let's eat at an Italian restaurant tonight."],
  rule_id: 5,
  prompt: "Let's eat at <u>a / an</u> Italian restaurant tonight.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 33,
  body: ["I found three quarters in the couch."],
  rule_id: 7,
  prompt: "I _____ three quarters in the couch.",
  instructions:
   "Rewrite the sentence, filling in the blank with the past tense of \"find\".",
  hint: ""},
 {id: 27,
  body: ["I went to the zoo yesterday and saw an elephant!"],
  rule_id: 5,
  prompt: "I went to the zoo yesterday and saw <u>a / an</u> elephant!",
  instructions:
   "Rewrite the sentence, choosing the correct underlined article.",
  hint: ""},
 {id: 31,
  body:
   ["A baseball team from Japan will visit our school for a match in April."],
  rule_id: 6,
  prompt:
   "A baseball team from Japan will visit our school for a match in april.",
  instructions: "Rewrite the sentence using proper capitalization.",
  hint: ""},
 {id: 29,
  body: ["Our parents were married on June 20th."],
  rule_id: 6,
  prompt: "Our parents were married on june 20th.",
  instructions: "Rewrite the sentence using proper capitalization.",
  hint: ""},
 {id: 6,
  body: ["We drove our car until its tires wore out."],
  rule_id: 2,
  prompt: "We drove our car until _____ tires wore out.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of its or it's.",
  hint: ""},
 {id: 8,
  body: ["I think it's a good day for a walk."],
  rule_id: 2,
  prompt: "I think _____ a good day for a walk.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of its or it's.",
  hint: ""},
 {id: 9,
  body: ["There's a stray cat that lost its fur."],
  rule_id: 2,
  prompt: "There's a stray cat that lost _____ fur.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of its or it's.",
  hint: ""},
 {id: 10,
  body: ["I told you it's too hot outside to wear a sweater."],
  rule_id: 2,
  prompt: "I told you _____ too hot outside to wear a sweater.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of its or it's.",
  hint: ""},
 {id: 42,
  body:
   ["By the time the crew of the Endurance was rescued, their clothes were loose because they had lost weight."],
  rule_id: 9,
  prompt:
   "By the time the crew of the Endurance was rescued, their clothes were (lose / loose) because they had lost weight.",
  instructions:
   "Rewrite the sentence, choosing the correct word from the parentheses.",
  hint: ""},
 {id: 40,
  body:
   ["While Endurance was in the Antarctic, the crew had to beat the ice loose from the sails."],
  rule_id: 9,
  prompt:
   "While Endurance was in the Antarctic, the crew had to beat the ice <u>lose / loose</u> from the sails.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 41,
  body:
   ["Despite the bad weather, the navigator did not lose his heading towards land."],
  rule_id: 9,
  prompt:
   "Despite the bad weather, the navigator did not <u>lose / loose</u> his heading towards land.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 11,
  body: ["They have changed, but they're still my friends."],
  rule_id: 3,
  prompt: "They have changed, but _____ still my friends.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of <b>their</b>, <b>they're</b>, or <b>there</b>.",
  hint: ""},
 {id: 12,
  body: ["My parents left their refrigerator open all night."],
  rule_id: 3,
  prompt: "My parents left _____ refrigerator open all night.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of <b>their</b>, <b>they're</b>, or <b>there</b>.",
  hint: ""},
 {id: 13,
  body: ["I see a hawk over there."],
  rule_id: 3,
  prompt: "I see a hawk over _____.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of <b>their</b>, <b>they're</b>, or <b>there</b>.",
  hint: ""},
 {id: 14,
  body: ["They're very strict about pets around here."],
  rule_id: 3,
  prompt: "_____ very strict about pets around here.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of <b>their</b>, <b>they're</b>, or <b>there</b>.",
  hint: ""},
 {id: 15,
  body: ["My students need to improve their grammar."],
  rule_id: 3,
  prompt: "My students need to improve _____ grammar.",
  instructions:
   "Rewrite the sentence, filling in the blank with the correct version of <b>their</b>, <b>they're</b>, or <b>there</b>.",
  hint: ""},
 {id: 34,
  body: ["I met my friend on Monday."],
  rule_id: 8,
  prompt: "I met my friend <u>at / in / on</u> Monday.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined preposition.",
  hint: ""},
 {id: 35,
  body: ["I will see her again on the eighth of July."],
  rule_id: 8,
  prompt: "I will see her again <u>at / in / on</u> the eighth of July.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined preposition.",
  hint: ""},
 {id: 36,
  body: ["I will go to my friend's house in the evening."],
  rule_id: 8,
  prompt: "I will go to my friend's house <u>at / in / on</u> the evening.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined preposition.",
  hint: ""},
 {id: 37,
  body: ["Her house is very warm, even in the fall."],
  rule_id: 8,
  prompt: "Her house is very warm, even <u>at / in / on</u> the fall.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined preposition.",
  hint: ""},
 {id: 38,
  body: ["Class will end at 11:00 today."],
  rule_id: 8,
  prompt: "Class will end <u>at / in / on</u> 11:00 today.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined preposition.",
  hint: ""},
 {id: 39,
  body: ["I go to bed at 9:00 PM."],
  rule_id: 8,
  prompt: "I go to bed <u>at / in / on</u> 9:00 PM.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined preposition.",
  hint: ""},
 {id: 16,
  body: ["Theseus was able to find his way with Ariadne's help."],
  rule_id: 4,
  prompt:
   "Theseus was able to find his way with <u>Ariadne's / Ariadnes</u> help.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 17,
  body: ["The magic broom obeyed the sorcerer's apprentice."],
  rule_id: 4,
  prompt:
   "The magic broom obeyed the <u>sorcerers / sorcerer's</u> apprentice.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 18,
  body: ["Hansel and Gretel escaped from the witch's house."],
  rule_id: 4,
  prompt:
   "Hansel and Gretel escaped from the <u>witchs / witch's</u> house.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 19,
  body: ["The horses' hooves were given new shoes."],
  rule_id: 4,
  prompt: "The <u>horses / horses'</u> hooves were given new shoes.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 20,
  body: ["The octopus' color changed almost instantly."],
  rule_id: 4,
  prompt: "The <u>octopus / octopus'</u> color changed almost instantly.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 32,
  body: ["After looking for hours, I found my pet hamster."],
  rule_id: 7,
  prompt: "After looking for hours, I _____ my pet hamster.",
  instructions:
   "Rewrite the sentence, filling in the blank with the past tense of \"find\".",
  hint: ""},
 {id: 30,
  body: ["Magic Johnson was born on August 14th, 1959."],
  rule_id: 6,
  prompt: "Magic Johnson was born on august 14th, 1959.",
  instructions: "Rewrite the sentence using proper capitalization.",
  hint: ""},
 {id: 2,
  body:
   ["One of the major issues the crew had to deal with was the lack of food on the iceberg."],
  rule_id: 1,
  prompt:
   "One <u>off / of</u> the major issues the crew had to deal with was the lack of food on the iceberg.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""},
 {id: 1,
  body: ["Ernest Shackleton was the captain of his own ship."],
  rule_id: 1,
  prompt: "Ernest Shackleton was the captain <u>off / of</u> his own ship.",
  instructions:
   "Rewrite the sentence, choosing the correct underlined word.",
  hint: ""}])

  Workbook.create({
    title: "Test Workbook",
    created_at: now,
    updated_at: now
  })
end

ClassroomChapter.create({
  classcode: classroom.code,
  chapter_id: 1,
  created_at: now,
  due_date: now + 10,
  updated_at: now,
  classroom_id: classroom.id 
})
