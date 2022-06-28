# frozen_string_literal: true

require 'rails_helper'

module Cms
  describe SchoolSubscriptionsUpdater do
    let(:subscription) { create(:subscription) }
    let(:school1) { create(:school) }
    let(:school2) { create(:school) }

    let(:schools) do
      [
        { id: school1.id, name: school1.name, checked: school1_checked},
        { id: school2.id, name: school2.name, checked: school2_checked}
      ]
    end

    subject { described_class.run(subscription, schools) }

    context 'school1 checked' do
      let(:school1_checked) { true }

      context 'school2 checked' do
        let(:school2_checked) { true }

        context 'school1 has subscription' do
          before { create(:school_subscription, subscription: subscription, school: school1)}

          context 'school2 has subscription' do
            before { create(:school_subscription, subscription: subscription, school: school2)}

            it { expect { subject }.not_to change(SchoolSubscription, :count).from(2) }
          end

          context 'school2 has no subscription' do
            it { expect { subject }.to change(SchoolSubscription, :count).from(1).to(2) }
          end
        end

        context 'school1 has no subscription' do
          context 'school2 has subscription' do
            before { create(:school_subscription, subscription: subscription, school: school2)}

            it { expect { subject }.to change(SchoolSubscription, :count).from(1).to(2) }
          end

          context 'school2 has no subscription' do
            it { expect { subject }.to change(SchoolSubscription, :count).from(0).to(2) }
          end
        end
      end

      context 'school2 unchecked' do
        let(:school2_checked) { false }

        context 'school1 has subscription' do
          before { create(:school_subscription, subscription: subscription, school: school1)}

          context 'school2 has subscription' do
            before { create(:school_subscription, subscription: subscription, school: school2)}

            it { expect { subject }.to change(SchoolSubscription, :count).from(2).to(1) }
          end

          context 'school2 has no subscription' do
            it { expect { subject }.not_to change(SchoolSubscription, :count) }
          end
        end

        context 'school1 has no subscription' do
          context 'school2 has subscription' do
            before { create(:school_subscription, subscription: subscription, school: school2)}

            it { expect { subject }.not_to change(SchoolSubscription, :count) }
          end

          context 'school2 has no subscription' do
            it { expect { subject }.to change(SchoolSubscription, :count).from(0).to(1) }
          end
        end
      end
    end

    context 'school1 unchecked' do
      let(:school1_checked) { false }

      context 'school2 unchecked' do
        let(:school2_checked) { false }

        context 'school1 has subscription' do
          before { create(:school_subscription, subscription: subscription, school: school1)}

          context 'school2 has subscription' do
            before { create(:school_subscription, subscription: subscription, school: school2)}

            it { expect { subject }.to change(SchoolSubscription, :count).from(2).to(0) }
          end

          context 'school2 has no subscription' do
            it { expect { subject }.to change(SchoolSubscription, :count).from(1).to(0) }
          end
        end

        context 'school1 has no subscription' do
          context 'school2 has subscription' do
            before { create(:school_subscription, subscription: subscription, school: school2)}

            it { expect { subject }.to change(SchoolSubscription, :count).from(1).to(0) }
          end

          context 'school2 has no subscription' do
            it { expect { subject }.not_to change(SchoolSubscription, :count) }
          end
        end
      end
    end

    context 'school1 has users' do
      before do
        create(:schools_users, school: school1)
        create(:school_subscription, subscription: subscription, school: school1)
      end

      context 'school1 unchecked' do
        let(:school1_checked) { false }
        let(:school2_checked) { true }

        it { expect { subject }.to change(UserSubscription, :count).from(1).to(0) }
      end

      context 'school1 checked' do
        let(:school1_checked) { true }
        let(:school2_checked) { true }

        it { expect { subject }.not_to change(UserSubscription, :count) }
      end
    end
  end
end
