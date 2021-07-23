require("rails_helper")
module Comprehension
  RSpec.describe(Rule, :type => :model) do
    context("validations") do
      subject { FactoryBot.build(:comprehension_rule) }
      it { should validate_uniqueness_of(:uid) }
      it { should validate_presence_of(:name) }
      it { should validate_length_of(:name).is_at_most(250) }
      it { should validate_inclusion_of(:universal).in_array(Rule::ALLOWED_BOOLEANS) }
      it { should validate_inclusion_of(:rule_type).in_array(Rule::TYPES) }
      it { should validate_inclusion_of(:state).in_array(Rule::STATES) }
      it { should validate_inclusion_of(:optimal).in_array(Rule::ALLOWED_BOOLEANS) }
      it { should validate_numericality_of(:suborder).only_integer.is_greater_than_or_equal_to(0).allow_nil }
    end
    context("relationships") do
      it { should have_one(:label) }
      it { should have_one(:plagiarism_text) }
      it { should have_many(:feedbacks) }
      it { should have_many(:prompts_rules) }
      it { should have_many(:prompts).through(:prompts_rules) }
      it { should have_many(:regex_rules).dependent(:destroy) }
    end
    context("before_validation") do
      context("assign_uid_if_missing") do
        it 'should keep existing uid if already set' do
          rule = build(:comprehension_rule)
          old_uid = rule.uid
          rule.valid?
          expect(rule.uid).to(eq(old_uid))
        end
        it 'should set new uid if missing' do
          rule = build(:comprehension_rule, :uid => nil)
          rule.valid?
          expect(rule.uid).to_not(be_nil)
        end
      end
    end
    context("serializable_hash") do
      before do
        @rule_prompt = create(:comprehension_prompts_rule)
        @rule = @rule_prompt.rule
        @prompt = @rule_prompt.prompt
      end
      it 'should fill out hash with all fields' do
        json_hash = @rule.as_json
        expect(@rule.id).to(eq(json_hash["id"]))
        expect(@rule.uid).to(eq(json_hash["uid"]))
        expect(@rule.name).to(eq(json_hash["name"]))
        expect(@rule.note).to(eq(json_hash["note"]))
        expect(@rule.universal).to(eq(json_hash["universal"]))
        expect(@rule.rule_type).to(eq(json_hash["rule_type"]))
        expect(@rule.optimal).to(eq(json_hash["optimal"]))
        expect(@rule.suborder).to(eq(json_hash["suborder"]))
        expect(@rule.concept_uid).to(eq(json_hash["concept_uid"]))
        expect(@rule.prompt_ids).to(eq(json_hash["prompt_ids"]))
      end
    end
    context("display_name") do
      it 'should correspond to the correct display name' do
        rule = create(:comprehension_rule, :rule_type => "rules-based-2")
        expect(rule.display_name).to(be_truthy)
      end
    end
    context("#determine_feedback_from_history") do
      before do
        @rule = create(:comprehension_rule)
        @feedback1 = create(:comprehension_feedback, :rule => (@rule), :order => 0, :text => "Example feedback 1")
        @feedback2 = create(:comprehension_feedback, :rule => (@rule), :order => 1, :text => "Example feedback 2")
        @feedback3 = create(:comprehension_feedback, :rule => (@rule), :order => 2, :text => "Example feedback 3")
      end
      it 'should fetch lowest order feedback if feedback history is empty' do
        feedback_history = []
        expect(@feedback1).to(eq(@rule.determine_feedback_from_history(feedback_history)))
      end
      it 'should fetch lowest order feedback with text not matched from history' do
        feedback_history = [{ "feedback" => @feedback1.text, "feedback_type" => @rule.rule_type }]
        expect(@feedback2).to(eq(@rule.determine_feedback_from_history(feedback_history)))
      end
      it 'should fetch highest order if all feedbacks have text matched from history' do
        feedback_history = [{ "feedback" => @feedback1.text, "feedback_type" => @rule.rule_type }, { "feedback" => @feedback2.text, "feedback_type" => @rule.rule_type }, { "feedback" => @feedback3.text, "feedback_type" => @rule.rule_type }]
        expect(@feedback3).to(eq(@rule.determine_feedback_from_history(feedback_history)))
      end
    end
    context("regex_is_passing?") do
      before do
        @rule = create(:comprehension_rule)
        @regex_rule = create(:comprehension_regex_rule, :rule => (@rule), :regex_text => "^Hello", :sequence_type => "incorrect")
        @regex_rule_two = create(:comprehension_regex_rule, :rule => (@rule), :regex_text => "^Something", :sequence_type => "incorrect")
      end
      it 'should be true if entry does not match the regex text' do
        expect(@rule.regex_is_passing?("Nope, I dont start with hello.")).to(eq(true))
      end
      it 'should be true if sequence_type is incorrect and entry does not match the regex text' do
        expect(@rule.regex_is_passing?("Nope, I dont start with hello.")).to(eq(true))
      end
      it 'should be false if sequence_type is incorrect and entry matches the regex text and there are more than one sequences' do
        expect(@rule.regex_is_passing?("Something is wrong here.")).to(eq(false))
      end
      it 'should be false if sequence_type is incorrect and entry matches regex text' do
        expect((!@rule.regex_is_passing?("Hello!!!"))).to(be_truthy)
      end
      it 'should be false if sequence_type is required and entry does not match regex text' do
        required_rule = create(:comprehension_rule)
        @regex_rule_three = create(:comprehension_regex_rule, :rule => required_rule, :regex_text => "you need this sequence", :sequence_type => "required")
        expect((!required_rule.regex_is_passing?("I do not have the right sequence"))).to(be_truthy)
      end
      it 'should be true if sequence_type is required and entry matches regex text' do
        required_rule = create(:comprehension_rule)
        @regex_rule_three = create(:comprehension_regex_rule, :rule => required_rule, :regex_text => "you need this sequence", :sequence_type => "required")
        expect(required_rule.regex_is_passing?("you need this sequence and I do have it")).to(eq(true))
      end
      it 'should be true if sequence_type is required and entry matches regex text and there are multiple required sequences' do
        required_rule = create(:comprehension_rule)
        @regex_rule_three = create(:comprehension_regex_rule, :rule => required_rule, :regex_text => "you need this sequence", :sequence_type => "required")
        @regex_rule_four = create(:comprehension_regex_rule, :rule => required_rule, :regex_text => "or you need this one", :sequence_type => "required")
        expect(required_rule.regex_is_passing?("you need this sequence and I do have it")).to(eq(true))
      end
      it 'should be true if rule is NOT case sensitive and entry matches regardless of casing' do
        required_rule = create(:comprehension_rule)
        @regex_rule_three = create(:comprehension_regex_rule, :rule => required_rule, :regex_text => "you need this sequence", :sequence_type => "required", :case_sensitive => false)
        expect(required_rule.regex_is_passing?("YOU NEED THIS SEQUENCE AND I DO HAVE IT")).to(eq(true))
      end
      it 'should be false if rule IS case sensitive and entry does not match casing' do
        required_rule = create(:comprehension_rule)
        @regex_rule_three = create(:comprehension_regex_rule, :rule => required_rule, :regex_text => "you need this sequence", :sequence_type => "required", :case_sensitive => true)
        expect((!required_rule.regex_is_passing?("YOU NEED THIS SEQUENCE AND I do not HAVE IT in the right casing"))).to(be_truthy)
      end
    end
    context("one_plagiarism_per_prompt") do
      before do
        @prompt1 = create(:comprehension_prompt)
        @prompt2 = create(:comprehension_prompt)
        @plagiarism_rule = create(:comprehension_rule, :rule_type => (Rule::TYPE_PLAGIARISM), :prompt_ids => ([@prompt1.id]))
      end
      it 'should creates plagiarism rule if first rule for prompt' do
        expect(@plagiarism_rule.valid?).to(eq(true))
      end
      it 'should does not create plagiarism rule if plagiarism rule already exists for prompt' do
        invalid_plagiarism_rule = build(:comprehension_rule, :rule_type => (Rule::TYPE_PLAGIARISM), :prompt_ids => ([@prompt1.id]))
        expect((!invalid_plagiarism_rule.valid?)).to(be_truthy)
      end
      it 'should creates subsequent plagiarism rule for different prompt' do
        second_plagiarism_rule = build(:comprehension_rule, :rule_type => (Rule::TYPE_PLAGIARISM), :prompt_ids => ([@prompt2.id]))
        expect(second_plagiarism_rule.valid?).to(eq(true))
      end
      it 'should create a different type of rule if it is not plagiarism' do
        valid_automl_rule = build(:comprehension_rule, :rule_type => (Rule::TYPE_AUTOML), :prompt_ids => ([@prompt1.id]))
        expect(valid_automl_rule.valid?).to(eq(true))
      end
    end
    context("#after_create") do
      context("#assign_to_all_prompts") do
        it 'should assign newly created rule to all prompts if the rule is universal' do
          prompt = create(:comprehension_prompt)
          rule = create(:comprehension_rule, :universal => true)
          expect(1).to(eq(prompt.rules.length))
          expect(rule.prompts.include?(prompt)).to(eq(true))
        end
        it 'should not assign newly created rule to all prompts if the rule is not universal' do
          prompt = create(:comprehension_prompt)
          rule = create(:comprehension_rule, :universal => false)
          expect(0).to(eq(prompt.rules.length))
          expect(rule.prompts.include?(prompt)).to(eq(false))
        end
        it 'should not assign newly created rules to prompts that somehow already have them assigned' do
          prompt = create(:comprehension_prompt)
          rule = create(:comprehension_rule, :universal => true, :prompts => ([prompt]))
          expect(1).to(eq(prompt.rules.length))
          expect(rule.prompts.include?(prompt)).to(eq(true))
        end
      end
    end
  end
end
