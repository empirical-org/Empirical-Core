require 'spec_helper'

describe Activity, :type => :model do

  let!(:activity){ FactoryGirl.build(:activity) }  

  context "when classification_key" do 
  	describe "#classification_key="
	  it "must set classification relationship" do 
  	  	activity.classification=nil
	  	expect(activity.classification).to_not be_present
	  	expect(activity.classification_key=ActivityClassification.first.key || FactoryGirl.create(:classification).key).to be_present
	  end

  	describe "#classification_key"
  	  before do 
  	  	activity.classification=nil
  	  	activity.classification_key=ActivityClassification.first.key || FactoryGirl.create(:classification).key
  	  end
	  it "must set classification relationship" do 
	  	expect(activity.classification_key).to be_present
	  end	  
  end


  describe "#form_url" do 

    it "must not include uid if hasn't been validated" do 
      expect(activity.form_url).not_to include "uid="
    end

    it "must include uid after validate" do 
      expect(activity).to be_valid
      expect(activity.form_url).to include "uid="
    end
  end

  describe "#module_url" do 
    let!(:student){ FactoryGirl.build(:student) }    
    it "must add anonymouse param if arg is included" do 
      expect(activity.module_url( :anonymous ) ).to include "anonymous=true"
    end
    it "must add uid param of it's a valid student session" do 
      expect(activity).to be_valid
      expect(activity.module_url student.activity_sessions.build()).to include "uid="
      
    end
    it "must add student param of it's a valid student session" do 
      expect(activity).to be_valid
      expect(activity.module_url student.activity_sessions.build()).to include "student"
    end
  end

  describe "#flag" do 
    
    it "must be nil if has not been set" do 
      expect(activity.flag).to be_nil
    end

    it "must has a setter" do 
      expect(activity.flag=:alpha).to eq :alpha
    end

    context "when is set it must preserve the value" do 
      before do
        activity.flag=:alpha
      end
      it "must returns the correct value" do 
        expect(activity.flag).to eq :alpha
      end
    end

  end

  describe "can behave like a flagged model" do

    context "when behaves like flagged" do
      it_behaves_like "flagged"
    end

  end  


end
