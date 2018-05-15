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
						img: 'thumb-ryan.png',
						name: "Ryan Novas",
						title: "COO, Web Developer, Cofounder",
						desc: "Ryan develops new features for Quill and maintains the website. He also oversees Quill's operations and directs technical support initiatives. Ryan previously taught English to high school students in Maine and has worked at marketing and public relations companies in Washington and New York."
					},
					{
						img: 'thumb-donald.png',
			      name: 'Donald McKendrick',
			      title: 'Technology Director, Cofounder',
			      desc: "Donald leads Quill’s engineering team and has a master’s degree in chemistry with a specialization in computer aided modeling and statistical analysis. Donald has previously led financial services and e-commerce startups and is inspired by the opportunity to help educate millions of students through educational technology."
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
			      desc: "Emilia is a developer who is passionate about education. Before joining Quill, Emilia taught at an elementary school in Arizona and tutored students at Breakthrough Santa Fe. As a developer, the first program she built was Word by Word, a grammar tool that teaches students how to identify parts of speech in a sentence."
			    },
					{
						img: 'thumb-amr.png',
						name: 'Amr Thameen',
						title: 'Lead Designer',
						desc: "Amr is the Lead Designer at Quill. He designs Quill’s interface, creates the user experience, and oversees the overall brand image. A speaker of three different languages and graduate of schools on multiple continents, Amr sees the importance of improving students' writing and its effect on critical thinking. Before Quill, Amr was a designer at multiple startups, working with Virtual Reality and the travel industry. Amr holds a bachelor’s degree in Architecture from Middlebury College."
					},
					{
						img: 'thumb-becca.jpg',
						name: 'Becca Garrison',
						title: 'Partnerships Director',
						desc: "Becca supports teachers and schools in using Quill to its full potential to strengthen student writing. Previously she coached teachers and schools with integrating instructional technology in pedagogically sound ways. She started her career teaching secondary English in schools across the South Bronx and Colorado."
					},
					{
						img: 'thumb-jenny.jpg',
						name: 'Jenny Price',
						title: 'Editorial Associate',
						desc: "Jenny creates new content and works with the Engineering team to provide real-time feedback to students. Before joining Quill, Jenny taught English to elementary school students in France. She holds an undergraduate degree in French and is passionate about improving communication."
					},
					{
						img: 'thumb-jared-silver.jpg',
						name: "Jared Silver",
						title: "Software Developer",
						desc: "Jared Silver is a software developer who joined Quill full-time after contributing as an open source volunteer and intern. He has worked with a number of edtech organizations, such as Codecademy, EdSurge, and Oppia Foundation, and he cares deeply about using technology to make education more equitable."
					}
				]
			},
			{
				team: 'Board of Directors',
				members: [
					{
						img: "thumb-jane.png",
						name: "Jane Parver",
						title: "Board Chair",
						desc: "Jane Parver is an experienced trial lawyer who concentrates her practice in the areas of civil and white collar litigation and internal investigations. She is Special Counsel at Kaye Scholer, as well as part of the ASCPA board and the Columbia Law School Board of Visitors. Ms. Parver established and now oversees the Susan Price Carr Scholarship Committee, which awards several scholarships annually to Columbia Law School students."
					},
					{
						img: 'thumb-paulwalker.png',
						name: 'Paul Walker',
						title: 'Board Member',
						desc: "Paul Walker is a New York City based technologist and philanthropist. Paul spends his philanthropic energies working with organizations that provide opportunity and social capital to young adults through access to education, science, and critical reasoning. Paul retired as a partner from Goldman Sachs in 2015, where he co-headed the firm’s technology division and held roles in risk management and technology. He holds a PhD in Physics from the University of Illinois and a BA in Physics from Cornell University."
					},
					{
						img: 'thumb_ben.png',
						name: "Ben Sussman",
						title: "Board Member",
						desc: "Ben Sussman is a Lead Engineer at Betterment and is a technical advisor to Quill. He has 10+ years of experience as a computer programmer and entrepreneur. On the weekends, Ben volunteers with Nanohackers to teach programming to kids."
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
						img: 'thumb-daniel.jpg',
						name: 'Daniel Scibienski',
						title: "Advisory Board Member",
						desc: "Daniel Scibienski is the founder of ELL Consulting.  He has been involved in English language education for over 14 years as a teacher, trainer, and program administrator."
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
					},
					{
						img: 'thumb-deborah.jpg',
						name: 'Deborah Chang',
						title: 'Advisory Board Member',
						desc: "Deborah Chang is an educator and an entrepreneur. She co-founded Nexus Works, a community of people working with purpose and is also a community organizer of #NYCEDU, an organization that curates, coaches, and connects community organizers."
					}
				]
			},
			{
				team: 'Technical Advisory Board',
				members: [
					{
						img: 'thumb-alex.png',
						name: "Alex Redmon",
						title: "Open Source Developer",
						desc: "Alex is an art collector, I.T. professional, and entrepreneur living in Brooklyn who enjoys reading, writing, photography, and music."
					},
					{
	  				img: "thumb-oliver.jpg",
	  				name: "Oliver Hurst Hiller",
	  				title: "Advisory Board Member",
	  				desc: "Oliver is the CTO and Head of Product at DonorsChoose.org. Previously, he managed product engineering projects for Microsoft's new search engine, now called Bing."
					}
				]
			},
			{
				team: 'Interns and Volunteers',
				members: [
					{
						img: 'thumb-matt-coleman.png',
						name: "Matt Coleman",
						title: "Developer",
						desc: "Matt is a developer with a BS in Computer Engineering. He likes Fedora and lives in Boston.",
					},
					{
						img: 'thumb_akash.png',
						name: "Akash Bagaria",
						title: "Intern",
						desc: "Akash is a student taking a gap year prior to attending Harvard University, where he intends to study economics. He is driven to intern at Quill by his fascination with the start-up culture and his love for serving the broader community. Having avidly debated and written for the newspaper throughout high school, Akash grasps the importance of critical thinking -- and he values Quill's mission to instill this skill in students nationwide."
					},
					{
						img: 'thumb_priya.png',
						name: "Priya Mathur",
						title: "Intern",
						desc: "Priya is a graduate student at NYU studying Digital Media Design for Learning. Before pursuing a master’s degree, she was an elementary school teacher and taught in both Canada and England. Most recently, Priya worked as an Educational Technology Consultant in elementary schools across Toronto, training students and teachers on how to accommodate assistive technology to their individual learning needs. She is enthusiastic about learning how educational technology can remove barriers to learning and change the landscape of education."
					},
					{
						img: 'thumb_olivia.png',
						name: 'Olivia Kingree',
						title: 'Intern',
						desc: "Olivia Kingree is a college student who is interning at Quill for the Spring 2017 semester. As an editorial intern, she creates new learning activities and grades existing practice problems. Olivia has also worked as a math and Spanish tutor for middle and high school students for the past four years. She is passionate about reading and writing and hopes to help Quill in its aim to  improve students' writing skills and confidence."
					},
				]
			}
		]
	end
end
