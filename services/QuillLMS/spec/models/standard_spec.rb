# frozen_string_literal: true

# == Schema Information
#
# Table name: standards
#
#  id                   :integer          not null, primary key
#  name                 :string
#  uid                  :string
#  visible              :boolean          default(TRUE)
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  standard_category_id :integer
#  standard_level_id    :integer
#
# Foreign Keys
#
#  fk_rails_...  (standard_category_id => standard_categories.id)
#  fk_rails_...  (standard_level_id => standard_levels.id)
#
require 'rails_helper'

describe Standard, type: :model do

  let!(:standard){create(:standard, name: "a")}

  it_behaves_like 'uid'

  context "when the default order is by name" do

    let!(:standard1){create(:standard, name: "c")}
    let!(:standard2){create(:standard, name: "b")}

    it "must be ordered correctly" do
      expect(Standard.all.map{|x| x.name}).to eq ["a", "b", "c"]
    end
  end

  context "when it's updated/created" do

    it "must be valid with valid info" do
      expect(standard.valid?).to be_truthy
    end

    context "when it runs validations" do
      it "must have a name" do
        standard.name=nil
        standard.valid?
        expect(standard.errors[:name]).to include "can't be blank"
      end

      it "must have a unique name" do
        t=Standard.first
        n=build(:standard, name: t.name)
        n.valid?
        expect(n.errors[:name]).to include "has already been taken"
      end

      it "must have a standard_level" do
        standard.standard_level_id=nil
        standard.valid?
        expect(standard.errors[:standard_level]).to include "can't be blank"
      end
    end
  end

  context "when it is destroyed" do

    it "must nullify associated activity records" do
      activity = create(:activity, standard_id: standard.id)
      standard.destroy!
      expect(activity.reload.standard_id).to be(nil)
    end
  end

  context "retrieving standards for the progress report" do
    let(:filters) { {} }

    include_context 'Standard Progress Report'

    subject { ProgressReports::Standards::Standard.new(teacher).results(filters).to_a }

    it "retrieves aggregated standards data" do
      found_standards = subject
      expect(found_standards.size).to eq(visible_standards.size)
      expect(found_standards[0].name).to be_present
      expect(found_standards[0].total_student_count).to be_present
      expect(found_standards[0].proficient_student_count).to be_present
      expect(found_standards[0].not_proficient_student_count).to be_present
      expect(found_standards[0].total_activity_count).to be_present
      expect(found_standards[0].average_score).to be_present
    end

    context "when a classroom filter is provided" do
      let(:filters) { {standard_level_id: standard_level.id, classroom_id: full_classroom.id} }

      it "filters by classroom" do
        expect(subject.size).to eq(visible_standards.size)
      end
    end

    context "classroom filter for an empty classroom" do
      let(:filters) { {standard_level_id: standard_level.id, classroom_id: empty_classroom.id} }

      it "returns no results" do
        expect(subject.size).to eq(0)
      end
    end

    context "classroom filter with no ID" do
      let(:filters) { {standard_level_id: standard_level.id, classroom_id: ""} }

      it "does not filter by classroom" do
        expect(subject.size).to eq(visible_standards.size)
      end
    end

    context "when a unit filter is provided" do
      let(:filters) { {standard_level_id: standard_level.id, unit_id: unit1.id} }

      it "filters by unit" do
        expect(subject.size).to eq(visible_standards.size)
      end
    end

    context "when an empty unit filter is provided" do
      let(:filters) { {standard_level_id: standard_level.id, unit_id: ""} }

      it "does not filter by unit" do
        expect(subject.size).to eq(visible_standards.size)
      end
    end
  end
end
