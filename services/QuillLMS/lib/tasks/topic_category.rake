namespace :topic_category do 
	desc 'create topic category'
	task :seed => :environment do 

		arr1 = [

			{
				topic: "1.1b. Use Common, Proper, and Possessive Nouns",
				category: "Nouns and Pronouns"
			},

			{
				topic: "1.1c. Use Singular and Plural Nouns with Matching Verbs in Basic Sentences"	,
				category: "Verbs"
			},

			{
				topic: "1.1e. Use Verbs to Convey a Sense of Past, Present, and Future"	,
				category: "Verbs"
			},
			
			{
				topic: "1.1g. Conjunctions: And, But, Or, So",
				category: "Conjunctions"
			},
			
			{
				topic: "1.1h. Use Determiners: Articles, Demonstratives",
				category: "Determiners"
			},
			
			{
				topic: "1.1i. Frequently Occurring Prepositions",
				category: "Prepositions"
			},

			{
				topic: "1.2a. Capitalize Dates and Names of People"	,
				category: "Capitalization"
			},

			{
				topic: "1.2c. Use Commas for Dates and Lists."	,
				category: "Comma Usage"
			},

			{
				topic: "2.1b. Use Irregular Plural Nouns",
				category: "Nouns and Pronouns"
			},
			
			{
				topic: "2.1c. Use Reflexive Pronouns"	,
				category: "Nouns and Pronouns"
			},
			
			{

				topic: "2.1d. Form and Use the Past Tense of Frequently Occurring Irregular Verbs.",
				category: "Verbs"
			},

			{
				topic:	"2.1e. Use Adjectives and Adverbs",
				category:	"Adjectives & Adverbs"
			},

			{

				topic:	"2.2a. Capitalize Holidays, Product Names, and Geographic Names",
				category:	"Adjectives & Adverbs"
			},

			{

				topic:	"3.1g. Form and Use Comparative and Superlative Adjectives"	,
				category:	"Adjectives & Adverbs"
			},

			{

				topic:	"3.2a. Capitalize Words in Titles"	,
				category:	"Capitalization"
			},
			
			{
				topic:	"3.2b. Use Commas in Addresses",
				category:	"Comma Usage"
			},

			{
				topic:	"3.2c. Use Commas and Quotation Marks in Dialogue",
				category:	"Comma Usage"
			},
			
			{
				topic:	"3.2d. Form and use Possessives",
				category: "Nouns & Pronouns"

			},
			
			{
				topic:	"4.1a. Use Relative Pronouns",
				category:	"Nouns & Pronouns"
			},

			{
				topic:	"4.1b. The Progressive Tense",
				category:	"Verbs"
			},

			{
				topic:	"4.1c. Can/May vs. Should/Must",
				category:	"Verbs"
			},
			
			{
				topic:	"4.1e. Prepositional Phrases",
				category:	"Prepositions"
			},

			{
				topic:	"4.1g. Commonly Confused Words",
				category:	"Commonly Confused Words"
			},

			{
				topic:	"4.2a. Use Correct Capitalization"	,
				category:	"Capitalization"
			},
			
			{
				topic:	"5.1b. Use Past Participles",
				category:	"Verbs"
			},
			
			{
				topic:	"5.1e. Correlative Conjunctions",
				category:	"Conjunctions"
			},

			{
				topic:	"5.2a. Use Colons and Commas in a List",
				category:	"Comma Usage"
			},
			
			{
				topic:	"5.2b. Use Commas after Introductory Words",
				category:	"Comma Usage"
			},

			{
				topic:	"5.2c. Use a Comma to Set off the Words \"Yes\" and \"No\""	,
				category:	"Comma Usage"
			},

			{
				topic:	"6.1a. Subjective, Objective, and Possessive Pronouns",
				category:	"Nouns & Pronouns"
			},

			{
				topic:	"6.1b. Intensive Pronouns",
				category:	"Nouns & Pronouns"
			},

			{
				topic:	"6.1c. Recognizing Inappropriate Shifts in Pronoun Number or Gender",
				category:	"Nouns & Pronouns"
			},

			{
				topic:	"7.1c. Misplaced Modifiers",
				category:	"Structure"
			},

			{
				topic:	"7.2a. Use a Comma to Separate Coordinate Adjectives",
				category:	"Comma Usage"
			},
			
			{
				topic:	"8.1b. Form and Use Verbs in the Active and Passive Voice",
				category:	"Verbs"
			},

			{
				topic:	"8.1d. Recognize and Correct Innapropriate Shifts in Verb Voice and Mood",
				category:	"Verbs"
			},

			{
				topic:	"9.1a. Use Parallel Structure",
				category:	"Structure"
			},


			{
				topic: 		"2.2c. Use an Apostrophe to Form Contractions",
				category: 	"Punctuation"
			},

			{
				topic:		"CCSS Grade 1 Summative Assessments",
				category:	"Summative Assessments"
			},

			{
				topic:		"CCSS Grade 2 Summative Assessments",
				category:	"Summative Assessments"
			},

			{
				topic:		"M1. Using Spaces With Quotation Marks",
				category:	"Punctuation"
			},

			{
				topic:		"M2. Using Spaces with Punctuation",
				category:	"Punctuation"
			},

			{

				topic:		"Quill Tutorial Lessons",
				category:	"Punctuation"
			},

			{

				topic:		"University: Commonly Confused Words",
				category:	"Commonly Confused Words"
			},

			{
				topic:		"University Grammar Test: A Man and His Mouse",
				category:	"Summative Assessments"
			},

			{
				topic:		"University Grammar Test: The First Spacewalk",
				category:	"Summative Assessments"
			}
		]


		arr1.each do |pair|
			puts ''
			puts 'topic to associate : '
			puts pair[:topic]
			puts 'category to associate : '
			puts pair[:category]


			topic = Topic.find_by_name pair[:topic]
			topic_category = TopicCategory.where(name: pair[:category]).first_or_create!

			if topic.nil?
				puts 'couldnt find topic'
			elsif topic_category.nil?
				puts 'couldnt find topic category'
			else
				puts 'successfully created topic category relation : '
				topic.topic_category = topic_category
				topic.save
				puts topic.inspect
			end

		end





	end
end

