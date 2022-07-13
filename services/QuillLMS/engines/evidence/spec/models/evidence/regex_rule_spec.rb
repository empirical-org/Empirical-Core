# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(RegexRule, :type => :model) do

    context 'relationships' do
      it { should belong_to(:rule) }
    end

    context 'should validations' do
      it { should validate_presence_of(:rule) }
      it { should validate_presence_of(:regex_text) }
      it { should validate_length_of(:regex_text).is_at_most(200) }
      it { should validate_inclusion_of(:sequence_type).in_array(RegexRule::SEQUENCE_TYPES) }

      it { should allow_value(described_class::CASE_SENSITIVE_ALLOWED_VALUES).for(:case_sensitive) }
    end

    context 'should custom validations' do
      let!(:rule) { create(:evidence_rule) }
      let(:regex_rule) { RegexRule.create(:rule => (rule), :regex_text => "test regex") }

      it "provide a default value for \"case_sensitive\"" do
        expect(regex_rule.case_sensitive).to(be_truthy)
      end

      it "not override a \"case_sensitive\" with the default if one is provided" do
        a_rule = RegexRule.create(:rule => (rule), :regex_text => "test regex", :case_sensitive => false)
        expect(a_rule.valid?).to(eq(true))
        expect(a_rule.case_sensitive).to(be_falsey)
      end

      it "validate the presence of \"case_sensitive\"" do
        regex_rule.case_sensitive = nil
        expect(regex_rule.valid?).to(eq(false))
      end
    end

    context 'should entry_failing?' do
      let!(:rule) { create(:evidence_rule) }
      let!(:regex_rule) { RegexRule.create(:rule => (rule), :regex_text => "^test", :sequence_type => "required", :case_sensitive => false) }

      it 'should flag entry as failing if regex does not match and sequence type is required' do
        expect(regex_rule.entry_failing?("not test passing")).to(eq(true))
      end

      it 'should flag entry as failing if regex matches and sequence type is incorrect' do
        regex_rule.update(:sequence_type => "incorrect")
        expect(regex_rule.entry_failing?("test regex").to_s).to eq 'test'
      end

      it 'should flag entry as failing case-insensitive if the regex_rule is case insensitive' do
        regex_rule.update(:sequence_type => "incorrect")
        expect(regex_rule.entry_failing?("TEST REGEX").to_s).to eq 'TEST'
      end

      it 'should not flag entry as failing if the regex_rule is case sensitive and the casing does not match' do
        regex_rule.update(:sequence_type => "incorrect", :case_sensitive => true)
        expect(regex_rule.entry_failing?("TEST REGEX").to_s).to eq ''
      end
    end

    context 'should incorrect_sequence?' do

      it 'should be true if regex rule is incorrect sequence_type' do
        incorrect_rule = create(:evidence_regex_rule, :sequence_type => "incorrect")
        expect(incorrect_rule.incorrect_sequence?).to(eq(true))
      end

      it 'should be false if regex rule is required sequence type' do
        required_rule = create(:evidence_regex_rule, :sequence_type => "required")
        expect(required_rule.incorrect_sequence?).to(eq(false))
      end
    end
  end
end
