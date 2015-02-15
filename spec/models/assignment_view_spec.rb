require 'rails_helper'

describe AssignmentView, :type => :model do

  	let!(:activity){ FactoryGirl.create(:activity) }  
  	let!(:student){ FactoryGirl.create(:student) }   	
	let(:assignment_view){ FactoryGirl.create(:assignment_view, activity_id: activity.id, classroom_id: student.classroom.id)}

	describe "#choose_everyone" do 

		context "when there aren't assigned students" do 

			it "must return true" do 
				expect(assignment_view.choose_everyone).to be_truthy
			end

		end

		context "when there is at least one assigned student" do 

			let(:assignment_view){ FactoryGirl.build(:assignment_view, assigned_student_ids: [student.id])} 

			it "must return false if" do 
				expect(assignment_view.choose_everyone).to be_falsy
			end
		end
	end

	describe "#assigned_student_ids=" do 

		it "must set the assigned student ids" do 
			expect(assignment_view.assigned_student_ids=[student.id]).to eq [student.id]
		end

	end

	describe "#choose_everyone=" do 

		let(:assignment_view){ FactoryGirl.build(:assignment_view, assigned_student_ids: [student.id])} 

		it "must free assigned_student_ids if 1 as arg" do 

			assignment_view.choose_everyone='1'
			expect(assignment_view.assigned_student_ids).to be_nil

		end

		it "must not free assigned_student_ids arg is different to 1" do 

			assignment_view.choose_everyone='abc'
			expect(assignment_view.assigned_student_ids).to_not be_nil
		end			

	end

end
