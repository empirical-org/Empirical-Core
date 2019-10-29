module PagesHelper

	def pages_tab_class tabname
		about_actions = ["mission", "develop", "faq"]
		impact_actions = ['impact', 'map', 'stats']
		team_actions = %w(team)
		partners_actions = %w(partners)
		news_actions = %w(news)
		press_actions = %w(press)
		standards_actions = ['activities']
		topics_actions = ['index']
		faq_actions = ['faq']
		media_kit_actions = ['media_kit']
		getting_started_actions = ['teacher-center']
		media_actions = ['news', 'press', 'blog_posts']
		if tabname == "about"
			about_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'faq'
			faq_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'press'
			press_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'partners'
			partners_actions.include?(action_name) ? 'active' : ''
		elsif tabname == "media"
			media_actions.include?(action_name) ? 'active' : ''
		elsif tabname == "team"
			team_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'getting-started'
			# TODO: revert this when we launch front end of knowlege center
			action_name == 'temporarily_render_old_teacher_resources' ? 'active' : ''
		elsif tabname == 'news'
			news_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'media_kit'
			media_kit_actions.include?(action_name) ? 'active' : ''
		elsif tabname == "impact"
			impact_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'standards'
			standards_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'topics'
			topics_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'premium'
			action_name == 'premium_from_discover' ? "premium-tab active" : ''
		end

	end

	def subtab_class tabname
		if action_name == tabname
			"active"
		else
			""
		end
	end

  def team_info
    [
      {
        team: 'Leadership team',
        members: [
          {
            name: 'Daniel Drabik',
            title: 'Vice President of Engineering',
            img: 'team-daniel-drabik@2x.png'
          },
          {
            name: 'Peter Gault',
            title: 'Executive Director, Cofounder',
            img: 'team-peter-gault@2x.png'
          },
          {
            name: 'Sara Jeruss',
            title: 'Chief Operating Officer',
            img: 'team-sara-jeruss@2x.png'
          }
        ]
      },
      {
        team: 'Entire team',
        image_prepend: 'team-',
        members: [
          {
            name: 'Tom Calabrese',
            title: 'Product Designer',
            img: 'team-tom-calabrese@2x.png'
          },
          {
            name: 'Christina Collins',
            title: 'Head of School Success',
            img: 'team-christina-collins@2x.png'
          },
          {
            name: 'Rachel Dantzler',
            title: 'Editorial and Outreach Associate',
            img: 'team-rachel-dantzler@2x.png'
          },
          {
            name: 'Maximilian de Martino',
            title: 'Curriculum Developer',
            img: 'team-maximilian-de-martino@2x.png'
          },
          {
            name: 'Haronil Estevez',
            title: 'Senior Software Developer',
            img: 'team-haronil-estevez@2x.png'
          },
          {
            name: 'Emilia Friedberg',
            title: 'Software Developer',
            img: 'team-emilia-friedberg@2x.png'
          },
          {
            name: 'Maddy Maher',
            title: 'Outreach Lead',
            img: 'team-maddy-maher@2x.png'
          },
          {
            name: 'Hannah Monk',
            title: 'Curriculum Director',
            img: 'team-hannah-monk@2x.png'
          },
          {
            name: 'Lindsey Murphy',
            title: 'Lead Curriculum Developer',
            img: 'team-lindsey-murphy@2x.png'
          },
          {
            name: 'Yves Peirsman',
            title: 'AI Open Source Partner',
            img: 'team-yves-peirsman@2x.png'
          },
          {
            name: 'Thomas Robertson',
            title: 'Senior Web Developer',
            img: 'team-thomas-robertson@2x.png'
          },
          {
            name: 'Emma Volk',
            title: 'Curriculum Developer',
            img: 'team-emma-volk@2x.png'
          },
          {
            name: 'Rhea Wong',
            title: 'Director of Strategic Initiatives',
            img: 'team-rhea-wong@2x.png'
          }
        ]
      }
    ]
	end

  def board_and_advisors_info
    [
      {
        team: 'Board of Directors',
        members: [
          {
            name: 'Stephanie Cohen',
            title: 'Chief Strategy Officer at Goldman Sachs',
            img: 'board-stephanie-cohen@2x.png'
          },
          {
            name: 'Reuben Gutoff',
            title: 'Retired Vice President at General Electric',
            img: 'board-reuben-gutoff@2x.png'
          },
          {
            name: 'Rhys Kidd',
            title: 'Vice President at Macquarie Group',
            img: 'board-rhys-kidd@2x.png'
          },
          {
            name: 'Jane Parver',
            title: 'Partner at Kaye Scholer',
            img: 'board-jane-parver@2x.png'
          },
          {
            name: 'Matthew Rodriguez',
            title: 'Managing Director at BlackRock',
            img: 'board-matthew-rodriguez@2x.png'
          },
          {
            name: 'Ben Sussman',
            title: 'Engineer at Spell',
            img: 'board-ben-sussman@2x.png'
          },
          {
            name: 'Peg Tyre',
            title: 'Director of Strategy at The Edwin Gould Foundation',
            img: 'board-peg-tyre@2x.png'
          },
          {
            name: 'Paul Walker',
            title: 'Quill Board Chair, Retired Partner at Goldman Sachs',
            img: 'board-paul-walker@2x.png'
          }
        ]
      },
      {
        team: 'Advisors',
        members: [
          {
            name: 'Donald McKendrick',
            title: 'Software Engineer at One Medical',
            img: 'advisor-donald-mckendrick@2x.png'
          },
          {
            name: 'Jane Nevins',
            title: 'Director of Giving at Freedom for All Americans',
            img: 'advisor-jane-nevins@2x.png'
          },
          {
            name: 'Alex Redmon',
            title: 'Senior Software Engineer at Cylera',
            img: 'advisor-alex-redmon@2x.png'
          },
          {
            name: 'John Silberstein',
            title: 'Board of Directors at  Snap Interactive',
            img: 'advisor-board-avatar.svg'
          },
          {
            name: 'Emily Dalton Smith',
            title: 'Director of Social Impact  Product at Facebook',
            img: 'advisor-emily-dalton-smith@2x.png'
          }
        ]
      }
    ]
  end

  def testimonials
    {
      column_one: [
        {
          testimonial: "I've been teaching high school English for many years. This is the first interactive website that engages students to interact with actual practice lessons. Most sites merely use a question/answer test format. Quill.org encompasses instant feedback as well as additional practice. I absolutely love it as a supplement to my current text!!",
          teacher_name: "Beth C."
        },
        {
          testimonial: "Quill's tool for writing is one that students took to like a duck to water.  That said, the ones who needed the most to practice writing and they could not skip through the problem as they can at some sites, but must persist, before going on to another problem, is exactly what the students need.  And these students who had complained and wanted to resist practicing there end up saying they learned from it!",
          teacher_name: "Nancy K."
        },
        {
          testimonial: "This is a fantastic resource across all year levels, and the real time data is excellent.",
          teacher_name: "Jess H."
        },
        {
          testimonial: "Quill is awesome! It is easy to navigate and targeted for grade levels from 1st up to high school! I have all my students use Quill. I had one student tell me \"He just didn't want to stop doing it! He loved it.\" I will take it! Teaches kids grammar in a fun, interactive and targeted way all online! Thank you Quill! Great addition to my curriculum.",
          teacher_name: "Lisa D."
        },
        {
          testimonial: "I started using Quill as a new way for my students to apply their learning and to track their understanding. Quill immediately showed me where my students were in terms of skillset AND provided a detailed report of activities and lessons they can use to improve. This sort of diagnostic would have taken me days, if not weeks to complete, but Quill did it in minutes.",
          teacher_name: "Cassandra C."
        },
        {
          testimonial: "I have never had students come back after using something and unanimously say that they LOVE it. As one of my student's review said, \"I like how we're not learning.\" I appreciate how Quill allows my students to practice combining sentences and taking their time to revise their work, all while enjoying it so much, they don't think of it as learning.",
          teacher_name: "Pamela S."
        },
        {
          testimonial: "This is a great app.  Never have I had students ask me if we can do grammar today, but with Quill that is just what they are doing.  Thanks developers.  You are really helping this English teacher.",
          teacher_name: "Lucinda W."
        },
        {
          testimonial: "This is an EXCELLENT tool and saves me hours of time coming up with my own grammar activities. The site is full of a range of writing practice and skills for students from elementary to high school (I use it with my Grade 7s, 9s and 11s). Assigning activities to certain classes or individuals is a great help and being able to see their progress really sees where weaknesses lie and areas I can focus on.",
          teacher_name: "Allison G."
        },
        {
          testimonial: "I used this with my students today. Even the most disconnected, and uninterested of them found it engaging, and interesting. The interface is self-explanatory, and the step-by-step user instructions are excellent.",
          teacher_name: "Erin T."
        },
        {
          testimonial: "I just started using Quill in my Language Arts remediation classes and I LOVE it!  All of my students need to pass a state exam in order to graduate, and so far Quill has proven to be a wonderful tool.  My students are engaged and the immediate feedback is perfect for keeping them focused.  Not to mention the detailed reports that show me how proficient they are at a given skill.",
          teacher_name: "Casey K."
        },
        {
          testimonial: "I have been using Quill for the past few years during our Summer Enrichment programs. The students' love the program and it keeps them engaged.",
          teacher_name: "Kimberley B."
        },
        {
          testimonial: "We just started using the website, and the students are enjoying it.  I love the fact that it is user-friendly, and that it compliments Google Classroom.",
          teacher_name: "Vickie H."
        },
        {
          testimonial: "I use Quill with English learners in grades 6-8.  I have found that it offers a wide range of topics which makes it easy to differentiate for various student levels.  Quill also aligns with state and national standards, so I know students are engaged in something meaningful and relevant.  Also, because of Quill's correction hints, my students are finally putting punctuation at the end of sentences.  Hooray!!!",
          teacher_name: "Elizabeth C."
        },
        {
          testimonial: "Wonderful tool for targeting students' writing skills.  Fortunate to have such a great program since there are very few quality online programs for developing writing skills.",
          teacher_name: "Eric T."
        },
        {
          testimonial: "I love this program. The whole class instruction is very engaging for students of all abilities. I have also had the opportunity to introduce this software into a co-teaching classroom environment where students range from very advanced to very delayed.",
          teacher_name: "Sherry H."
        }
      ],
      column_two: [
        {
          testimonial: "I am very impressed with Quill as a teaching tool. At times, I have close to 30 students in my classroom, making it impossible to provide in-depth feedback and support with their writing mechanics. Quill solves that problem.",
          teacher_name: "Ashley F."
        },
        {
          testimonial: "Seriously, how can a company offer such a useful and powerful tool for the classroom for free?! If you spend your weekends correcting \"Daily Language\" papers, this not only takes over that job but is better because it customizes the work for each student. Their student diagnostic test identifies weaknesses so that you can assign appropriate lessons for students to work on. I signed up for a trial of the paid version that gives you student specific data and will purchase that because the entire program is well worth it!",
          teacher_name: "Bob C."
        },
        {
          testimonial: "Great way to cut costs on copy paper and support our blended learning environment at the same time!",
          teacher_name: "Corri M."
        },
        {
          testimonial: "Using Quill with my students in a remedial college writing course has been wonderful! The Pre and Post diagnostics help motivate my students to better understand their writing deficiencies and with structure and an understanding of the grammar jargon, my students become more engaged with the course. I find that Quill offers students the opportunity to understand and apply the grammar rules, syntax and development with repetitive exercises and feedback. My students find this tool very rewarding and most importantly, it helps increase their confidence to become better writers. At the end of the course, students take a post diagnostics test and the results are impressive compared to the pre diagnostic test taken in the first week of the course. When my students see how much their writing has improved from the first week to the last week of the course, this is what I find most rewarding about this tool....to see the ear-to-ear smiles on my students' faces knowing they have accomplished what they thought would be impossible to improve their writing skills. Thank you QUILL TEAM!!!",
          teacher_name: "Rose C."
        },
        {
          testimonial: "I've been using Quill for a couple of years, but this last update has been amazing!  The ELL diagnostic test with recommendations for individual follow up activities are a great help to deal with large classes, and especially at the beginning of the year.  I'm teaching English as a Foreign Language in a non-English speaking country, so the activities give my students lots of excellent practice.  It is very easy to create a class and get students using the activities.  I'd highly recommend trying it!",
          teacher_name: "Steve N."
        },
        {
          testimonial: "So easy to use and so teacher friendly. Not to mention the educational impact it has on my students. They all love it.",
          teacher_name: "Karolina R."
        },
        {
          testimonial: "I love Quill! It is great for helping students learn skills as well as be better editors of their own work. It was very helpful before the writing portion of our state test. I am most impressed with the \"connect\" part of Quill, as it gives great feedback to students about how to improve their sentences. I use this with 7th and 8th grade struggling students and those with learning disabilities and cognitive delays.",
          teacher_name: "Kara G."
        },
        {
          testimonial: "Quill helps my students review the grammar skills we learn each week. Even if they don't have exactly what I'm looking for, I can usually find something similar to use. We use Quill on an almost weekly basis.",
          teacher_name: "Kem O."
        },
        {
          testimonial: "I had this website recommended to me from another teacher in my school system.  I teach 4th grade ELA and my students and myself are loving the practice!  It is great in that it totally incorporates English practice, reading practice and typing skills all in one!  Please keep adding to the activities - we love it!",
          teacher_name: "Tiffany G."
        },
        {
          testimonial: "I love that I can have my kids do their English reviews online and it is automatically graded. You can see the results and if you are not satisfied, the student can redo the lesson. It is simple and we have used Quill for two years now. It is a great tool to add to any curriculum, home school or public.",
          teacher_name: "Kelly L."
        },
        {
          testimonial: "Easy to setup for classroom use.  I like that students have to type their answers and that the program won't allow them to move on until it's right.",
          teacher_name: "Aaron K."
        },
        {
          testimonial: "It is a wonderful supplement to my English class. I appreciate the emphasis on sentence combining.",
          teacher_name: "Rod T."
        },
        {
          testimonial: "I came across Quill while looking for an effective language mechanics diagnostic for my middle school students and I was very impressed with what it had to offer ... and for free. Excellent to use to screen for students that may struggle in specific areas of language usage and also to specifically target their areas of weakness with exercises that they can work on independently.",
          teacher_name: "Rana H."
        }
      ]
    }
  end
end
