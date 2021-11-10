namespace :skills_and_skill_groups_part_two do
  task :create => :environment do
    create_skills_and_skill_groups
  end

  def create_skills_and_skill_groups
    pre_ap1 = Activity.find(1229)
    pre_ap2 = Activity.find(1230)
    springboard = Activity.find(1432)
    ap = Activity.find(992)
    ell_starter = Activity.find(1161)
    ell_intermediate = Activity.find(1568)
    ell_advanced = Activity.find(1590)

    create_data(pre_ap1_skill_groups, [pre_ap1.id])
    create_data(pre_ap2_skill_groups, [pre_ap2.id])
    create_data(springboard_skill_groups, [springboard.id])
    create_data(ap_skill_groups, [ap.id])
    create_data(ell_starter_skill_groups, [ell_starter.id])
    create_data(ell_intermediate_skill_groups, [ell_intermediate.id])
    create_data(ell_advanced_skill_groups, [ell_advanced.id])
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

  def pre_ap1_skill_groups
    [
      {
        name: 'Subject-Verb Agreement',
        order_number: 0,
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
        name: 'Pronoun Antecedent Agreement',
        order_number: 1,
        skills: [
          {
            name: 'Pronoun Antecedent Agreement',
            concepts: [
              { uid: 'YATBRKnhclPuz3962a17Og' }
            ]
          }
        ]
      },
      {
        name: 'Compound Subjects, Objects, and Predicates',
        order_number: 2,
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
        order_number: 3,
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
        order_number: 4,
        skills: [
          {
            name: 'Complex Sentences',
            concepts: [
              { uid: 'bZmNou1vg97xYkCKG6sfTg' }
            ]
          }
        ]
      }
    ]
  end

  def pre_ap2_skill_groups
    [
      {
        name: 'Conjunctive Adverbs',
        order_number: 0,
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
        name: 'Appositive Phrases',
        order_number: 1,
        skills: [
          {
            name: 'Appositive Phrases',
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
      }
    ]
  end

  def springboard_skill_groups
    [
      {
        name: 'Compound Subjects, Objects, and Predicates',
        order_number: 4,
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
          },
          {
            name: 'Subject-Verb Agreement',
            concepts: [
              { uid: 'Tlhrx6Igxn6cR_SD1U5efA' }
            ]
          },
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
        name: 'Prepositional Phrases',
        order_number: 3,
        skills: [
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
        name: 'Verb Tense and Agreement',
        order_number: 4,
        skills: [
          {
            name: "Perfect Tense Verbs",
            concepts: [
              { uid: 'TE-ElKaRWWumTrmVE4-m6g' },
              { uid: 'I5Si4ZxILjjDR077WgSZ6w' },
              { uid: 'iEOHhIPh8PADjzf8vf0Y6Q' }
            ]
          },
          {
            name: 'Subject-Verb Agreement',
            concepts: [
              { uid: 'Tlhrx6Igxn6cR_SD1U5efA' }
            ]
          }
        ]
      },
      {
        name: 'Pronoun Case and Agreement',
        order_number: 5,
        skills: [
          {
            name: 'Pronouns in Compound Objects',
            concepts: [
              { uid: 'z8rrV2Rz9EE6al0qW3Ni2g' }
            ]
          },
          {
            name: 'Pronouns in Compound Subjects',
            concepts: [
              { uid: '1RGKsB6bPviCtNi0Y7rL9A' }
            ]
          },
          {
            name: 'Pronoun-Antecedent Agreement',
            concepts: [
              { uid: 'YATBRKnhclPuz3962a17Og' }
            ]
          }
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

  def ap_skill_groups
    [
      {
        name: 'Complex Sentences',
        order_number: 0,
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
        name: 'Relative Clauses',
        order_number: 1,
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
        name: 'Appositive Phrases',
        order_number: 1,
        skills: [
          {
            name: 'Appositive Phrases',
            concepts: [
              { uid: '8Bzwt0RLr4-IG1L4YxsGZA' }
            ]
          }
        ]
      },
      {
        name: 'Participal Phrases',
        order_number: 2,
        skills: [
          {
            name: 'Participial Phrases',
            concepts: [
              { uid: 'cmU9O9n6QYdxq3XfPmbOQQ' },
              { uid: 'cq-tMtMyIGhwOsmdkfrjWQ' },
              { uid: 'My0PBSzHRgjtXMfgeGPZ4w' },
              { uid: '-0kcxL-eAP89oLWwMVlUUA' },
              { uid: 'GLjAExmqZShBTZ7DQGvVLw' },
              { uid: 'OVXt5ljhdLSvdpszm4JEAg' }
            ]
          },
        ]
      },
      {
        name: 'Parallel Structure',
        order_number: 3,
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
        name: 'Compound-Complex Sentences',
        order_number: 4,
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
      }
    ]
  end

  def ell_starter_skill_groups
    [
      {
        name: 'Sentences with To Be',
        order_number: 0,
        skills: [
          {
            name: 'Conjugating To Be',
            concepts: [
              { uid: 'kn1TUdSflkt4FSvazx0uug' }
            ]
          },
          {
            name: 'Using Not',
            concepts: [
              { uid: 'qsyU0Art7m17ozbvLhThJg' }
            ]
          },
          {
            name: 'A, An, and The',
            concepts: [
              { uid: 'PzMesGC_8yILSHMlu5GnFA' },
              { uid: 'Using A & An Before a Noun' },
              { uid: '1wVRalQ9nSFCbJH58Jab_g' }
            ]
          },
          {
            name: 'Adjectives',
            concepts: [
              { uid: 'Simple Adjective Sentences' },
              { uid: 'o1yvrCpaYu0r-jqogv7PBw' }
            ]
          }
        ]
      },
      {
        name: 'Sentences With Have',
        order_number: 1,
        skills: [
          {
            name: 'Conjugating To Have',
            concepts: [
              { uid: '1IBl9Gea7bfxreyKCaRUsg' }
            ]
          }
        ]
      },
      {
        name: 'Sentences With Want',
        order_number: 2,
        skills: [
          {
            name: 'Conjugating To Want',
            concepts: [
              { uid: 'rrUdGcMNlK3A0yploAj-Yg' }
            ]
          }
        ]
      },
      {
        name: 'Listing Adjectives and Nouns',
        order_number: 3,
        skills: [
          {
            name: 'Compound Objects',
            concepts: [
              { uid: 'QNkNRs8zbCXU7nLBeo4mgA' }
            ]
          },
          {
            name: 'Listing Objects',
            concepts: [
              { uid: 'CoGBwDItjaRB0sxdpom9ww' }
            ]
          },
          {
            name: 'Coordinate Adjectives',
            concepts: [
              { uid: 'YTqU-93WN2w8cU6WdSDy4w' }
            ]
          },
        ]
      },
      {
        name: 'Writing Questions',
        order_number: 4,
        skills: [
          {
            name: 'Yes or No Questions',
            concepts: [
              { uid: 'QU-OAJfxDUzRnlpIl9mKRA' }
            ]
          }
        ]
      }
    ]
  end

  def ell_intermediate_skill_groups
    [
      {
        name: 'Subject-Verb Agreement',
        order_number: 0,
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
        name: 'Possessive Nouns and Pronouns',
        order_number: 1,
        skills: [
          {
            name: 'Possessive Pronouns',
            concepts: [
              { uid: 'rmEM8FefHInj_EHfdGb-mQ'}
            ]
          },
          {
            name: 'Singular Possessive Nouns',
            concepts: [
              { uid: 'nAcT-C3UfPFuhWcf0JJNMw'}
            ]
          }
        ]
      },
      {
        name: 'Prepositions',
        order_number: 2,
        skills: [
          {
            name: 'In (Time)',
            concepts: [
              { uid: 'lD5FBHF-FEPpsFG0SXlcfQ'}
            ]
          },
          {
            name: 'On (Time)',
            concepts: [
              { uid: 'SpNQAzc2JL48JJ2KnfhUjA'}
            ]
          },
          {
            name: 'At (Time)',
            concepts: [
              { uid: 'OHlY0IZhsT6Usvg9lBYJFg'}
            ]
          },
          {
            name: 'In (Place)',
            concepts: [
              { uid: 'FZ0wa0oqQ-6ELHf1gzVJjw'}
            ]
          },
          {
            name: 'On (Place)',
            concepts: [
              { uid: 'wpzl6e2NhXcBaKDC11K4NA'}
            ]
          },
          {
            name: 'At (Place)',
            concepts: [
              { uid: 'LPMBB_M5hooC263qXFc_Yg'}
            ]
          },
          {
            name: 'For',
            concepts: [
              { uid: 'peVXhSMPeMWPIui5uYyuUg'}
            ]
          },
          {
            name: 'To',
            concepts: [
              { uid: 'iY2_MBNxcVgzH3xmnyeEJA'}
            ]
          },
        ]
      },
      {
        name: 'Future Tense',
        skills: [
          {
            name: 'Future Tense',
            concepts: [
              { uid: 'RPNqOZuka_n8RESKbBF8OQ' }
            ]
          }
        ]
      },
      {
        name: 'Articles',
        skills: [
          {
            name: 'A, An, and The',
            concepts: [
              { uid: 'fJXVAoYCC8S9kByua0kXXA' }
            ]
          }
        ]
      },
      {
        name: 'Writing Questions',
        skills: [
          {
            name: 'Questions With Who',
            concepts: [
              { uid: 'mYIxpj1zn8cbg8eXLA' }
            ]
          },
          {
            name: 'Questions With Where',
            concepts: [
              { uid: 'D7j-ZW4maL243aHIKoNp6Q' }
            ]
          },
          {
            name: 'Questions With What',
            concepts: [
              { uid: 'wjeafaJMBZuCep0ypZrm_Q' }
            ]
          },
          {
            name: 'Questions With Can',
            concepts: [
              { uid: 'GOvX5kYq96vpQa39BHy8ow' }
            ]
          },
        ]
      }
    ]
  end

  def ell_advanced_skill_groups
    [
      {
        name: 'Regular Past Tense',
        order_number: 0,
        skills: [
          {
            name: 'Past Tense Verbs',
            concepts: [
              { uid: 'SRqIUoMz4hlWeu-Ip4CyCw' }
            ]
          },
          {
            name: 'Past Tense Verbs Ending in Y',
            concepts: [
              { uid: 'Km0ooHwuyrvSJ1hN4Rse7w' }
            ]
          },
          {
            name: 'Past Tense with Double Consonants',
            concepts: [
              { uid: 'WxkPgfLvkJuStQMEK-8kag' }
            ]
          },
        ]
      },
      {
        name: 'Irregular Past Tense',
        order_number: 1,
        skills: [
          {
            name: 'To Be',
            concepts: [
              { uid: 'vnis5YBzm7mM_TYl3DqhTw' }
            ]
          },
          {
            name: 'Thought',
            concepts: [
              { uid: 'pBzbX6kVGDeH10w0-cfMYA' }
            ]
          },
          {
            name: 'Did',
            concepts: [
              { uid: 'cxWLOrXgWsAa170V_KpZWA' }
            ]
          },
          {
            name: 'Said',
            concepts: [
              { uid: '6U5JokUpWIjHVOn5Zt2lmw' }
            ]
          },
          {
            name: 'Ate',
            concepts: [
              { uid: 'q_KB-ppr6rFvTwrSMClssA' }
            ]
          },
          {
            name: 'Took',
            concepts: [
              { uid: 'Z3p7YViQ0lR_h0GSLJ2KWA' }
            ]
          },
          {
            name: 'Went',
            concepts: [
              { uid: 'ciSBEpZ8TZyo7NOei5tWqw' }
            ]
          },
        ]
      },
      {
        name: 'Progressive Tense',
        order_number: 2,
        skills: [
          {
            name: 'Present Progressive',
            concepts: [
              { uid: 'TPm4a19NUn2RlKLCbPbVUw' }
            ]
          },
          {
            name: 'Past Progressive',
            concepts: [
              { uid: 'YeioybAcmeBNsp3KRb9aow' }
            ]
          },
          {
            name: 'Future Progressive',
            concepts: [
              { uid: '9ZPpieSHhlMYQkEvrhQP1w' }
            ]
          },
        ]
      },
      {
        name: 'Phrasal Verbs',
        order_number: 3,
        skills: [
          {
            name: 'Inseparable Phrasal Verbs',
            concepts: [
              { uid: 'c0ktITH11dqQBUB5YDgPyg' }
            ]
          },
          {
            name: 'Separable Phrasal Verbs',
            concepts: [
              { uid: '5n3GrYgR4P-MSFKylELFdw' }
            ]
          }
        ]
      },
      {
        name: 'ELL-Specific Skills',
        order_number: 4,
        skills: [
          {
            name: 'Say, Tell, Talk, and Ask',
            concepts: [
              { uid: 'eGPSFeqZ5A8lv-X9-SlkEg' },
              { uid: 'A11LmzShv6e0QjIf7Xgzfg' }
            ]
          },
          {
            name: 'Really and Very',
            concepts: [
              { uid: 'QZ18OqDYWMo0fWWmuuhPKQ' }
            ]
          },
          {
            name: 'Responding to Questions',
            concepts: [
              { uid: 'OGJKK4c56ushPxI2Vt8P8A' }
            ]
          },
          {
            name: 'Toward',
            concepts: [
              { uid: 'r-1khxZLyAHvAXaWRsi3nw' }
            ]
          },
          {
            name: 'After',
            concepts: [
              { uid: 'kg4OpNz9IoUPqx7rIxYN8g' }
            ]
          }
        ]
      }
    ]
  end

end
