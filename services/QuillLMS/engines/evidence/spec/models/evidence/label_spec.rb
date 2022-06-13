# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Label, :type => :model) do

    context 'should validations' do
      let!(:label) { create(:evidence_label) }

      it { should validate_presence_of(:name) }

      it { should validate_presence_of(:rule) }

      it { should validate_uniqueness_of(:rule) }

      it 'should not allow changes to name after creation' do
        old_name = label.name
        label.name = "NEW_#{old_name}"
        label.save
        label.reload
        expect(old_name).to(eq(label.name))
      end

      context 'should #name_unique_for_prompt' do
        let!(:label) { create(:evidence_label) }

        it 'should not allow a label to be created if its name collides with another on the prompt' do
          prompt = create(:evidence_prompt)
          label.rule.update(:prompts => ([prompt]))
          rule = create(:evidence_rule, :prompts => ([prompt]))
          new_label = build(:evidence_label, :rule => rule, :name => label.name)
          expect((!new_label.valid?)).to(be_truthy)
          expect(new_label.errors[:name].include?("can't be the same as any other labels related to the same prompt")).to(eq(true))
        end
      end
    end

    context 'should relationships' do

      it { should belong_to(:rule) }

    end
  end
end
