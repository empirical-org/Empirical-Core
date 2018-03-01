require 'rails_helper'

describe SchoolSubscription, type: :model do
  it { should validate_presence_of(:school_id) }
  it { should validate_presence_of(:subscription_id) }

  it { should belong_to(:school) }
  it { should belong_to(:subscription) }
  it { is_expected.to callback(:update_schools_users).after(:commit) }
  it { is_expected.to callback(:send_premium_emails).after(:create) }


let!(:school_sub) {create(:school_subscription)}

  context "update_or_create" do
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
    let(:user) { create(:user) }
    let!(:queens_school) { create :school, name: "Queens Charter School", zipcode: '11385', users: [user]}
    let!(:queens_teacher) { create(:teacher, school: queens_school) }
    let!(:subscription) {create(:subscription)}
    let!(:school_sub) {create(:school_subscription, subscription_id: subscription.id, school_id: queens_school.id)}


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

    it "update or create the user subscription" do
      expect(UserSubscription).to receive(:update_or_create).with(user.id, subscription.id)
      school_sub.update_schools_users
    end
  end

  describe "#send premium emails" do
    let!(:queens_school) { create :school, name: "Queens Charter School", zipcode: '11385'}
    let!(:queens_teacher) { create(:teacher, school: queens_school, email: "test@quill.org") }
    let!(:subscription) {create(:subscription)}
    let!(:school_subscription) {create(:school_subscription, subscription_id: subscription.id, school_id: queens_school.id)}

    it 'should kick off background job to send premium school subscription email' do
      expect{ school_subscription.send_premium_emails }.to change(PremiumSchoolSubscriptionEmailWorker.jobs, :size).by 1
    end
  end

end
