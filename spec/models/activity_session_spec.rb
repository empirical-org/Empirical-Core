require 'spec_helper'


describe ActivitySession, :type => :model do

  describe "can behave lika an uid class" do 

    context "when behaves like uid" do
      it_behaves_like "uid"
    end

  end

  let(:activity_session) {FactoryGirl.build(:activity_session)}

  describe "#activity" do 

  	context "when there is one direct association from activity" do

	  	let(:activity){ FactoryGirl.create(:activity) }
		let(:activity_session){ FactoryGirl.build(:activity_session,activity_id: activity.id) }  	
	  	
		it "must return the direct associated activity" do 
			expect(activity_session.activity).to eq activity
		end	

	end

	context "when there is not any activity but there is a classroom activity" do 
	    let!(:activity){ FactoryGirl.create(:activity) }  
	    let!(:student){ FactoryGirl.create(:student) }   	
	    let!(:classroom_activity) { FactoryGirl.create(:classroom_activity, activity_id: activity.id, classroom_id: student.classroom.id) }
		let(:activity_session){   FactoryGirl.build(:activity_session, classroom_activity_id: classroom_activity.id)                     }
		it "must return the classroom activity" do 
			activity_session.activity_id=nil
			expect(activity_session.activity).to eq activity_session.classroom_activity.activity
		end

	end

  end

end
