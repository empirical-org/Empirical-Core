module PagesHelper

	def pages_tab_class tabname
		about_actions = ["mission", "develop", "faq"]
		impact_actions = ['impact']
		team_actions = %w(team)
		partners_actions = %w(partners)
		news_actions = %w(news)
		press_actions = %w(press)
		standards_actions = ['activities']
		topics_actions = ['index']
		faq_actions = ['faq']
		media_kit_actions = ['media_kit']
		getting_started_actions = ['teacher_resources']
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
		elsif tabname == 'getting_started'
			getting_started_actions.include?(action_name) ? 'active' : ''
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
		arr = [
			{team: 'Quill Team',
			members: [
	     		{
		      img: 'thumb-peter.png',
		      name: 'Peter Gault',
		      title: 'Executive Director, Cofounder',
		      desc: "Peter designs the user experience, coordinates the team, and leads fundraising. He grew up playing and  designing educational games and found his passion for writing as a journalist at his high school's newspaper. With Quill, Peter aims to help millions of students to become better writers and thinkers. He wrote his senior thesis at Bates College on how emotions influence learning and moral judgments. In 2016, he was awarded Forbes 30 Under 30 for education."
			},
			{
				img: 'thumb-ryan.png',
				name: "Ryan Novas",
				title: "Operations Director/Web Developer, Cofounder",
				desc: "Ryan develops new features for Quill and maintains the website. He also oversees Quill's operations and directs technical support initiatives. Ryan previously taught English to high school students in Maine and has worked at marketing and public relations companies in Washington and New York."
			},
			{
			img: 'thumb-donald.png',
		      name: 'Donald McKendrick',
		      title: 'Technology Director, Cofounder',
		      desc: "Donald is a developer who likes to create open platforms for learning.
					He has a master's degree in chemistry with a specialization in computer
					aided modeling and statistical analysis."
			},
			{
		      img: 'thumb-hannah.png',
		      name: "Hannah Monk",
		      title: "Curriculum Director",
		      desc: "Hannah designs the curriculum and works with educators to create new content. Before joining Quill, Hannah was a seventh grade English teacher at a low-income school in western Virginia. She has an undergraduate degree in English and a master’s degree in education."
	      		}
			},
			{
		      img: 'thumb-emilia.png',
		      name: "Emilia Friedberg",
		      title: "Junior Web Developer",
		      desc: "Emilia is a developer who is passionate about education. Before joining Quill, Emilia taught at an elementary school in Arizona and tutored students at Breakthrough Santa Fe. As a developer, the first program she built was Word by Word, a grammar tool that teaches students how to identify parts of speech in a sentence."
	      		}
			]},
			{team: 'Board of Directors',
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
					}
					{
					img: 'thumb-rhys.png',
					name: 'Rhys Kidd',
					title: 'Board Member',
					desc: "Rhys Kidd is an experienced infrastructure and real assets fund manager at Macquarie Group. Alongside his experience in strategic management and capital growth initiatives, he has an avid and active interest in technology and education."
					},
					{
					img: 'thumb-quill.png',
					name: 'Matthew Rodriguez',
					title: 'Board Member',
					desc: "Matt Rodriguez is a Managing Director at BlackRock where he focuses on absolute return mortgage strategies. He began his career as a financial modeler after earning masters degrees in mathematics and financial engineering. Matt also serves on the Mathematics Department Advisory Board at UIUC and supports scholarship programs."
					},
				# {
				# 	img: "thumb-tim.png",
				# 	name: "Timothy Grieves",
				# 	title: "Board Member",
				# 	desc: "Timothy Grieves is the chief administrator of the Northwest AEA, a regional agency that advises 33,000 students in Iowa. Northwest AEA provides visionary leadership and quality, student-centered services through relationships with families, schools and communities."
					# },
				
			]},
			{team: 'Education Advisory Board',
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
					desc: "After beginning his career as a real estate lawyer at Skadden Arps, John Silberstein pursued an entrepreneurial path in real estate and technology. John then taught middle school English at The Dalton School in New York CIty and The Rivers School in Weston, MA.  John is currently on the Board of Snap Interactive, a publicly traded social media company and is on the Advisory Board of Will Power Labs, which makes Meal Enders, a dietary lozenge."
				},
				{
					img: 'thumb-deborah.jpg',
					name: 'Deborah Chang',
					title: 'Advisory Board Member',
					desc: "Deborah Chang is an educator and an entrepreneur. She co-founded Nexus Works, a community of people working with purpose and is also a community organizer of #NYCEDU, an organization that curates, coaches, and connects community organizers."
					}]},
					{team: 'Technical Advisory Board',
					members: [
				{
	    				img: "thumb-oliver.jpg",
	      				name: "Oliver Hurst Hiller",
	      				title: "Advisory Board Member",
	      				desc: "Oliver is the CTO and Head of Product at DonorsChoose.org. Previously, he managed product engineering projects for Microsoft's new search engine, now called Bing."
					}]},

				{team: 'Open Source Developers',
					members: [
				{
					img: 'thumb-alex.png',
					name: "Alex Redmon",
					title: "Open Source Developer",
					desc: "Alex is an art collector, I.T. professional, and entrepreneur living in Brooklyn who enjoys reading, writing, photography, and music."
				},
				{
					img: 'thumb-matt-coleman.png',
					name: "Matt Coleman",
					title: "Developer",
					desc: "Matt is a developer with a BS in Computer Engineering. He likes Fedora and lives in Boston."
				}
				]
				}
				]
	    arr
	end
end
