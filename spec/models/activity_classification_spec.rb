require 'rails_helper'

describe ActivityClassification, type: :model do

	let(:activity_classification){FactoryGirl.build(:activity_classification) }
	let(:activity_classification_2){FactoryGirl.build(:activity_classification) }
	let(:activity_classification_3){FactoryGirl.build(:activity_classification) }

  let!(:teacher_with_activities){ FactoryGirl.create(:teacher_with_students_with_activities) }
	let!(:classroom_activity_1){FactoryGirl.create(:classroom_activity, classroom_id: teacher_with_activities.classrooms_i_teach.first.id, activity_id: Activity.first.id)}
	let!(:teacher_without_activities){FactoryGirl.create(:teacher)}


	describe "can act as an uid class" do

	  context "when behaves like uid" do
	    it_behaves_like "uid"
	  end

	end

	describe '#self.types_teacher_has_assigned' do
		it "returns empty array when the teacher has no activities" do
			expect(ActivityClassification.types_teacher_has_assigned(teacher_without_activities.id)).to be_empty
		end

		it "does not return an empty array when the has activities" do
			expect(ActivityClassification.types_teacher_has_assigned(teacher_with_activities.id)).not_to be_empty
		end

		it "returns the ids of the types of activities the teacher has assigned" do
			expect(ActivityClassification.types_teacher_has_assigned(teacher_with_activities.id)).to eq([Activity.first.activity_classification_id])
		end
	end

	context "when it runs validations" do

		it "must be valid with valid info" do
			expect(activity_classification).to be_valid
		end

		context "when it fails because" do

			describe "#key" do

				it "must be present" do
					activity_classification.key=nil
					activity_classification.valid?
					expect(activity_classification.errors[:key]).to include "can't be blank"
				end

				it "must be unique" do
					activity_classification.save!
					second=FactoryGirl.build(:activity_classification, key: activity_classification.key)
					second.valid?
					expect(second.errors[:key]).to include "has already been taken"
				end
			end
		end
	end


end
