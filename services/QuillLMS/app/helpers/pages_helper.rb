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
			(action_name == 'premium_from_discover') ? "premium-tab active" : ''
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
				team: 'Quill Team',
				members: [
	     		{
			      img: 'thumb-peter.png',
			      name: 'Peter Gault',
			      title: 'Executive Director, Cofounder',
			      desc: "Peter designs the user experience, manages the team, and leads fundraising. Peter found his passion for writing as a journalist at his high school's newspaper, and studied philosophy at Bates College. By teaching students how to write, we teach them how to organize and articulate their ideas. With Quill, he aims to help millions of people improve their writing and thinking skills. In 2016, he was awarded Forbes' 30 Under 30 for education."
					},
          {
            img: 'thumb-sara.jpg',
            name: 'Sara Jeruss',
            title: 'Chief Operating Officer',
            desc: "Sara provides day-to-day leadership and management for Quill. She has 9+ years of tech industry experience, most recently as the Chief Product Officer for Climb Credit. Sara spent 3 years at Facebook, managing an internal product and advising product teams about privacy. Prior to Facebook, Sara was a product director at Lex Machina, a leading machine learning startup that was acquired by LexisNexis. Sara is a graduate of Yale Law School and Cornell University."
          },
          {
            img: 'thumb-dan.jpg',
            name: 'Daniel Drabik',
            title: 'Vice President of Engineering',
            desc: "Daniel is responsible for the oversight and development of Quill’s technology. Daniel has over a decade of experience writing software, leading tech teams, and managing engineers. He was the lead developer for Kickstarter's international expansion, building a system that has processed over a billion dollars in pledges, and he was an engineer on the Data Infrastructure team for the Hillary For America Presidential Campaign. Daniel has a Master in Public Administration from the Harvard Kennedy School and a Mathematics degree from Villanova University."
          },
					{
			      img: 'thumb-hannah.png',
			      name: "Hannah Monk",
			      title: "Curriculum Director",
			      desc: "Hannah designs the curriculum and works with educators to create new content. Before joining Quill, Hannah was a seventh grade English teacher at a low-income school in western Virginia. She has an undergraduate degree in English and a master’s degree in education."
					},
					{
			      img: 'thumb-emilia.png',
			      name: "Emilia Friedberg",
			      title: "Software Developer",
			      desc: "Emilia is a software developer who is passionate about education. Before joining Quill, Emilia taught at an elementary school in Arizona and tutored students at Breakthrough Santa Fe. As a developer, the first program she built was Word by Word, a grammar tool that teaches students how to identify parts of speech in a sentence."
			    },
          {
						img: 'thumb-maddy.png',
						name: 'Maddy Maher',
						title: 'Outreach Lead',
						desc: "Maddy is an outreach associate who joined Quill full-time after contributing as an Education Team intern. She is passionate about education and holds an Undergraduate degree in English Literature from Hamilton College."
					},
          {
            img: 'thumb-tom.png',
            name: 'Tom Calabrese',
            title: 'Product Designer',
            desc: "Tom is a designer who's passionate about building meaningful and magical products. He studied at the Fashion Institute of Technology with a Bachelor’s degree in Communication Design, as well as the School of Visual Arts with a Masters in Branding."
          },
          {
            img: 'thumb-alysia.jpg',
            name: 'Alysia Belle',
            title: 'Literacy Director',
            desc: "Alysia develops content for Quill with a focus on building its forthcoming reading curriculum. She has experience teaching in a variety of settings, including 5 years as an ESL educator in the Bronx. Before joining Quill, Alysia wrote curricula and managed edtech-focused professional learning at Democracy Prep Public Schools. Prior to Democracy Prep, she led professional development initiatives at Newsela. Alysia holds an undergraduate degree in English and a master’s degree in education."
          },
          {
            img: 'thumb-emma.png',
            name: 'Emma Volk',
            title: 'Curriculum Developer',
            desc: "Emma is a curriculum developer with a love for writing. She has an undergraduate degree in English from Columbia University and a master’s degree in English from the University of Oxford."
          },
					{
						img: 'thumb-thomas.jpg',
						name: 'Thomas Robertson',
						title: 'Senior Web Developer',
						desc: "Thomas brings his decade of software development experience to Quill with a focus on technological and operational scalability.  He is deeply committed to using technology to improve public education by empowering teachers to do more in their classrooms.  Thomas has spent most of his career working at a combination of education companies and small start-ups, which makes Quill a natural fit for his experience and skills."
					},
          {
            img: 'thumb-rachel.jpg',
            name: 'Rachel Dantzler',
            title: 'Curriculum and Operations Associate',
            desc: "Rachel is a curriculum and operations associate who joined Quill full-time after working as an education team intern. Rachel worked as an ELL teacher before her time at Quill, and she has an undergraduate degree in Mandarin Chinese and International Affairs from Wofford College."
          },
					{
						img: 'thumb-rhea.png',
						name: 'Rhea Wong',
						title: 'Director of Strategic Initiatives',
						desc: "Rhea supports Quill’s strategic partnerships, outreach and fundraising efforts. Rhea loves writing and wrote her first (self-published) book at the age of 8. She pursued her love of writing through college as the Editor in Chief of her campus paper. She was then called to mission-based work and has 15 years of experience in the nonprofit sector, 12 of them as Executive Director of Breakthrough New York. When she’s not at Quill, you can catch her on her podcast #{link_to 'Nonprofit Lowdown', 'https://podcasts.apple.com/us/podcast/nonprofit-lowdown/id1436858854?ign-mpt=uo%3D4&mt=2'}. Rhea is a graduate of McGill University and has certificates in nonprofit management and fundraising from Columbia Business School and Harvard Kennedy School."
					},
          {
            img: 'thumb-yves.jpg',
            name: 'Yves Peirsman',
            title: 'AI Open Source Partner',
            desc: "Yves Peirsman is the founder and Natural Language Processing expert at NLP Town. Yves holds a PhD in computational linguistics from the University of Leuven and was a postdoctoral researcher at Stanford University. Since he made the move from academia to industry, he has gained extensive experience in consultancy and software development for Natural Language Processing. As the co-founder of NLP Town, he leads several NLP projects, organizes NLP-focused events and contributes to open-source software."
          },
          {
            img: 'thumb-lindsey.jpg',
            name: 'Lindsey Murphy',
            title: 'Lead Curriculum Developer',
            desc: "Lindsey designs curriculum for an upcoming reading comprehension tool. Prior to working at Quill, she was teaching fourth grade English in Brooklyn. In college and as a teacher, Lindsey has engaged in various policy campaigns and initiatives to fight for educational equity. She has an undergraduate degree in political science from Boston College and a master's in teaching from the Relay Graduate School of Education."
          },
          {
            img: 'thumb-max.png',
            name: 'Maximilian de Martino',
            title: 'Curriculum Developer',
            desc: "Max is a curriculum developer who is committed to closing literacy gaps in all content areas. Prior to joining Quill, Max spent five years teaching social studies grades seven, eight, and ten, and English grade nine in public and charter schools serving low-income students in New York City. He holds a Master of Arts in Social Studies Teacher Education from Teacher's College of Columbia University."
          },
          {
            img: 'thumb-haronil.jpg',
            name: 'Haronil Estevez',
            title: 'Senior Software Developer',
            desc: "Haronil is a senior software developer with experience in media, government, and education. He holds a degree in Computer Science from Columbia University."
          },
				]
			},
			{
				team: 'Board of Directors',
				members: [
					{
						img: 'thumb-paulwalker.png',
						name: 'Paul Walker',
						title: 'Board Chair',
						desc: "Paul Walker is a New York City based technologist and philanthropist. Paul spends his philanthropic energies working with organizations that provide opportunity and social capital to young adults through access to education, science, and critical reasoning. Paul retired as a partner from Goldman Sachs in 2015, where he co-headed the firm’s technology division and held roles in risk management and technology. He holds a PhD in Physics from the University of Illinois and a BA in Physics from Cornell University."
					},
          {
            img: "thumb-jane.png",
            name: "Jane Parver",
            title: "Board Member",
            desc: "Jane Parver is an experienced trial lawyer who concentrates her practice in the areas of civil and white collar litigation and internal investigations. She is Special Counsel at Kaye Scholer, as well as part of the ASCPA board and the Columbia Law School Board of Visitors. Ms. Parver established and now oversees the Susan Price Carr Scholarship Committee, which awards several scholarships annually to Columbia Law School students."
          },
					{
						img: 'thumb_ben.png',
						name: "Ben Sussman",
						title: "Board Member",
						desc: "Ben Sussman is an Engineer at Spell and is a technical advisor to Quill. He has 10+ years of experience as a computer programmer and entrepreneur. On the weekends, Ben volunteers with Nanohackers to teach programming to kids."
					},
					{
						img: 'thumb_rubin.png',
						name: 'Reuben Gutoff',
						title: 'Board Member',
						desc: "Reuben Gutoff founded Strategy Associates Inc., in 1979 and serves as its President and Sole Owner. Mr. Gutoff served as Senior Vice President of Corporate Strategy of GE's plastics and medical businesses. He worked at GE for 27 years, holding several leadership positions. After leaving GE in 1975, he joined Standard Brands, where he served as its President, Chief Operating Officer and Director, until 1978."
					},
					{
						img: 'thumb-rhys.png',
						name: 'Rhys Kidd',
						title: 'Board Member',
						desc: "Rhys Kidd is an experienced infrastructure and real assets fund manager at Macquarie Group. Alongside his experience in strategic management and capital growth initiatives, he has an avid and active interest in technology and education."
					},
					{
						img: 'thumb-matthew.jpg',
						name: 'Matthew Rodriguez',
						title: 'Board Member',
						desc: "Matt Rodriguez is a Managing Director at BlackRock where he focuses on absolute return mortgage strategies. He began his career as a financial modeler after earning masters degrees in mathematics and financial engineering. Matt also serves on the Mathematics Department Advisory Board at UIUC and supports scholarship programs."
					},
					{
						img: 'thumb-stephanie.jpg',
						name: 'Stephanie Cohen',
						title: 'Board Member',
						desc: "Stephanie is the global head of Financial Sponsor M&A and is a member of the Partnership Committee at Goldman Sachs. She joined Goldman Sachs in 1999 as an analyst and was named managing director in 2008 and partner in 2014. Stephanie serves on the National Boards for two literacy focused non-profits, Reading Partners and Quill."
					},
				]
			},
			{
				team: 'Education Advisory Board',
				members: [
					{
						img: 'thumb-peg.jpg',
						name: 'Peg Tyre',
						title: "Advisory Board Member",
						desc: "Peg Tyre is a longtime education journalist and the best-selling author of two books on education. She is also director of strategy for The Edwin Gould Foundation, which invests in organizations that get low-income students to and through college. Tyre is currently at work on a book about literacy."
					},
					{
						img: 'thumb-emily.jpg',
						name: 'Emily Dalton Smith',
						title: 'Advisory Board Member',
						desc: "Emily Dalton Smith was Quill's program officer at the Gates Foundation during the Literacy Courseware Challenge. She currently works at Facebook."
					},
					{
						img: 'thumb-quill.png',
						name: 'John Silberstein',
						title: 'Advisory Board Member',
						desc: "After beginning his career as a real estate lawyer at Skadden Arps, John Silberstein pursued an entrepreneurial path in real estate and technology. John then taught middle school English at The Dalton School in New York City and The Rivers School in Weston, MA. John is currently on the Board of Snap Interactive, a publicly traded social media company and is on the Advisory Board of Will Power Labs, which makes Meal Enders, a dietary lozenge."
					}
				]
			},
			{
				team: 'Technical Advisory Board',
				members: [
          {
            img: 'thumb-donald.png',
            name: 'Donald McKendrick',
            title: 'Advisory Board Member',
            desc: "Donald is a Software Engineer at One Medical. He previously served as Quill's Technology Director. Prior to that, he led financial services and e-commerce startups. He is inspired by the opportunity to help educate millions of students through educational technology."
          },
					{
						img: 'thumb-alex.png',
						name: "Alex Redmon",
						title: "Advisory Board Member",
						desc: "Alex is an art collector, I.T. professional, and entrepreneur living in Brooklyn who enjoys reading, writing, photography, and music."
					}
				]
			},
      {
        team: 'Marketing Advisory Board',
        members: [
          {
            img: 'thumb-jane.jpg',
            name: 'Jane Nevins',
            title: 'Marketing Advisor',
            desc: 'Before moving to New York, Jane worked in Silicon Valley for 10 years. She was one of the first 11 employees at Lyft and has worked at other noteworthy startups like SolarCity and SunRun. In 2017 she received a master’s degree from the Communication Department of Stanford University, where she studied journalism, data analysis and the economics of news. She also earned a Bachelor of Arts degree from Stanford in 2005. '
          }
        ]
      }
			# {
			# 	team: 'Interns and Volunteers',
			# 	members: [
      #     {
      #       img: 'thumb-eric.jpg',
      #       name: 'Eric Tang',
      #       title: 'Software Development Intern',
      #       desc: "Eric is a rising sophomore at Stanford University who enjoys reading novels, tutoring students and fiddling with Natural Language Processing algorithms. He’s working at Quill this summer because he’s excited to help students become better writers and communicators!"
      #     }
			# 	]
			# }
		]
	end
end
