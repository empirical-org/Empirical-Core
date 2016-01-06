module PagesHelper

	def pages_tab_class tabname
		about_actions = ["mission", "develop", "faq", "team"]
		impact_actions = ['impact']
		activities_actions = ['activities']
		media_actions = ['news', 'press', 'blog_posts', 'press_kit']

		if tabname == "about"
			about_actions.include?(action_name) ? 'active' : ''
		elsif tabname == "media"
			media_actions.include?(action_name) ? 'active' : ''
		elsif tabname == "impact"
			impact_actions.include?(action_name) ? 'active' : ''
		elsif tabname == 'activities'
			activities_actions.include?(action_name) ? 'active' : ''
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
		      title: 'Executive Director, Founder',
		      desc: "Peter designs the user's experience and coordinates the Empirical team. Peter wrote his senior thesis at Bates College on the role of emotion in moral judgements."
		  },
		  {
		      img: 'thumb-elliot.png',
		      name: "Elliot Mandel",
		      title: "Partnerships Director, Cofounder",
		      desc: "Elliot Mandel is the director of partnerships and product, with a focus on truly making learning interactive for all students. He is a graduate of the Harvard Graduate School of Education, where he specialized in building educational tools that empower all students to succeed."
	  	  },
	  	  {
		      img: 'thumb-tom.png',
		      name: "Tom Calabrese",
		      title: "Creative Director, Cofounder",
		      desc: "Thomas is a designer who likes to think about strategy, people, and science fiction. He studied at the Fashion Institute of Technology with a Bachelor’s degree in Communication Design, as well as the School of Visual Arts with a Masters in Branding."
	      },
	      {
		      img: 'thumb-marcello.png',
		      name: 'Marcello Sachs',
		      title: 'Technical Director, Cofounder',
		      desc: "Marcello has a background in pure math from Brown University, and he currently enjoys reading about ideas in analytic philosophy."
		  },
		  {
		      img: 'thumb-ryan.jpg',
		      name: "Ryan Novas",
		      title: "Operations Director, Cofounder",
		      desc: "Ryan works with teachers to create new features content for Quill. He also helps integrate Quill into classrooms and oversees daily operations at Empirical."
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
						img: 'thumb_rubin.png',
						name: 'Rubin Gutoff',
						title: 'Board Member',
						desc: "Reuben Gutoff founded Strategy Associates Inc., in 1979 and serves as its President and Sole Owner. Mr. Gutoff served as Senior Vice President of Corporate Strategy of GE's plastics and medical businesses. He worked at GE for 27 years, holding several leadership positions. After leaving GE in 1975, he joined Standard Brands, where he served as its President, Chief Operating Officer and Director, until 1978."
					},
					{
						img: "thumb-tim.png",
						name: "Timothy Grieves",
						title: "Board Member",
						desc: "Timothy Grieves is the chief administrator of the Northwest AEA, a regional agency that advises 33,000 students in Iowa. Northwest AEA provides visionary leadership and quality, student-centered services through relationships with families, schools and communities."
					},
					{
						img: 'thumb_ben.png',
						name: "Ben Sussman",
						title: "Board Member",
						desc: "Ben Sussman is the Director of Engineering at Zoc Doc and is a technical advisor to Quill. He has 10+ years of experience as a computer programmer and entrepreneur. His years at Zoc Doc have fed his passion for combining technology and user education."
					}
			]},
			{team: 'Education Advisory Board',
			members: [
				{
					img: 'thumb-daniel.jpg',
					name: 'Daniel Scibinski',
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
					img: "thumb_anthony.png",
					name: "Anthony Principe",
					title: "Advisory Board Member",
					desc: "Anthony is a special education teacher and administrator who was instrumental in developing cutting-edge inclusion programs for students diagnosed with a wide range of disabilities in Newton, MA. Anthony is a mentor to edtech entrepreneurs at the Learn Launch Accelerator Program and an advisor to JFY Networks. "
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
