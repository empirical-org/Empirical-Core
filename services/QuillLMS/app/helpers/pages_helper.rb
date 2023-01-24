# frozen_string_literal: true

module PagesHelper

  # rubocop:disable Metrics/CyclomaticComplexity
  def pages_tab_class(tabname)
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
    case tabname
    when "about"
      about_actions.include?(action_name) ? 'active' : ''
    when 'faq'
      faq_actions.include?(action_name) ? 'active' : ''
    when 'press'
      press_actions.include?(action_name) ? 'active' : ''
    when 'partners'
      partners_actions.include?(action_name) ? 'active' : ''
    when "media"
      media_actions.include?(action_name) ? 'active' : ''
    when "team"
      team_actions.include?(action_name) ? 'active' : ''
    when 'getting-started'
      # TODO: revert this when we launch front end of knowlege center
      action_name == 'temporarily_render_old_teacher_resources' ? 'active' : ''
    when 'news'
      news_actions.include?(action_name) ? 'active' : ''
    when 'media_kit'
      media_kit_actions.include?(action_name) ? 'active' : ''
    when "impact"
      impact_actions.include?(action_name) ? 'active' : ''
    when 'standards'
      standards_actions.include?(action_name) ? 'active' : ''
    when 'topics'
      topics_actions.include?(action_name) ? 'active' : ''
    when 'premium'
      action_name == 'premium_from_discover' ? "premium-tab active" : ''
    end

  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def subtab_class(tabname)
    if action_name == tabname
      "active"
    else
      ""
    end
  end

  def team_info
    [
      {
        team: 'Management team',
        members: [
          {
            name: 'Christina Collins-Berry',
            title: 'Managing Director of Partnerships',
            img: 'team-christina-collins@2x.png'
          },
          {
            name: 'Daniel Drabik',
            title: 'Chief Technology Officer',
            img: 'team-daniel-drabik@2x.png'
          },
          {
            name: 'Peter Gault',
            title: 'Executive Director, Cofounder',
            img: 'team-peter-gault@2x.png'
          },
          {
            name: 'Sarah Kelly',
            title: 'Managing Director of Strategic Impact',
            img: 'team-sarah-kelly@2x.png'
          },
          {
            name: 'Lila Jane Mabe',
            title: 'Managing Director of Strategy & Impact',
            img: 'team-lila-jane-mabe@2x.png'
          },
          {
            name: 'Hannah Monk',
            title: 'Managing Director of Curriculum',
            img: 'team-hannah-monk@2x.png'
          }
        ]
      },
      {
        team: 'Entire team',
        image_prepend: 'team-',
        members: [
          {
            name: 'Eric Adams',
            title: 'Software Engineer II',
            img: 'team-eric-adams@2x.png'
          },
          {
            name: 'Devin Kawailani Barricklow',
            title: 'Senior Curriculum Developer',
            img: 'team-devin-barricklow@2x.png'
          },
          {
            name: 'Shannon Browne',
            title: 'Professional Learning Manager',
            img: 'team-shannon-browne@2x.png'
          },
          {
            name: 'Nattalie Dai',
            title: 'Partnerships Specialist I',
            img: 'team-nattalie-dai@2x.png'
          },
          {
            name: 'Rachel Dantzler',
            title: 'Senior Curriculum Developer',
            img: 'team-rachel-dantzler@2x.png'
          },
          {
            name: 'Ellie Dean',
            title: 'Finance & Operations Specialist II',
            img: 'team-ellie-dean@2x.png'
          },
          {
            name: 'Emilia Friedberg',
            title: 'Senior Software Engineer I',
            img: 'team-emilia-friedberg@2x.png'
          },
          {
            name: 'Peter Kong',
            title: 'Senior Software Engineer II',
            img: 'team-peter-kong@2x.png'
          },
          {
            name: 'Sherry Lewkowicz',
            title: 'Professional Learning Manager',
            img: 'team-sherry-lewkowicz@2x.png'
          },
          {
            name: 'Charlie Looper',
            title: 'Partnerships Specialist II',
            img: 'team-charlie-looper@2x.png'
          },
          {
            name: 'Stephanee McCadney',
            title: 'Curriculum Developer II',
            img: 'team-stephanee-mccadney@2x.png'
          },
          {
            name: 'Scarlet Melo',
            title: 'Partnerships Specialist II',
            img: 'team-scarlet-melo@2x.png'
          },
          {
            name: 'Katie Moylan',
            title: 'Curriculum Developer II',
            img: 'team-katie-moylan@2x.png'
          },
          {
            name: 'Alex Otstott',
            title: 'Director of District Partnerships',
            img: 'team-alex-otstott@2x.png'
          },
          {
            name: 'Erika Parker-Havens',
            title: 'Professional Learning Manager',
            img: 'team-erika-parker-havens@2x.png'
          },
          {
            name: 'Yves Peirsman',
            title: 'AI Open Source Partner',
            img: 'team-yves-peirsman@2x.png'
          },
          {
            name: 'Thomas Robertson',
            title: 'Senior Software Engineer II',
            img: 'team-thomas-robertson@2x.png'
          },
          {
            name: 'Peter Sharkey',
            title: 'Principal Product Manager',
            img: 'team-peter-sharkey@2x.png'
          },
          {
            name: 'Brendan Shean',
            title: 'Staff Software Engineer',
            img: 'team-brendan-shean@2x.png'
          },
          {
            name: 'Emma Volk',
            title: 'Lead Curriculum Developer',
            img: 'team-emma-volk@2x.png'
          },
          {
            name: 'Anna Waterman',
            title: 'Curriculum Developer II',
            img: 'team-anna-waterman@2x.png'
          },
          {
            name: 'Jack Yi',
            title: 'Staff Product Designer',
            img: 'team-jack-yi@2x.png'
          },
          {
            name: 'Cissy Yu',
            title: 'Software Engineer II',
            img: 'team-cissy-yu@2x.png'
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
            name: 'Paul Walker',
            title: 'Quill Board Chair, Retired Partner at Goldman Sachs',
            img: 'board-paul-walker@2x.png'
          },
          {
            name: 'Tony Sebro',
            title: 'General Counsel at Change.org',
            img: 'board-tony-sebro@2x.png'
          },
          {
            name: 'Peg Tyre',
            title: 'VP of Strategy at the Edwin Gould Foundation',
            img: 'board-peg-tyre@2x.png'
          },
          {
            name: 'Matthew Rodriguez',
            title: 'Trader at Millennium Management',
            img: 'board-matthew-rodriguez@2x.png'
          },
          {
            name: 'Stephanie Cohen',
            title: 'Co-Head of Consumer Wealth Management at Goldman',
            img: 'board-stephanie-cohen@2x.png'
          },
          {
            name: 'Ben Sussman',
            title: 'Engineer at Stripe',
            img: 'board-ben-sussman@2x.png'
          }
        ]
      },
      {
        team: 'Advisors',
        members: [
          {
            name: 'Rick Benger',
            title: 'Creator of Once upon a Pancake',
            img: 'advisor-rick-benger@2x.png'
          },
          {
            name: 'Alex Redmon',
            title: 'Engineering Manager at Hearst',
            img: 'advisor-alex-redmon@2x.png'
          },
          {
            name: 'Ashley Winn',
            title: 'English Language Arts Teacher, Educational Consultant',
            img: 'advisor-ashley-winn@2x.png'
          }
        ]
      }
    ]
  end

  def preap_and_springboard_content
    [
      {
        title: 'Unit 1: Telling Details',
        learning_cycles: [
          {
            activities: [
              {
                title: 'Sentence Combining: “The First Day” by Edward P. Jones',
                description: 'Explore first-person narration and characterization',
                unit_template_id: '216',
                cb_anchor_tag: 'the-first-day'
              }
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: “What Happened During the Ice Storm” by Jim Heynen',
                description: 'Explore flash fiction and the establishment of tension and setting',
                unit_template_id: '218',
                cb_anchor_tag: 'what-happened-during-the-ice-storm'
              },
              {
                title: 'Sentence Combining: “The Red Fox Fur Coat” by Teolinda Gersão',
                description: 'Explore fantastical storytelling and character evolution',
                unit_template_id: '219',
                cb_anchor_tag: 'the-red-fox-fur-coat'
              },
              {
                title: 'Sentence Combining: “Lamb to the Slaughter” by Roald Dahl',
                description: 'Explore narrative revelations with sudden character shifts',
                unit_template_id: '220',
                cb_anchor_tag: 'lamb-to-the-slaughter'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: “An Occurrence at Owl Creek Bridge” by Ambrose Bierce',
                description: 'Explore complex characterization and narrative truth',
                unit_template_id: '221',
                cb_anchor_tag: 'an-occurrence-at-owl-creek-bridge'
              }
            ]
          }
        ]
      },
      {
        title: 'Unit 2: Pivotal Words and Phrases',
        learning_cycles: [
          {
            activities: [
              {
                title: 'Sentence Combining: “Lottery” by Rasma Haidri',
                description: 'Explore personal essay and poetic revision',
                unit_template_id: '222',
                cb_anchor_tag: 'lottery'
              },
              {
                title: 'Sentence Combining: “The Fight” by John Montague',
                description: 'Explore poetic contrast and human truths',
                unit_template_id: '223',
                cb_anchor_tag: 'the-fight'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: “Tamara’s Opus” by Joshua Bennett',
                description: 'Explore spoken word and performative expression',
                unit_template_id: '224',
                cb_anchor_tag: 'tamaras-opus'
              },
              {
                title: 'Sentence Combining: “The Hamilton Mixtape” by Lin-Manuel Miranda',
                description: 'Explore the application of hip-hop storytelling to a historical figure',
                unit_template_id: '225',
                cb_anchor_tag: 'the-hamilton-mixtape'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: Excerpt from Romeo and Juliet by William Shakespeare',
                description: 'Explore dramatic characterization and Shakepearean turns of phrase',
                unit_template_id: '226',
                cb_anchor_tag: 'romeo-and-juliet'
              },
            ]
          }
        ]
      },
      {
        title: 'Unit 3: Compelling Evidence',
        learning_cycles: [
          {
            activities: [
              {
                title: 'Sentence Combining: “The Work You Do, the Person You Are” by Toni Morrison',
                description: 'Explore personal essay and economic disparities in differing views of work',
                unit_template_id: '227',
                cb_anchor_tag: 'the-work-you-do-the-person-you-are'
              },
              {
                title: 'Sentence Combining: “Drowning in Dishes, but Finding a Home” by Danial Adkison',
                description: 'Explore how seemingly menial work may lead to meaningful life lessons',
                unit_template_id: '228',
                cb_anchor_tag: 'drowning-in-dishes-but-finding-a-home'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: “What to Do with the Kids This Summer? Put ’Em to Work” by Ben Sasse',
                description: 'Explore opinion writing and how personal perspective shapes argument',
                unit_template_id: '229',
                cb_anchor_tag: 'what-to-do-with-kids-in-the-summer-put-em-to-work'
              },
              {
                title: 'Sentence Combining: “The Decline of the American Teenager’s Summer Job” by Lexington',
                description: 'Explore evolving perspectives of the summer job and its value to teens’ lives',
                unit_template_id: '230',
                cb_anchor_tag: 'the-decline-of-the-american-teenagers-summer-job'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: “Teenagers Have Stopped Getting Summer Jobs—Why?” by Derek Thompson',
                description: 'Explore multiple views of a controversial issue using data to inform perspectives',
                unit_template_id: '231',
                cb_anchor_tag: 'teenagers-have-stopped-getting-summer-jobs-why'
              },
            ]
          }
        ]
      },
      {
        title: 'Unit 4: Powerful Openings',
        learning_cycles: [
          {
            activities: [
              {
                title: 'Sentence Combining: Excerpt from 1984 by George Orwell',
                description: 'Explore how key imagery sets place and tone at the start of a novel',
                unit_template_id: '232',
                cb_anchor_tag: '1984'
              },
              {
                title: 'Sentence Combining: Excerpt from The Night Circus by Erin Morgenstern',
                description: 'Explore how second-person point of view sets up a fantastical world',
                unit_template_id: '233',
                cb_anchor_tag: 'the-night-circus'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: Excerpt from Out of My Mind by Sharon M. Draper',
                description: 'Explore how first-person point of view efficiently establishes a narrator’s experience',
                unit_template_id: '234',
                cb_anchor_tag: 'out-of-my-mind'
              },
              {
                title: 'Sentence Combining: Excerpt from All the Light We Cannot See by Anthony Doerr',
                description: 'Explore how omniscient point of view shines a light on multiple characters’ experiences of a threatening world',
                unit_template_id: '235',
                cb_anchor_tag: 'all-the-light-we-cannot-see'
              },
            ]
          },
          {
            activities: [
              {
                title: 'Sentence Combining: Excerpt from The Girl Who Fell from the Sky by Heidi W. Durrow',
                description: 'Explore how a present-tense narrative moment establishes a child’s perspective',
                unit_template_id: '236',
                cb_anchor_tag: 'the-girl-who-fell-from-the-sky'
              },
            ]
          }
        ]
      }
    ]
  end
end
