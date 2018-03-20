require 'rails_helper'

describe 'SalesContactUpdater' do
  before { Timecop.freeze }
  after { Timecop.return }

  it 'updates the sales stage for a user' do
    user = create(:user, role: 'teacher')

    SalesContactUpdater.new(user.id, 'Basic Subscription').update

    stage = SalesStage.joins(:sales_stage_type)
      .where('sales_stage_types.name = ?', 'Basic Subscription')
      .first

    expect(stage).to have_attributes(completed_at: Time.now)
  end

  it 'adds a reference to the current user to the updated sales stage' do
    staff = create(:user, role: 'staff')
    user = create(:user, role: 'teacher')

    SalesContactUpdater.new(user.id, 'Basic Subscription', staff).update

    stage = SalesStage.joins(:sales_stage_type)
      .where('sales_stage_types.name = ?', 'Basic Subscription')
      .first

    expect(stage).to have_attributes(user: staff)
  end

  it 'informs external CMS of an update' do
    user           = create(:user, role: 'teacher')
    notifier       = double('cms_notifier')
    notifier_class = double('cms_notifier_class', new: notifier)

    expect(notifier_class).to receive(:new).with(user.id, 'Basic Subscription')
    expect(notifier).to receive(:track)

    SalesContactUpdater.new(user.id, 'Basic Subscription', nil, notifier_class).update
  end
end
