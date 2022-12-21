# frozen_string_literal: true

require 'rails_helper'

describe InternalTool::AdminAccountCreatedEmailWorker, type: :worker do
  let!(:teacher) { create(:teacher) }
  let!(:school) { create(:school) }
  let!(:mailer_user) { Mailer::User.new(teacher) }
  let!(:mailer_class)  { InternalToolUserMailer }
  let!(:mailer_method) { :admin_account_created_email}
  let!(:worker) { InternalTool::AdminAccountCreatedEmailWorker.new }
  let!(:analytics) { double(:analytics).as_null_object }

  before do
    allow(mailer_class).to receive(mailer_method).with(mailer_user, school.name).and_return(double(:email, deliver_now!: true))
    allow(teacher).to receive(:mailer_user).and_return(mailer_user)
    allow(SegmentAnalytics).to receive(:new) { analytics }
  end

  it 'should send the mail with user mailer' do
    expect(mailer_class).to receive(mailer_method).with(mailer_user, school.name)
    worker.perform(teacher.id, school.id)
  end
end
