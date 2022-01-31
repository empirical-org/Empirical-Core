# frozen_string_literal: true

require 'rails_helper'

describe ScorebookHelper, type: :helper do
  describe '#percentage_color' do
    context 'when the score is missing' do
      it 'is gray' do
        expect(helper.percentage_color(nil)).to eq('gray')
      end
    end

    context "when the score is greater than the proficiency cut off of > #{ProficiencyEvaluator.proficiency_cutoff}" do
      it 'is green' do
        expect(helper.percentage_color(ProficiencyEvaluator.proficiency_cutoff + 0.01)).to eq('green')
      end
    end

    context "when the score is equal to the proficiency cut off of #{ProficiencyEvaluator.proficiency_cutoff}" do
      it 'is green' do
        expect(helper.percentage_color(ProficiencyEvaluator.proficiency_cutoff)).to eq('green')
      end
    end

    context 'when the score is a long float' do
      it 'rounds up correctly' do
        expect(helper.percentage_color(0.855)).to eq('green')
      end

      it 'rounds down correctly' do
        expect(helper.percentage_color(0.793)).to eq('orange')
      end
    end

    context "when the score is equal to nearly proficiency cutoff of #{ProficiencyEvaluator.nearly_proficient_cutoff}" do
      it 'is orange' do
        expect(helper.percentage_color(ProficiencyEvaluator.nearly_proficient_cutoff)).to eq('orange')
      end
    end

    context "when the score is less than the nearly proficiency cutoff of #{ProficiencyEvaluator.nearly_proficient_cutoff}" do
      it 'is red' do
        expect(helper.percentage_color(ProficiencyEvaluator.nearly_proficient_cutoff - 0.1)).to eq('red')
      end
    end

    context "when the score is between the greater than the nearly proficiency cutoff, but less than the proficient cutoff" do
      it 'is orange' do
        between_score = (ProficiencyEvaluator.nearly_proficient_cutoff + ProficiencyEvaluator.proficiency_cutoff) / 2
        expect(helper.percentage_color(between_score)).to eq('orange')
      end
    end
  end

  describe '#icon_for_classification' do
    it 'should give the correct values' do
      expect(icon_for_classification(double(:classification, id: 1))).to eq "flag"
      expect(icon_for_classification(double(:classification, id: 2))).to eq "puzzle"
      expect(icon_for_classification(double(:classification, id: 4))).to eq "diagnostic"
      expect(icon_for_classification(double(:classification, id: 5))).to eq "connect"
      expect(icon_for_classification(double(:classification, id: 6))).to eq ""
    end
  end

  describe '#icon_for_classification_by_id' do
    it 'should give the right values' do
      expect(icon_for_classification_by_id(1)).to eq "flag"
      expect(icon_for_classification_by_id(2)).to eq "puzzle"
      expect(icon_for_classification_by_id(4)).to eq "diagnostic"
      expect(icon_for_classification_by_id(5)).to eq "connect"
      expect(icon_for_classification_by_id(6)).to eq ""
    end
  end

  describe '#scorebook_path' do
    before do
      without_partial_double_verification do
        allow(helper).to receive(:scorebook_teachers_classrooms_path) { "path" }
      end
    end

    it 'should give path if teacher has classrooms' do
      expect(helper.scorebook_path(double(:teacher, has_classrooms?: true))).to eq "path"
      expect(helper.scorebook_path(double(:teacher, has_classrooms?: false))).to eq ""
    end
  end

  describe '#alias_by_id' do
    it 'should give the correct values' do
      expect(alias_by_id(1)).to eq "Quill Proofreader"
      expect(alias_by_id(2)).to eq "Quill Grammar"
      expect(alias_by_id(4)).to eq "Quill Diagnostic"
      expect(alias_by_id(5)).to eq "Quill Connect"
    end
  end
end
