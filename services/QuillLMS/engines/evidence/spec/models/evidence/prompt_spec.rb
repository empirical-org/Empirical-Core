# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Prompt, :type => :model) do

    context 'should relations' do

      it { should belong_to(:activity) }

      it { should have_many(:automl_models) }

      it { should have_many(:prompts_rules) }

      it { should have_many(:rules).through(:prompts_rules) }
    end

    context 'should validations' do

      it { should validate_presence_of(:activity) }

      it { should validate_inclusion_of(:max_attempts).in_array([3, 4, 5, 6]) }

      it { should validate_presence_of(:text) }

      it { should validate_presence_of(:conjunction) }

      it { should validate_inclusion_of(:conjunction).in_array(["because", "but", "so"]) }

      context 'should #validate_prompt_length' do

        it 'should not allow a prompt to be created that is too short' do
          activity = create(:evidence_activity)
          prompt = build(:evidence_prompt, :conjunction => "but", :text => "too short", :max_attempts => 5, :activity_id => activity.id)
          expect((!prompt.valid?)).to(be_truthy)
          expect(prompt.errors[:text].include?("#{prompt.conjunction} prompt too short (minimum is #{Prompt::MIN_TEXT_LENGTH} characters)")).to(eq(true))
        end

        it 'should not allow a prompt to be created that is too long' do
          activity = create(:evidence_activity)
          prompt_text = "And both that morning equally lay In leaves no step had trodden black. Oh, I kept the first for another day! Yet knowing how way leads on to way, I doubted if I should ever come back. I shall be telling this with a sigh Somewhere ages and ages hence: Two roads diverged in a wood, and I\u2014 I took the one less traveled by, And that has made all the difference."
          prompt = build(:evidence_prompt, :conjunction => "because", :text => prompt_text, :max_attempts => 5, :activity_id => activity.id)
          expect((!prompt.valid?)).to(be_truthy)
          expect(prompt.errors[:text].include?("#{prompt.conjunction} prompt too long (maximum is #{Prompt::MAX_TEXT_LENGTH} characters)")).to(eq(true))
        end
      end
    end

    context 'should #after_create' do

      context 'should #assign_universal_rules' do

        it 'should assign all universal rules to new prompts' do
          rule1 = create(:evidence_rule, :universal => true)
          rule2 = create(:evidence_rule, :universal => true)
          prompt = create(:evidence_prompt)
          expect(prompt.rules.length).to(eq(2))
          expect(prompt.rules.include?(rule1)).to(eq(true))
          expect(prompt.rules.include?(rule2)).to(eq(true))
        end

        it 'should not duplicate rule assignments if some exist already' do
          rule1 = create(:evidence_rule, :universal => true)
          rule2 = create(:evidence_rule, :universal => true)
          prompt = create(:evidence_prompt, :rules => ([rule1]))
          expect(prompt.rules.length).to(eq(2))
          expect(prompt.rules.include?(rule1)).to(eq(true))
          expect(prompt.rules.include?(rule2)).to(eq(true))
        end

        it 'should not add non-universal rules' do
          universal_rule = create(:evidence_rule, :universal => true)
          non_universal_rule = create(:evidence_rule, :universal => false)
          prompt = create(:evidence_prompt)
          expect(prompt.rules.length).to(eq(1))
          expect(prompt.rules.include?(universal_rule)).to(eq(true))
          expect(prompt.rules.include?(non_universal_rule)).to(eq(false))
        end

        it 'should not remove existing non-universal assignments' do
          universal_rule = create(:evidence_rule, :universal => true)
          non_universal_rule = create(:evidence_rule, :universal => false)
          prompt = create(:evidence_prompt, :rules => ([non_universal_rule]))
          expect(prompt.rules.length).to(eq(2))
          expect(prompt.rules.include?(universal_rule)).to(eq(true))
          expect(prompt.rules.include?(non_universal_rule)).to(eq(true))
        end
      end
    end
  end
end
