require 'rails_helper'

describe SchoolSubscription, type: :model do

  context "validates" do

    let!(:school_sub) {FactoryGirl.create(:school_subscription)}

    describe "uniqueness of" do

      it "school_id" do
        expect{SchoolSubscription.create(subscription_id: 2, school_sub: school_sub.school_id)}.to raise_error
      end
    end

    describe "presence of" do
      it "school_id" do
        expect{school_sub.update!(school_id: nil)}.to raise_error
      end

      it "user_id" do
        expect{school_sub.update!(user_id: nil)}.to raise_error
      end
    end

  end

end
