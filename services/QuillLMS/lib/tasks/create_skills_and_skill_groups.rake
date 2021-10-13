namespace :skills_and_skill_groups do
  task :create => :environment do
    create_skills_and_skill_groups
  end

  def create_skills_and_skill_groups
    starter_diagnostic = Activity.find(1663)
    intermediate_diagnostic = Activity.find(1668)
    advanced_diagnostic = Activity.find(1678)

    create_data(starter_diagnostic_skill_groups, [starter_diagnostic.id, starter_diagnostic.follow_up_activity_id])
    create_data(intermediate_diagnostic_skill_groups, [intermediate_diagnostic.id, intermediate_diagnostic.follow_up_activity_id])
    create_data(advanced_diagnostic_skill_groups, [advanced_diagnostic.id, advanced_diagnostic.follow_up_activity_id])
  end

  def create_data(skill_group_data, activity_ids)
    skill_group_data.map do |sg|
      skill_group = SkillGroup.create({ name: sg[:name], order_number: sg[:order_number] })
      activity_ids.each do |id|
        SkillGroupActivity.create(activity_id: id, skill_group: skill_group)
      end
      sg[:skills].each do |s|
        skill = Skill.create(name: s[:name], skill_group: skill_group)
        s[:concepts].each do |concept|
          SkillConcept.create({skill: skill, concept: Concept.find_by_uid(concept[:uid])})
        end
      end
      skill_group
    end
  end

  def starter_diagnostic_skill_groups
    [
      {
        name: 'Capitalization',
        order_number: 0,
        skills: [
          {
            name: 'Capitalization',
            concepts: [
              { uid: '66upe3S5uvqxuHoHOt4PcQ' }
            ]
          }
        ]
      },
      {
        name: 'Plural and Possessive Nouns',
        order_number: 1,
        skills: [
          {
            name: 'Plural vs. Possessive Nouns',
            concepts: [
              { uid: 'juG67j5ILKeg8ZX0Dh2m7A' }
            ]
          }
        ]
      },
      {
        name: 'Adjectives and Adverbs',
        order_number: 2,
        skills: [
          {
            name: 'Adverbs of Manner',
            concepts: [
              { uid: 'GZ04vHSTxWUTzhWMGfwcUQ' }
            ]
          },
          {
            name: 'Single Adjectives',
            concepts: [
              { uid: 'o1yvrCpaYu0r-jqogv7PBw' }
            ]
          },
          {
            name: 'Comparative Adjectives',
            concepts: [
              { uid: 'w8VxA2FWlU4FQegvjhsCUg' }
            ]
          },
          {
            name: 'Coordinate Adjectives',
            concepts: [
              { uid: 'tN84RPXWJwYBUh-LJn7xRA' }
            ]
          },
          {
            name: 'Cumulative Adjectives',
            concepts: [
              { uid: 'd8NFd0PZo6OUHUeZQH2l0g' }
            ]
          },
          {
            name: 'Adjectives and Adverbs',
            concepts: [
              { uid: '4wQ6Y5gMxIPPz4zxyBbJ3g' }
            ]
          },
        ]
      },
      {
        name: 'Prepositional Phrases',
        order_number: 3,
        skills: [
          {
            name: 'Subject-Verb Agreement',
            concepts: [
              { uid: 'Tlhrx6Igxn6cR_SD1U5efA' }
            ]
          },
          {
            name: 'Prepositional Phrases',
            concepts: [
              { uid: 'LfBI4QYX_T5zbZAd-x_g_w' }
            ]
          },
          {
            name: 'Adjectives, Adverbs, & Prepositional Phrases',
            concepts: [
              { uid: 'Nr6JagF_t8pZzVxtVkYO3w' }
            ]
          }
        ]
      },
      {
        name: 'Compound Subjects, Objects, and Predicates',
        order_number: 4,
        skills: [
          {
            name: 'Subject-Verb Agreement',
            concepts: [
              { uid: 'Tlhrx6Igxn6cR_SD1U5efA' }
            ]
          },
          {
            name: 'Listing Objects',
            concepts: [
              { uid: 'CoGBwDItjaRB0sxdpom9ww' }
            ]
          },
          {
            name: 'Compound Subjects',
            concepts: [
              { uid: 'Jl4ByYtUfo4VhIKpMt23yA' }
            ]
          },
          {
            name: 'Compound Predicates',
            concepts: [
              { uid: 'asfdGCdbTy6l8xTe-_p6Qg' }
            ]
          },
        ]
      },
      {
        name: 'Commonly Confused Words',
        order_number: 5,
        skills: [
          {
            name: 'Commonly Confused Words',
            concepts: [
              { uid: 'qysSExy2sSTKTLwmLwHKaw' }
            ]
          }
        ]
      }
    ]
  end

  def intermediate_diagnostic_skill_groups
    [
      {
        name: 'Compound Subjects, Objects, and Predicates',
        order_number: 0,
        skills: [
          {
            name: 'Compound Predicates',
            concepts: [
              { uid: 'asfdGCdbTy6l8xTe-_p6Qg' }
            ]
          },
          {
            name: 'Compound Subjects',
            concepts: [
              { uid: 'Jl4ByYtUfo4VhIKpMt23yA' }
            ]
          }
        ]
      },
      {
        name: 'Compound Sentences',
        order_number: 1,
        skills: [
          {
            name: 'Compound Sentences',
            concepts: [
              { uid: '8Bzwt0RLr4-IG1L4YxsGZA' }
            ]
          }
        ]
      },
      {
        name: 'Complex Sentences',
        order_number: 2,
        skills: [
          {
            name: 'Complex Sentences',
            concepts: [
              { uid: 'bZmNou1vg97xYkCKG6sfTg' }
            ]
          }
        ]
      },
      {
        name: 'Conjunctive Adverbs',
        order_number: 3,
        skills: [
          {
            name: 'Conjunctive Adverbs',
            concepts: [
              { uid: 'OVXt5ljhdLSvdpszm4JEAg' }
            ]
          }
        ]
      },
      {
        name: 'Parallel Structure',
        order_number: 4,
        skills: [
          {
            name: 'Parallel Structure',
            concepts: [
              { uid: '1ohLyApTz7lZ3JszrA98Xg' }
            ]
          }
        ]
      },
      {
        name: 'Capitalization',
        order_number: 5,
        skills: [
          {
            name: 'Capitalization',
            concepts: [
              { uid: '66upe3S5uvqxuHoHOt4PcQ' }
            ]
          }
        ]
      },
      {
        name: 'Subject-Verb Agreement',
        order_number: 6,
        skills: [
          {
            name: 'Subject-Verb Agreement',
            concepts: [
              { uid: 'Tlhrx6Igxn6cR_SD1U5efA' }
            ]
          }
        ]
      },
      {
        name: 'Nouns, Pronouns, and Verbs',
        order_number: 6,
        skills: [
          {
            name: 'Perfect-Tense Verbs',
            concepts: [
              { uid: 'TE-ElKaRWWumTrmVE4-m6g' },
              { uid: 'I5Si4ZxILjjDR077WgSZ6w' },
              { uid: 'iEOHhIPh8PADjzf8vf0Y6Q' }
            ]
          },
          {
            name: 'Plural Possessive Nouns',
            concepts: [
              { uid: 'uYwGHRRUNwzvGtFT-64KHQ'}
            ]
          },
          {
            name: 'Pronouns in Compound Subjects and Objects',
            concepts: [
              { uid: '1RGKsB6bPviCtNi0Y7rL9A' },
              { uid: 'z8rrV2Rz9EE6al0qW3Ni2g' },
            ]
          }
        ]
      }
    ]
  end

  def advanced_diagnostic_skill_groups
    [
      {
        name: 'Compound-Complex Sentences',
        order_number: 0,
        skills: [
          {
            name: 'Compound-Complex Sentences',
            concepts: [
              { uid: 'asfdGCdbTy6l8xTe-_p6Qg' }
            ]
          }
        ]
      },
      {
        name: 'Appositive Phrases',
        order_number: 1,
        skills: [
          {
            name: 'Appositive Phrases',
            concepts: [
              { uid: '8Bzwt0RLr4-IG1L4YxsGZA' }
            ]
          },
          {
            name: 'Modifying Phrases',
            concepts: [
              { uid: '8Bzwt0RLr4-IG1L4YxsGZA' }
            ]
          }
        ]
      },
      {
        name: 'Relative Clauses',
        order_number: 2,
        skills: [
          {
            name: 'Relative Clausess',
            concepts: [
              { uid: 'bZmNou1vg97xYkCKG6sfTg' }
            ]
          }
        ]
      },
      {
        name: 'Participal Phrases',
        order_number: 3,
        skills: [
          {
            name: 'Participial Phrases',
            concepts: [
              { uid: 'OVXt5ljhdLSvdpszm4JEAg' }
            ]
          },
          {
            name: 'Modifying Phrases',
            concepts: [
              { uid: 'OVXt5ljhdLSvdpszm4JEAg' }
            ]
          }
        ]
      },
      {
        name: 'Parallel Structure',
        order_number: 4,
        skills: [
          {
            name: 'Parallel Structure',
            concepts: [
              { uid: '1ohLyApTz7lZ3JszrA98Xg' }
            ]
          }
        ]
      },
      {
        name: 'Advanced Combining',
        order_number: 5,
        skills: [
          {
            name: 'Advanced Sentence Combining',
            concepts: [
              { uid: '66upe3S5uvqxuHoHOt4PcQ' }
            ]
          }
        ]
      },
      {
        name: 'Subject-Verb Agreement',
        order_number: 6,
        skills: [
          {
            name: 'Subject-Verb Agreement',
            concepts: [
              { uid: 'Tlhrx6Igxn6cR_SD1U5efA' }
            ]
          }
        ]
      },
      {
        name: 'Nouns, Pronouns, and Verbs',
        order_number: 6,
        skills: [
          {
            name: 'Perfect-Tense Verbs',
            concepts: [
              { uid: 'TE-ElKaRWWumTrmVE4-m6g' },
              { uid: 'I5Si4ZxILjjDR077WgSZ6w' },
              { uid: 'iEOHhIPh8PADjzf8vf0Y6Q' }
            ]
          },
          {
            name: 'Plural Possessive Nouns',
            concepts: [
              { uid: 'uYwGHRRUNwzvGtFT-64KHQ'}
            ]
          },
          {
            name: 'Pronouns in Compound Subjects and Objects',
            concepts: [
              { uid: '1RGKsB6bPviCtNi0Y7rL9A' },
              { uid: 'z8rrV2Rz9EE6al0qW3Ni2g' },
            ]
          }
        ]
      }
    ]
  end

end
