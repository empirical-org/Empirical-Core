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

end
