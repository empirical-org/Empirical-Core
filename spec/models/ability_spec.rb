require "cancan/matchers"

describe "User" do
  describe "abilities" do
    subject(:ability) { Ability.new(user) }
    let(:user) { nil }

    context "when an admin" do
      let(:user) { build(:admin) }

      it { should be_able_to(:manage, ActivitySession.new) }
      it { should be_able_to(:manage, User.new) }
    end

    context "when a teacher" do
      let(:user) { build(:teacher) }

      it { should be_able_to(:create, Classroom.new) }
    end

    context "when a user" do
      let(:user) { build(:user) }

      it { should be_able_to(:read, ActivitySession.new(user_id: user.id)) }
      it { should be_able_to(:create, ActivitySession.new) }
    end
  end
end
