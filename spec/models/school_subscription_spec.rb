require 'rails_helper'

describe SchoolSubscription, type: :model do

let!(:school_sub) {FactoryBot.create(:school_subscription)}

  context "validates" do

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

  context "#SchoolSubscription.update_or_create" do
    it "updates existing SchoolSubscriptions to the new subscription_id" do
      SchoolSubscription.update_or_create(school_sub.school_id, 11)
      expect(school_sub.reload.subscription_id).to eq(11)
    end

    it "creates new UserSubscriptions with the passed subscription_id and user_id" do
      SchoolSubscription.update_or_create(99, 11)
      new_school_sub = SchoolSubscription.last
      expect([ new_school_sub.school_id,  new_school_sub.subscription_id]).to eq([99,11])
    end
  end


  context '#update_schools_users' do
    let!(:queens_school) { FactoryBot.create :school, name: "Queens Charter School", zipcode: '11385'}
    let!(:queens_teacher) { FactoryBot.create(:teacher, school: queens_school) }
    let!(:subscription) {FactoryBot.create(:subscription)}
    let!(:school_sub) {FactoryBot.create(:school_subscription, subscription_id: subscription.id, school_id: queens_school.id)}


    it "connects a premium account to school's users if they do not have one" do
      expect(queens_teacher.subscription).to eq(nil)
      school_sub.update_schools_users
      expect(queens_teacher.reload.subscription).to eq(school_sub.subscription)
    end

    it "connects a new premium account to school's users if they do have one" do
      old_sub = Subscription.create_or_update_with_user_join(queens_teacher.id, {account_type: 'paid', account_limit: 1000})
      expect(queens_teacher.reload.subscription).to eq(old_sub)
      school_sub.update_schools_users
      expect(queens_teacher.reload.subscription).to eq(school_sub.subscription)
    end
  end

end
