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
        imagePrepend: 'team-',
        members: [
          {
            name: 'Daniel Drabik',
            title: 'Vice President of Engineering'
          },
          {
            name: 'Peter Gault',
            title: 'Executive Director, Cofounder'
          },
          {
            name: 'Sara Jeruss',
            title: 'Chief Operating Officer'
          }
        ]
      },
      {
        team: 'Entire team',
        imagePrepend: 'team-',
        members: [
          {
            name: 'Tom Calabrese',
            title: 'Product Designer'
          },
          {
            name: 'Christina Collins',
            title: 'Head of School Success'
          },
          {
            name: 'Rachel Dantzler',
            title: 'Editorial and Outreach Associate'
          },
          {
            name: 'Maximilian de Martino',
            title: 'Curriculum Developer'
          },
          {
            name: 'Haronil Estevez',
            title: 'Senior Software Developer'
          },
          {
            name: 'Emilia Friedberg',
            title: 'Software Developer'
          },
          {
            name: 'Maddy Maher',
            title: 'Outreach Lead'
          },
          {
            name: 'Hannah Monk',
            title: 'Curriculum Director'
          },
          {
            name: 'Lindsey Murphy',
            title: 'Lead Curriculum Developer'
          },
          {
            name: 'Yves Peirsman',
            title: 'AI Open Source Partner'
          },
          {
            name: 'Thomas Robertson',
            title: 'Senior Web Developer'
          },
          {
            name: 'Emma Volk',
            title: 'Curriculum Developer'
          },
          {
            name: 'Rhea Wong',
            title: 'Director of Strategic Initiatives'
          }
        ]
      },
      {
        team: 'Board of directors',
        imagePrepend: 'board-',
        members: [
          {
            name: 'Stephanie Cohen',
            title: 'Chief Strategy Officer at Goldman Sachs'
          },
          {
            name: 'Reuben Gutoff',
            title: 'Retired Vice President at General Electric'
          },
          {
            name: 'Rhys Kidd',
            title: 'Vice President at Macquarie Group'
          },
          {
            name: 'Jane Parver',
            title: 'Partner at Kaye Scholer'
          },
          {
            name: 'Matthew Rodriguez',
            title: 'Managing Director at BlackRock'
          },
          {
            name: 'Ben Sussman',
            title: 'Engineer at Spell'
          },
          {
            name: 'Peg Tyre',
            title: 'Director of Strategy at The Edwin Gould Foundation'
          },
          {
            name: 'Paul Walker',
            title: 'Quill Board Chair, Retired Partner at Goldman Sachs'
          }
        ]
      },
      {
        team: 'Advisors',
        imagePrepend: 'advisor-',
        members: [
          {
            name: 'Donald McKendrick',
            title: 'Software Engineer at One Medical'
          },
          {
            name: 'Jane Nevins',
            title: 'Director of Giving at Freedom for All Americans'
          },
          {
            name: 'Alex Redmon',
            title: 'Senior Software Engineer at Cylera'
          },
          {
            name: 'John Silberstein',
            title: 'Board of Directors at  Snap Interactive'
          },
          {
            name: 'Emily Dalton Smith',
            title: 'Director of Social Impact  Product at Facebook'
          }
        ]
      },
    ]
	end
end
