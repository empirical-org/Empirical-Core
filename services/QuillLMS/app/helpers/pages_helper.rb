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
        team: 'Leadership team',
        image_prepend: 'team-',
        members: [
          {
            name: 'Daniel Drabik',
            title: 'Vice President of Engineering',
            img: 'daniel-drabik.jpg'
          },
          {
            name: 'Peter Gault',
            title: 'Executive Director, Cofounder',
            img: 'peter-gault.jpg'
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
            name: 'Sara Jeruss',
            title: 'Chief Operating Officer',
            img: 'sara-jeruss.jpg'
          }
        ]
      },
      {
        team: 'Entire team',
        image_prepend: 'team-',
        members: [
          {
            img: 'thumb-tom.png',
            name: 'Tom Calabrese',
            title: 'Product Designer',
            img: 'tom-calabrese.jpg'
          },
          {
            name: 'Christina Collins',
            title: 'Head of School Success',
            img: 'christina-collins.jpg'
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
            title: 'Editorial and Outreach Associate',
            img: 'rachel-dantzler.jpg'
          },
					{
						img: 'thumb-rhea.png',
						name: 'Rhea Wong',
						title: 'Director of Strategic Initiatives',
						desc: "Rhea supports Quill’s strategic partnerships, outreach and fundraising efforts. Rhea loves writing and wrote her first (self-published) book at the age of 8. She pursued her love of writing through college as the Editor in Chief of her campus paper. She was then called to mission-based work and has 15 years of experience in the nonprofit sector, 12 of them as Executive Director of Breakthrough New York. When she’s not at Quill, you can catch her on her podcast #{link_to 'Nonprofit Lowdown', 'https://podcasts.apple.com/us/podcast/nonprofit-lowdown/id1436858854?ign-mpt=uo%3D4&mt=2'}. Rhea is a graduate of McGill University and has certificates in nonprofit management and fundraising from Columbia Business School and Harvard Kennedy School."
					},
          {
            name: 'Maximilian de Martino',
            title: 'Curriculum Developer',
            img: 'maximilian-de-martino.jpg'
          },
          {
            name: 'Haronil Estevez',
            title: 'Senior Software Developer',
            img: 'haronil-estevez.jpg'
          },
          {
            name: 'Emilia Friedberg',
            title: 'Software Developer',
            img: 'emilia-friedberg.jpg'
          },
          {
            name: 'Maddy Maher',
            title: 'Outreach Lead',
            img: 'maddy-maher.jpg'
          },
          {
            name: 'Hannah Monk',
            title: 'Curriculum Director',
            img: 'hannah-monk.jpg'
          },
          {
            name: 'Lindsey Murphy',
            title: 'Lead Curriculum Developer',
            img: 'lindsey-murphy.jpg'
          },
          {
            name: 'Yves Peirsman',
            title: 'AI Open Source Partner',
            img: 'yves-peirsman.jpg'
          },
          {
            name: 'Thomas Robertson',
            title: 'Senior Web Developer',
            img: 'thomas-robertson.jpg'
          },
          {
            name: 'Emma Volk',
            title: 'Curriculum Developer',
            img: 'emma-volk.jpg'
          },
          {
            name: 'Rhea Wong',
            title: 'Director of Strategic Initiatives',
            img: 'rhea-wong.jpg'
          }
        ]
      }
    ]
	end

  def board_and_advisors_info
    [
      {
        team: 'Board of directors',
        image_prepend: 'board-',
        members: [
          {
            name: 'Stephanie Cohen',
            title: 'Chief Strategy Officer at Goldman Sachs',
            img: 'stephanie-cohen.jpg'
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
					{
						img: 'thumb-peg.jpg',
						name: 'Peg Tyre',
						title: "Board Member",
						desc: "Peg Tyre is a longtime education journalist and the best-selling author of two books on education. She is also director of strategy for The Edwin Gould Foundation, which invests in organizations that get low-income students to and through college. Tyre is currently at work on a book about literacy."
					}
				]
			},
			{
				team: 'Education Advisory Board',
				members: [
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
            name: 'Reuben Gutoff',
            title: 'Retired Vice President at General Electric',
            img: 'reuben-gutoff.jpg'
          },
          {
            name: 'Rhys Kidd',
            title: 'Vice President at Macquarie Group',
            img: 'rhys-kidd.jpg'
          },
          {
            name: 'Jane Parver',
            title: 'Partner at Kaye Scholer',
            img: 'jane-parver.jpg'
          },
          {
            name: 'Matthew Rodriguez',
            title: 'Managing Director at BlackRock',
            img: 'matthew-rodriguez.jpg'
          },
          {
            name: 'Ben Sussman',
            title: 'Engineer at Spell',
            img: 'ben-sussman.jpg'
          },
          {
            name: 'Peg Tyre',
            title: 'Director of Strategy at The Edwin Gould Foundation',
            img: 'peg-tyre.jpg'
          },
          {
            name: 'Paul Walker',
            title: 'Quill Board Chair, Retired Partner at Goldman Sachs',
            img: 'paul-walker.jpg'
          }
        ]
      },
      {
        team: 'Advisors',
        image_prepend: 'advisor-',
        members: [
          {
            name: 'Donald McKendrick',
            title: 'Software Engineer at One Medical',
            img: 'donald-mckendrick.jpg'
          },
          {
            name: 'Jane Nevins',
            title: 'Director of Giving at Freedom for All Americans',
            img: 'jane-nevins.jpg'
          },
          {
            name: 'Alex Redmon',
            title: 'Senior Software Engineer at Cylera',
            img: 'alex-redmon.jpg'
          },
          {
            name: 'John Silberstein',
            title: 'Board of Directors at  Snap Interactive',
            img: 'john-silberstein.jpg'
          },
          {
            name: 'Emily Dalton Smith',
            title: 'Director of Social Impact  Product at Facebook',
            img: 'emily-dalton-smith.jpg'
          }
        ]
      }
    ]
  end
end
