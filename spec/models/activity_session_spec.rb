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

  describe "#classroom" do 
  	it "must return a valid classroom object"
  end

  describe "#percentage_color" do   

  	it "must returns an empty string if not completed" do 
  		activity_session.completed_at=nil
  		expect(activity_session.percentage_color).to eq ''
  	end  

  	it "must returns a color if completed" do 
  		expect(activity_session.percentage_color).to be_present
  	end  

  	context "when completed" do  

  		it "must returns yellow if 50% completed" do 
  			expect(activity_session.percentage_color).to eq "yellow"
  		end  

  		it "must returns green if 76% completed" do 
  			activity_session.percentage=0.76
  			expect(activity_session.percentage_color).to eq "green"
  		end  

  		it "must returns red if 25% completed" do 
  			activity_session.percentage=0.25
  			expect(activity_session.percentage_color).to eq "red"
  		end			  

  	end  

  end


  describe "#activity_uid=" do 

  	let(:activity){ FactoryGirl.create(:activity) }

  	it "must associate activity by uid" do 
  		activity_session.activity_id=nil
  		activity_session.activity_uid=activity.uid
  		expect(activity_session.activity_id).to eq activity.id
  	end

  end

  describe "#activity_uid" do 

  	it "must returns an uid when activity is present" do 
  		expect(activity_session.activity_uid).to be_present
  	end

  end

  describe "#completed?" do 

  	it "must be true when completed_at is present" do 
  		expect(activity_session).to be_completed
  	end

  	it "must be false when copleted_at is not present" do
  		activity_session.completed_at=nil
  		expect(activity_session).to_not be_completed
  	end

  end

  #--- legacy methods

  describe "#grade" do 

  	it "must be equal to percentage" do 
  		expect(activity_session.grade).to eq activity_session.percentage
  	end

  end 

  describe "#owner" do 

  	it "must be equal to user" do 
  		expect(activity_session.owner).to eq activity_session.user
  	end

  end

  describe "#anonymous=" do 

  	it "must be equal to temporary" do 
  		expect(activity_session.anonymous=true).to eq activity_session.temporary
  	end

  	it "must returns temporary" do 
  		activity_session.anonymous=true
  		expect(activity_session.anonymous).to eq activity_session.temporary
  	end
  end

  describe "#owned_by?" do

  	let(:user) {FactoryGirl.build(:user)}

  	it "must return true if temporary true" do 
  		activity_session.temporary=true
  		expect(activity_session.owned_by? user).to be_truthy
  	end

  	it "must be true if temporary false and user eq owner" do 
  		expect(activity_session.owned_by? activity_session.user).to eq true
  	end

  end

end
