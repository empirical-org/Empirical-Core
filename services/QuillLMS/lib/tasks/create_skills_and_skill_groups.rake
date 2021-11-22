namespace :skills_and_skill_groups do
  task :create => :environment do
    create_skills_and_skill_groups
  end

  task :destroy_all => :environment do
    destroy_all_skill_and_skill_group_data
  end

  def destroy_all_skill_and_skill_group_data
    ActiveRecord::Base.transaction do
      SkillConcept.all.each { |sc| sc.destroy }
      Skill.all.each { |s| s.destroy }
      SkillGroupActivity.all.each { |sga| sga.destroy }
      SkillGroup.all.each { |sg| sg.destroy }
    end
  end

  def create_skills_and_skill_groups
    ActiveRecord::Base.transaction do
      starter_diagnostic = Activity.find(1663)
      intermediate_diagnostic = Activity.find(1668)
      advanced_diagnostic = Activity.find(1678)
      pre_ap1 = Activity.find(1229)
      pre_ap2 = Activity.find(1230)
      springboard = Activity.find(1432)
      ap = Activity.find(992)
      ell_starter = Activity.find(1161)
      ell_intermediate = Activity.find(1568)
      ell_advanced = Activity.find(1590)

      create_data(starter_diagnostic_skill_groups, [starter_diagnostic.id, starter_diagnostic.follow_up_activity_id])
      create_data(intermediate_diagnostic_skill_groups, [intermediate_diagnostic.id, intermediate_diagnostic.follow_up_activity_id])
      create_data(advanced_diagnostic_skill_groups, [advanced_diagnostic.id, advanced_diagnostic.follow_up_activity_id])
      create_data(pre_ap1_skill_groups, [pre_ap1.id])
      create_data(pre_ap2_skill_groups, [pre_ap2.id])
      create_data(springboard_skill_groups, [springboard.id])
      create_data(ap_skill_groups, [ap.id])
      create_data(ell_starter_skill_groups, [ell_starter.id])
      create_data(ell_intermediate_skill_groups, [ell_intermediate.id])
      create_data(ell_advanced_skill_groups, [ell_advanced.id])
    end
  end

  def create_data(skill_group_data, activity_ids)
    skill_group_data.map do |sg|
      skill_group = SkillGroup.create({ name: sg[:name], order_number: sg[:order_number], description: sg[:description] })
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
        description: 'Students who show proficiency in this skill will use capitalization at the beginning of a sentence and correct capitalization of names, dates, holidays, geographic locations, and the pronoun "I."',
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
        description: 'Students who show proficiency in this skill will make the correct choice between a plural and possessive noun. For possessive nouns, we require correct apostrophe placement.',
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
        description: 'Students who show proficiency in this skill will correctly place single adjectives, adverbs, cumulative adjectives, coordinate adjectives, and adjectives and adverbs together. Students will also make the correct choice between a comparative and superlative adjective and correctly order cumulative adjectives. Students will correctly punctuate by placing a comma between two coordinate adjectives.',
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
          }
        ]
      },
      {
        name: 'Prepositional Phrases',
        order_number: 3,
        description: 'Students who show proficiency in this skill will correctly place a prepositional phrase, agree the subject to the verb with a prepositional phrase, and correctly place adjectives, adverbs, and prepositional phrases together.',
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
        description: 'Students who show proficiency in this skill will correctly form compound subjects and objects, agree the subject to the verb with a compound subject, and use correct punctuation when listing objects.',
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
          }
        ]
      },
      {
        name: 'Commonly Confused Words',
        order_number: 5,
        description: "Students who show proficiency in this skill will make the correct choice between the commonly confused words <i>your</i> and <i>you're</i>, and <i>their</i>, <i>they're</i>, and <i>there</i>.",
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
        description: 'Students who show proficiency in this skill group will correctly form compound subjects, objects, and predicates, and will use correct punctuation when forming these structures.',
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
        description: 'Students who show proficiency in this skill group will choose a coordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. Students will correctly punctuate by using a comma before the coordinating conjunction.',
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
        description: 'Students who show proficiency in this skill group will choose a subordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. The subordinating conjunction can come at the beginning of the sentence or in the middle, but students will use correct punctuation based on its placement.',
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
        description: 'Students who show proficiency in this skill group will choose a conjunctive adverb that demonstrates a correct logical relationship between ideas, with ideas in the correct order. Students can write one sentence or two, but correct punctuation is required based on the placement of the conjunctive adverb.',
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
        description: 'Students who show proficiency in this skill will write a sentence with all of the verbs in the same form—students can use any verb tense they like as long as all three verbs agree. Answers using coordinating conjunctions, repeated words, or phrases like also and too are accepted as long as all three verbs agree.',
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
        description: 'Students who show proficiency in this skill will use capitalization at the beginning of a sentence as well as correct capitalization of proper nouns, titles, and geographic locations.',
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
        description: 'Students who show proficiency in this skill will correctly agree the subject to the verb.',
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
        order_number: 7,
        description: 'Students who show proficiency in this skill will make the correct choice between irregular past, past perfect, and present perfect tenses. Students will also correctly place an apostrophe with a plural possessive noun and choose the correct pronoun in compound subjects and objects.',
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
              { uid: 'z8rrV2Rz9EE6al0qW3Ni2g' }
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
        description: 'Students who show proficiency in this skill will correctly use and place both a coordinating and subordinating conjunction. Students will choose conjunctions that demonstrate a correct logical relationship between ideas, with ideas in the correct order. Both the subordinating and coordinating conjunctions must be correctly punctuated based on their placement.',
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
        description: 'Students who show proficiency in this skill will choose the correct phrase to add description to a noun. Students will place the appositive phrase correctly, in the middle of the sentence, and punctuate it correctly by adding commas before and after the appositive phrase.',
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
        description: 'Students who show proficiency in this skill will choose the correct relative pronoun to add description to a noun. Students will place the relative clause correctly so that it adds necessary description to the noun it is describing. They will also punctuate it correctly.',
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
        description: 'Students who show proficiency in this skill will form a participial phrase from a kernel sentence and add it as description to a noun. Students will place it in the correct place—either at the beginning, middle, or end of the sentence—and punctuate it correctly based on its placement.',
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
        description: 'Students who show proficiency in this skill will write a sentence in which all of the verbs are in the same form. Students can use words like and or also as long as all of the verbs in the sentence are in the same form.',
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
        description: 'There are many ways for students to show proficiency in this skill. Depending on the prompt, students can form a compound, complex, or compound-complex sentence. When appropriate, they can use semicolons, relative clauses, appositives phrases, conjunctive adverbs, participial phrases, prepositional phrases, and compound predicates. Correct punctuation is required for all of these structures.',
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

  def pre_ap1_skill_groups
    [
      {
        name: 'Subject-Verb Agreement',
        order_number: 0,
        description: 'Students who show proficiency in this skill will correctly agree the subject to the verb.',
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
        description: 'Students who show proficiency in this skill will correctly agree a pronoun to its antecedent, including with indefinite pronouns like <i>each</i>.',
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
        description: 'Students who show proficiency in this skill group will correctly form compound subjects, objects, and predicates, and will use correct punctuation when forming these structures.',
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
        description: 'Students who show proficiency in this skill group will choose a coordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. Students will correctly punctuate by using a comma before the coordinating conjunction.',
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
        description: 'Students who show proficiency in this skill group will choose a subordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. The subordinating conjunction can come at the beginning of the sentence or in the middle, but students will use correct punctuation based on its placement.',
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
        description: 'Students who show proficiency in this skill group will choose a conjunctive adverb that demonstrates a correct logical relationship between ideas, with ideas in the correct order. Students can write one sentence or two, but correct punctuation is required based on the placement of the conjunctive adverb.',
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
        description: 'Students who show proficiency in this skill will choose the correct phrase to add description to a noun. Students will place the appositive phrase correctly, in the middle of the sentence, and punctuate it correctly by adding commas before and after the appositive phrase.',
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
        description: 'Students who show proficiency in this skill will choose the correct relative pronoun to add description to a noun. Students will place the relative clause correctly so that it adds necessary description to the noun it is describing. They will also punctuate it correctly.',
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
        description: 'Students who show proficiency in this skill will form a participial phrase from a kernel sentence and add it as description to a noun. Students will place it in the correct place—either at the beginning, middle, or end of the sentence—and punctuate it correctly based on its placement.',
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
        description: 'Students who show proficiency in this skill will write a sentence in which all of the verbs are in the same form. Students will do this by listing either subjects or predicates and punctuating them correctly. They can use words like and or also as long as all of the verbs in the sentence are in the same form and the list in the sentence is correctly punctuated.',
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
        description: 'Students who show proficiency in this skill group will correctly form compound subjects, objects, and predicates, and will use correct punctuation when forming these structures. Students will also use correct subject-verb agreement when combining two singular subjects into a compound subject.',
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
          }
        ]
      },
      {
        name: 'Compound Sentences',
        order_number: 1,
        description: 'Students who show proficiency in this skill group will choose a coordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. Students will correctly punctuate by using a comma before the coordinating conjunction.',
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
        description: 'Students who show proficiency in this skill group will choose a subordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. The subordinating conjunction can come at the beginning of the sentence or in the middle, but students will use correct punctuation based on its placement.',
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
        description: 'Students who show proficiency in this skill will correctly place a prepositional phrase, agree the subject to the verb with a prepositional phrase, and correctly place adjectives, adverbs, and prepositional phrases together.',
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
        description: 'Students who show proficiency in this skill will make the correct choice between irregular past, past perfect, and present perfect verb tenses. Students will also correctly agree the subject to the verb.',
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
        description: 'Students who show proficiency in this skill will correctly agree a pronoun to its antecedent and choose the correct pronoun in compound subjects and objects.',
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
        description: 'Students who show proficiency in this skill will make the correct choice between the commonly confused words <i>your</i> and <i>you\'re</i>, and <i>their</i>, <i>they\'re</i>, and <i>there</i>.',
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
        description: 'Students who show proficiency in this skill group will choose a subordinating conjunction that demonstrates a correct logical relationship between ideas, with ideas in the correct order. The subordinating conjunction can come at the beginning of the sentence or in the middle, but students will use correct punctuation based on its placement.',
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
        description: 'Students who show proficiency in this skill will choose the correct relative pronoun to add description to a noun. Students will place the relative clause correctly so that it adds necessary description to the noun it is describing. They will also punctuate it correctly.',
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
        description: 'Students who show proficiency in this skill will choose the correct phrase to add description to a noun. Students will place the appositive phrase correctly, in the middle of the sentence, and punctuate it correctly by adding commas before and after the appositive phrase.',
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
        description: 'Students who show proficiency in this skill will form a participial phrase from a kernel sentence and add it as description to a noun. Students will place it in the correct place—either at the beginning, middle, or end of the sentence—and punctuate it correctly based on its placement.',
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
          }
        ]
      },
      {
        name: 'Parallel Structure',
        order_number: 3,
        description: 'Students who show proficiency in this skill will write a sentence in which all of the verbs are in the same form. Students can use words like <i>and</i> or <i>also</i> as long as all of the verbs in the sentence are in the same form.',
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
        description: 'Students who show proficiency in this skill will correctly use and place both a coordinating and subordinating conjunction. Students will choose conjunctions that demonstrate a correct logical relationship between ideas, with ideas in the correct order. Both the subordinating and coordinating conjunctions must be correctly punctuated based on their placement.',
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
        description: 'There are many ways for students to show proficiency in this skill. Depending on the prompt, students can form a compound, complex, or compound-complex sentence. When appropriate, they can use semicolons, relative clauses, appositives phrases, conjunctive adverbs, participial phrases, prepositional phrases, and compound predicates. Correct punctuation is required for all of these structures.',
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
        description: 'Students who show proficiency in this skill will be able to write sentences with the verb <i>to be</i> that include nouns at the beginning of a sentence, the correct articles when appropriate, and adjectives in the correct place. Students will also be able to write <i>to be</i> sentences with negation.',
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
        description: 'Students who show proficiency in this skill will correctly conjugate the verb <i>to have</i>.',
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
        description: 'Students who show proficiency in this skill will correctly conjugate the verb <i>to want</i>.',
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
        description: 'Students who show proficiency in this skill will be able to write sentences containing lists, including a list of coordinate adjectives after a noun and a list of objects. Students will use correct punctuation for both of these structures.',
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
          }
        ]
      },
      {
        name: 'Writing Questions',
        order_number: 4,
        description: 'Students who show proficiency in this skill will be able to write simple yes or no questions like <i>Does he have black cats?</i>',
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
        description: 'Students who show proficiency in this skill will correctly agree the subject to the verb.',
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
        description: 'Students who show proficiency in this skill will correctly use singular possessive nouns and possessive pronouns.',
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
        description: 'Students who show proficiency in this skill will make the correct choice between the prepositions <i>in</i>, <i>on</i>, <i>at</i> (both as prepositions of time and of place), <i>for</i>, and <i>to</i>.',
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
          }
        ]
      },
      {
        name: 'Future Tense',
        order_number: 3,
        description: 'Students who show proficiency in this skill will make the correct choice between a future and present tense verb, and correctly conjugate a singular future tense verb.',
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
        order_number: 4,
        description: 'Students who show proficiency in this skill will be able to use articles like <i>a</i>, <i>an</i>, and <i>the</i> when they are required and omit them when they are not required.',
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
        order_number: 5,
        description: 'Students who show proficiency in this skill will be able to write simple questions with <i>who</i>, <i>where</i>, <i>what</i>, and <i>can</i>, such as <i>Can you do this homework, please?</i>',
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
          }
        ]
      }
    ]
  end

  def ell_advanced_skill_groups
    [
      {
        name: 'Regular Past Tense',
        order_number: 0,
        description: 'Students who show proficiency in this skill will be able to write sentences using verbs in the past tense, including regular verbs, verbs ending in Y, and verbs with double consonants.',
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
          }
        ]
      },
      {
        name: 'Irregular Past Tense',
        order_number: 1,
        description: 'Students who show proficiency in this skill will be able to write sentences using irregular past tense verbs like <i>were</i>, <i>thought</i>, <i>did</i>, <i>said</i>, <i>ate</i>, <i>took</i>, and <i>went</i>.',
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
          }
        ]
      },
      {
        name: 'Progressive Tense',
        order_number: 2,
        description: 'Students who show proficiency in this skill will be able to write sentences using different forms of progressive tense, including present, past, and future progressive.',
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
          }
        ]
      },
      {
        name: 'Phrasal Verbs',
        order_number: 3,
        description: 'Students who show proficiency in this skill will be able to write sentences with both separable phrasal verbs, like <i>drop her off</i>, and inseparable phrasal verbs, like <i>came up with</i>.',
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
        description: 'Students who show proficiency in this skill will demonstrate understanding of ELL-specific skills, like use of the prepositions <i>after</i> and <i>toward</i>, the adverbs <i>really</i> and <i>very</i>, and the commonly confused words <i>say</i>, <i>tell</i>, <i>talk</i>, and ask. Student will also be able to write responses to simple questions, like <i>Is he your brother?</i>',
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
