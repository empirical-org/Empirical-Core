require 'rails_helper'
require "cancan/matchers"

describe "User", :type => :model do
  describe "abilities" do
    subject(:ability) { Ability.new(user) }
    let(:user) { nil }

    context "when an admin" do
      let(:user) { FactoryGirl.build(:admin) }

      it { is_expected.to be_able_to(:manage, ActivitySession.new) }
      it { is_expected.to be_able_to(:manage, User.new) }
    end

    context "when a teacher" do
      let(:user) { FactoryGirl.build(:teacher) }

      it { is_expected.to be_able_to(:create, Classroom.new) }
    end

    context "when a user" do
      let(:user) { FactoryGirl.build(:user) }

      it { is_expected.to be_able_to(:read, ActivitySession.new(user_id: user.id)) }
      it { is_expected.to be_able_to(:create, ActivitySession.new) }
    end
  end
end
