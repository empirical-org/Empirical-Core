ENV['RAILS_ENV'] = 'test'
require './parser'

require 'yaml'
require 'pry'
require 'rspec'

fixtures = <<-SQL
INSERT INTO rules (id, name, created_at, updated_at, category_id, workbook_id, description, classification) VALUES (10, 'Common Nouns', '2013-09-15 21:13:27.291049', '2013-09-30 19:18:41.00886', 1, 1, '<b>Examples: man, woman, city, country, baseball team. </b>
<br>
Common nouns are ordinary words for people, places, and things, such as <b>man</b>, or <b>country</b>. Common nouns are not capitalized.
<br>', 'Common Nouns');
INSERT INTO rules (id, name, created_at, updated_at, category_id, workbook_id, description, classification) VALUES (13, 'Practice: Common, Proper, & Possessive Nouns', '2013-09-15 21:37:22.087484', '2013-09-15 21:37:22.087484', 1, 1, NULL, NULL);
INSERT INTO rules (id, name, created_at, updated_at, category_id, workbook_id, description, classification) VALUES (11, 'Proper Nouns', '2013-09-15 21:33:49.051019', '2013-09-30 19:17:15.37079', 1, 1, '<b>Examples: John, Sarah, London, Japan, and Yankees</b>
<br>
Proper nouns are names for people, places, and things, such as <b>John</b>, or <b>Japan</b>. All proper nouns are capitalized.
<br>', 'Proper Nouns');
INSERT INTO activity_classifications (id, name, key, form_url, uid, module_url, created_at, updated_at) VALUES (20, 'Practice Questions', 'practice_question_set', 'http://grammar.quill.org/practice_questions/form', 'oe5tPizl2TZcGbdk5LaUZw', 'http://grammar.quill.org/practice_questions/module', '2014-02-02 20:56:45.050657', '2014-03-06 18:09:52.254284');
INSERT INTO activity_classifications (id, name, key, form_url, uid, module_url, created_at, updated_at) VALUES (19, 'Story', 'story', 'http://grammar.quill.org/stories/form', 'I6QvT0BI9879I6KOqQ-yNg', 'http://grammar.quill.org/stories/module', '2014-02-02 20:56:45.042541', '2014-03-06 18:09:56.694165');
SQL

data = <<-CSV
Common Nouns,1.1b. Test Topic,,,,,,,
,,17,915,"[""Even the best plans can go awry.""]",10,question for 1st rule,instructions,Explanation text.
,,5,916,"[""These raspberries will spoil soon.""]",10,question for 2nd rule,instructions,
,,1001,917,"[""My belt is too old.""]",11,question for 3rd rule,instructions,
,,a,918,"[""His ankle hurts.""]",11,question for 4th rule,instructions,
,,b,920,"[""Are all wheels round?""]",10,question for 4th rule,instructions,
,,c,,"[""Her socks don't match.""]",,question for 4th rule,instructions,
Possessive Nouns,,,,,,,?? nothnig will happen with this text.,
,,d,52,"[""There will be tests on Friday.""]",13,question for 5th rule,instructions,
,,5,53,"[""My sister's hair is short.""]",13,question for 6th rule,instructions,
CSV

tree = YAML.load(<<-YML)
---
:topics:
  - :name: '1.1b. Test Topic'
    :activities:
      - :name: 'Common Nouns'
        :rules:
          - :id: '1'
            :uid: 'Common Nouns-17'
            :old_rule_id: '10'
            :description: 'Explanation text.'
            :questions:
              - :body: ["Even the best plans can go awry."]
                :prompt: 'question for 1st rule'
                :instructions: 'instructions'

          - :id: '2'
            :uid: 'Common Nouns-5'
            :old_rule_id: '10'
            :questions:
              - :body: ["These raspberries will spoil soon."]
                :prompt: 'question for 2nd rule'
                :instructions: 'instructions'

          - :id: '3'
            :uid: 'Common Nouns-1001'
            :old_rule_id: '11'
            :questions:
              - :body: ["My belt is too old."]
                :prompt: 'question for 3rd rule'
                :instructions: 'instructions'

          - :id: '4'
            :uid: 'Common Nouns-alpha'
            :old_rule_id: '11'
            :questions:
              - :body: ["His ankle hurts."]
                :prompt: 'question for 4th rule'
                :instructions: 'instructions'
              - :body: ["Are all wheels round?"]
                :prompt: 'question for 4th rule'
                :instructions: 'instructions'
              - :body: ["Her socks don't match."]
                :prompt: 'question for 4th rule'
                :instructions: 'instructions'

      - :name: 'Possessive Nouns'
        :rules:
          - :id: '5'
            :uid: 'Possessive Nouns-alpha'
            :old_rule_id: '13'
            :questions:
              - :body: ["There will be tests on Friday."]
                :prompt: 'question for 5th rule'
                :instructions: 'instructions'

          - :id: '6'
            :uid: 'Possessive Nouns-5'
            :old_rule_id: '13'
            :questions:
              - :body: ["My sister's hair is short."]
                :prompt: 'question for 6th rule'
                :instructions: 'instructions'
YML


describe AprilFirst2014QuestionParser do
  let(:parser) { AprilFirst2014QuestionParser.new(data) }

  it 'parses the data properly' do
    expect(parser.tree.to_yaml).to eq(tree.to_yaml)
  end

  it 'properly loads it into the database' do
    expect(Topic.count).to eq(0)
    expect(Activity.count).to eq(0)
    expect(Rule.count).to eq(3)
    expect(RuleQuestion.count).to eq(0)

    3.times { parser.load! }

    expect(Topic.count).to eq(1)
    expect(Activity.count).to eq(2)
    expect(Rule.count).to eq(3 + 6)
    expect(RuleQuestion.count).to eq(8)

    expect(Rule.find_by_uid('Common Nouns-alpha').questions.count).to eq(3)
  end
end

RSpec.configure do |config|
   config.color_enabled = true
end

DatabaseCleaner.strategy = :truncation
DatabaseCleaner.clean
ActiveRecord::Base.connection.execute(fixtures)
RSpec::Core::Runner.autorun
