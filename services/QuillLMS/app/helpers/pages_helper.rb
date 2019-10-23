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
            name: 'Rachel Dantzler',
            title: 'Editorial and Outreach Associate',
            img: 'rachel-dantzler.jpg'
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
