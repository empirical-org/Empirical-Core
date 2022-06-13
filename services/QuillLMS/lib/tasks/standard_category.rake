# frozen_string_literal: true

namespace :standard_category do
  desc 'create standard category'
  task :seed => :environment do

    arr1 = [

      {
        standard: "1.1b. Use Common, Proper, and Possessive Nouns",
        category: "Nouns and Pronouns"
      },

      {
        standard: "1.1c. Use Singular and Plural Nouns with Matching Verbs in Basic Sentences"	,
        category: "Verbs"
      },

      {
        standard: "1.1e. Use Verbs to Convey a Sense of Past, Present, and Future"	,
        category: "Verbs"
      },

      {
        standard: "1.1g. Conjunctions: And, But, Or, So",
        category: "Conjunctions"
      },

      {
        standard: "1.1h. Use Determiners: Articles, Demonstratives",
        category: "Determiners"
      },

      {
        standard: "1.1i. Frequently Occurring Prepositions",
        category: "Prepositions"
      },

      {
        standard: "1.2a. Capitalize Dates and Names of People"	,
        category: "Capitalization"
      },

      {
        standard: "1.2c. Use Commas for Dates and Lists."	,
        category: "Comma Usage"
      },

      {
        standard: "2.1b. Use Irregular Plural Nouns",
        category: "Nouns and Pronouns"
      },

      {
        standard: "2.1c. Use Reflexive Pronouns"	,
        category: "Nouns and Pronouns"
      },

      {

        standard: "2.1d. Form and Use the Past Tense of Frequently Occurring Irregular Verbs.",
        category: "Verbs"
      },

      {
        standard:	"2.1e. Use Adjectives and Adverbs",
        category:	"Adjectives & Adverbs"
      },

      {

        standard:	"2.2a. Capitalize Holidays, Product Names, and Geographic Names",
        category:	"Adjectives & Adverbs"
      },

      {

        standard:	"3.1g. Form and Use Comparative and Superlative Adjectives"	,
        category:	"Adjectives & Adverbs"
      },

      {

        standard:	"3.2a. Capitalize Words in Titles"	,
        category:	"Capitalization"
      },

      {
        standard:	"3.2b. Use Commas in Addresses",
        category:	"Comma Usage"
      },

      {
        standard:	"3.2c. Use Commas and Quotation Marks in Dialogue",
        category:	"Comma Usage"
      },

      {
        standard:	"3.2d. Form and use Possessives",
        category: "Nouns & Pronouns"

      },

      {
        standard:	"4.1a. Use Relative Pronouns",
        category:	"Nouns & Pronouns"
      },

      {
        standard:	"4.1b. The Progressive Tense",
        category:	"Verbs"
      },

      {
        standard:	"4.1c. Can/May vs. Should/Must",
        category:	"Verbs"
      },

      {
        standard:	"4.1e. Prepositional Phrases",
        category:	"Prepositions"
      },

      {
        standard:	"4.1g. Commonly Confused Words",
        category:	"Commonly Confused Words"
      },

      {
        standard:	"4.2a. Use Correct Capitalization"	,
        category:	"Capitalization"
      },

      {
        standard:	"5.1b. Use Past Participles",
        category:	"Verbs"
      },

      {
        standard:	"5.1e. Correlative Conjunctions",
        category:	"Conjunctions"
      },

      {
        standard:	"5.2a. Use Colons and Commas in a List",
        category:	"Comma Usage"
      },

      {
        standard:	"5.2b. Use Commas after Introductory Words",
        category:	"Comma Usage"
      },

      {
        standard:	"5.2c. Use a Comma to Set off the Words \"Yes\" and \"No\""	,
        category:	"Comma Usage"
      },

      {
        standard:	"6.1a. Subjective, Objective, and Possessive Pronouns",
        category:	"Nouns & Pronouns"
      },

      {
        standard:	"6.1b. Intensive Pronouns",
        category:	"Nouns & Pronouns"
      },

      {
        standard:	"6.1c. Recognizing Inappropriate Shifts in Pronoun Number or Gender",
        category:	"Nouns & Pronouns"
      },

      {
        standard:	"7.1c. Misplaced Modifiers",
        category:	"Structure"
      },

      {
        standard:	"7.2a. Use a Comma to Separate Coordinate Adjectives",
        category:	"Comma Usage"
      },

      {
        standard:	"8.1b. Form and Use Verbs in the Active and Passive Voice",
        category:	"Verbs"
      },

      {
        standard:	"8.1d. Recognize and Correct Innapropriate Shifts in Verb Voice and Mood",
        category:	"Verbs"
      },

      {
        standard:	"9.1a. Use Parallel Structure",
        category:	"Structure"
      },


      {
        standard: 		"2.2c. Use an Apostrophe to Form Contractions",
        category: 	"Punctuation"
      },

      {
        standard:		"CCSS Grade 1 Summative Assessments",
        category:	"Summative Assessments"
      },

      {
        standard:		"CCSS Grade 2 Summative Assessments",
        category:	"Summative Assessments"
      },

      {
        standard:		"M1. Using Spaces With Quotation Marks",
        category:	"Punctuation"
      },

      {
        standard:		"M2. Using Spaces with Punctuation",
        category:	"Punctuation"
      },

      {

        standard:		"Quill Tutorial Lessons",
        category:	"Punctuation"
      },

      {

        standard:		"University: Commonly Confused Words",
        category:	"Commonly Confused Words"
      },

      {
        standard:		"University Grammar Test: A Man and His Mouse",
        category:	"Summative Assessments"
      },

      {
        standard:		"University Grammar Test: The First Spacewalk",
        category:	"Summative Assessments"
      }
    ]


    arr1.each do |pair|
      puts ''
      puts 'standard to associate : '
      puts pair[:standard]
      puts 'category to associate : '
      puts pair[:category]


      standard = Standard.find_by_name pair[:standard]
      standard_category = StandardCategory.where(name: pair[:category]).first_or_create!

      if standard.nil?
        puts 'couldnt find standard'
      elsif standard_category.nil?
        puts 'couldnt find standard category'
      else
        puts 'successfully created standard category relation : '
        standard.standard_category = standard_category
        standard.save
        puts standard.inspect
      end

    end





  end
end
