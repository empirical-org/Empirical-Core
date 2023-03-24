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
            img: 'team-christina-collins.webp'
          },
          {
            name: 'Daniel Drabik',
            title: 'Chief Technology Officer',
            img: 'team-daniel-drabik.webp'
          },
          {
            name: 'Peter Gault',
            title: 'Executive Director, Cofounder',
            img: 'team-peter-gault.webp'
          },
          {
            name: 'Sarah Kelly',
            title: 'Managing Director of Strategic Impact',
            img: 'team-sarah-kelly.webp'
          },
          {
            name: 'Lila Jane Mabe',
            title: 'Managing Director of Strategy & Impact',
            img: 'team-lila-jane-mabe.webp'
          },
          {
            name: 'Hannah Monk',
            title: 'Managing Director of Curriculum',
            img: 'team-hannah-monk.webp'
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
            img: 'team-eric-adams.webp'
          },
          {
            name: 'Devin Kawailani Barricklow',
            title: 'Senior Curriculum Developer',
            img: 'team-devin-barricklow.webp'
          },
          {
            name: 'Shannon Browne',
            title: 'Professional Learning Manager',
            img: 'team-shannon-browne.webp'
          },
          {
            name: 'Nattalie Dai',
            title: 'Partnerships Specialist I',
            img: 'team-nattalie-dai.webp'
          },
          {
            name: 'Rachel Dantzler',
            title: 'Senior Curriculum Developer',
            img: 'team-rachel-dantzler.webp'
          },
          {
            name: 'Ellie Dean',
            title: 'Finance & Operations Specialist II',
            img: 'team-ellie-dean.webp'
          },
          {
            name: 'Emilia Friedberg',
            title: 'Senior Software Engineer I',
            img: 'team-emilia-friedberg.webp'
          },
          {
            name: 'Peter Kong',
            title: 'Senior Software Engineer II',
            img: 'team-peter-kong.webp'
          },
          {
            name: 'Sherry Lewkowicz',
            title: 'Professional Learning Manager',
            img: 'team-sherry-lewkowicz.webp'
          },
          {
            name: 'Charlie Looper',
            title: 'Partnerships Specialist II',
            img: 'team-charlie-looper.webp'
          },
          {
            name: 'Stephanee McCadney',
            title: 'Curriculum Developer II',
            img: 'team-stephanee-mccadney.webp'
          },
          {
            name: 'Scarlet Melo',
            title: 'Partnerships Specialist II',
            img: 'team-scarlet-melo.webp'
          },
          {
            name: 'Katie Moylan',
            title: 'Curriculum Developer II',
            img: 'team-katie-moylan.webp'
          },
          {
            name: 'Alex Otstott',
            title: 'Director of District Partnerships',
            img: 'team-alex-otstott.webp'
          },
          {
            name: 'Erika Parker-Havens',
            title: 'Professional Learning Manager',
            img: 'team-erika-parker-havens.webp'
          },
          {
            name: 'Yves Peirsman',
            title: 'AI Open Source Partner',
            img: 'team-yves-peirsman.webp'
          },
          {
            name: 'Thomas Robertson',
            title: 'Senior Software Engineer II',
            img: 'team-thomas-robertson.webp'
          },
          {
            name: 'Peter Sharkey',
            title: 'Principal Product Manager',
            img: 'team-peter-sharkey.webp'
          },
          {
            name: 'Brendan Shean',
            title: 'Staff Software Engineer',
            img: 'team-brendan-shean.webp'
          },
          {
            name: 'Emma Volk',
            title: 'Lead Curriculum Developer',
            img: 'team-emma-volk.webp'
          },
          {
            name: 'Anna Waterman',
            title: 'Curriculum Developer II',
            img: 'team-anna-waterman.webp'
          },
          {
            name: 'Jack Yi',
            title: 'Staff Product Designer',
            img: 'team-jack-yi.webp'
          },
          {
            name: 'Cissy Yu',
            title: 'Software Engineer II',
            img: 'team-cissy-yu.webp'
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
            img: 'board-paul-walker.webp'
          },
          {
            name: 'Tony Sebro',
            title: 'General Counsel at Change.org',
            img: 'board-tony-sebro.webp'
          },
          {
            name: 'Peg Tyre',
            title: 'VP of Strategy at the Edwin Gould Foundation',
            img: 'board-peg-tyre.webp'
          },
          {
            name: 'Matthew Rodriguez',
            title: 'Trader at Millennium Management',
            img: 'board-matthew-rodriguez.webp'
          },
          {
            name: 'Stephanie Cohen',
            title: 'Co-Head of Consumer Wealth Management at Goldman',
            img: 'board-stephanie-cohen.webp'
          },
          {
            name: 'Ben Sussman',
            title: 'Engineer at Stripe',
            img: 'board-ben-sussman.webp'
          }
        ]
      },
      {
        team: 'Teacher Advisors',
        description_one: 'Quill works with an advisory council of more than 300 teachers from 42 states who advise us on the development of new tools. The following 13 teachers are some of the most active teachers who have contributed to the development of our learning tools.',
        description_two: 'Email us at advisorycouncil@quill.org if you’re a Quill educator who would like to join this group!',
        members: [
          {
            name: 'Carmen Adamucci',
            title: 'Saint Monica Preparatory',
            subtitle: 'Santa Monica, CA',
            img: 'advisor-carmen-adamucci@2x.png'
          },
          {
            name: 'Juan G. Alvarado',
            title: 'Valley View High School',
            subtitle: 'Hidalgo, TX',
            img: 'advisor-juan-alvarado@2x.png'
          },
          {
            name: 'Alesha Cary',
            title: 'Madison-Ridgeland Academy',
            subtitle: 'Madison, MS',
            img: 'advisor-alesha-cary@2x.png'
          },
          {
            name: 'Rebecca Foland',
            title: 'Waukee Public Schools',
            subtitle: 'Waukee, IA',
            img: 'advisor-rebecca-foland@2x.png'
          },
          {
            name: 'Audrey Gebber',
            title: 'Gulf Coast High School',
            subtitle: 'Naples, FL',
            img: 'advisor-audrey-gebber@2x.png'
          },
          {
            name: 'Deana M. Harris',
            title: 'Thorndale High School',
            subtitle: 'Thorndale, TX',
            img: 'advisor-deana-harris@2x.png'
          },
          {
            name: 'Jasmine Hobson Rodriguez',
            title: 'Hesperia High School',
            subtitle: 'Hesperia, CA',
            img: 'advisor-jasmine-hobson-rodriguez@2x.png'
          },
          {
            name: 'Jennifer James',
            title: 'Vinemont High School',
            subtitle: 'Vinemont, AL',
            img: 'advisor-jennifer-james@2x.png'
          },
          {
            name: 'Meleighsa McLaughlin',
            title: 'James Clemens High School',
            subtitle: 'Madison, AL',
            img: 'advisor-meleighsa-mclaughlin@2x.png'
          },
          {
            name: 'Sera Ramirez',
            title: 'Fort Stockton High School',
            subtitle: 'Fort Stockton, TX',
            img: 'advisor-sera-ramirez@2x.png'
          },
          {
            name: 'Elma Ruiz',
            title: 'Port Isabel Junior High',
            subtitle: 'Port Isabel, TX',
            img: 'advisor-elma-ruiz@2x.png'
          },
          {
            name: 'Elizabeth Tanner',
            title: 'Westwood High School',
            subtitle: 'Mesa, AZ',
            img: 'advisor-elizabeth-tanner@2x.png'
          },
          {
            name: 'Megan Tourda-Nelsen',
            title: 'Bay City Central High School',
            subtitle: 'Bay City, MI',
            img: 'advisor-megan-tourda-nelsen@2x.png'
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
