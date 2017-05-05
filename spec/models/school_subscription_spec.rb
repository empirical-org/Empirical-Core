require 'rails_helper'

describe SchoolSubscription, type: :model do
let!(:school_sub) {FactoryGirl.create(:school_subscription)}

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

  context "SchoolSubscription.update_or_create" do
    it "updates existing SchoolSubscriptions to the new subscription_id" do
      SchoolSubscription.update_or_create(school_sub.id, 11)
      expect(school_sub.reload.subscription_id).to eq(11)
    end

    it "creates new UserSubscriptions with the passed subscription_id and user_id" do
      SchoolSubscription.update_or_create(99, 11)
      new_school_sub = SchoolSubscription.last
      expect([ new_school_sub.school_id,  new_school_sub.subscription_id]).to eq([99,11])
    end
  end

end
