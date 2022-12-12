# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mailer::User do
  let(:user) { create(:user) }
  let(:mailer_user) { Mailer::User.new(user) }
  let(:admin_user) { create(:user) }
  let(:school) { create(:school) }
  let(:new_school) { create(:school) }
  let(:existing_school) { create(:school) }
  let(:district) { create(:district) }

  before do
    allow(mailer_class).to receive(mailer_method).and_return(double(:email, deliver_now!: true))
    allow(user).to receive(:mailer_user).and_return(mailer_user)
  end

  context 'Admin Dashboard' do
    let(:mailer_class)  { AdminDashboardUserMailer }

    describe '#send_admin_dashboard_teacher_account_created_email' do
      let(:mailer_method) { :teacher_account_created_email}

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, admin_user.name, school.name, true)
        user.mailer_user.send_admin_dashboard_teacher_account_created_email(admin_user.name, school.name, true)
      end
    end

    describe '#send_admin_dashboard_admin_account_created_email' do
      let(:mailer_method) { :admin_account_created_email}

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, admin_user.name, school.name, true)
        user.mailer_user.send_admin_dashboard_admin_account_created_email(admin_user.name, school.name, true)
      end
    end

    describe '#send_admin_dashboard_teacher_link_school_email' do
      let(:mailer_method) { :teacher_link_school_email}

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, admin_user.name, school)
        user.mailer_user.send_admin_dashboard_teacher_link_school_email(admin_user.name, school)
      end
    end

    describe '#send_admin_dashboard_made_school_admin_email' do
      let(:mailer_method) { :made_school_admin_email}

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, admin_user.name, school.name)
        user.mailer_user.send_admin_dashboard_made_school_admin_email(admin_user.name, school.name)
      end
    end

    describe '#send_admin_dashboard_made_school_admin_link_school_email' do
      let(:mailer_method) { :made_school_admin_link_school_email}

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, admin_user.name, school.name)
        user.mailer_user.send_admin_dashboard_made_school_admin_link_school_email(admin_user.name, school.name)
      end
    end

    describe '#send_admin_dashboard_made_school_admin_change_school_email' do
      let(:mailer_method) { :made_school_admin_change_school_email}

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, admin_user.name, new_school, existing_school)
        user.mailer_user.send_admin_dashboard_made_school_admin_change_school_email(admin_user.name, new_school, existing_school)
      end
    end
  end

  context 'Internal Tools' do
    let(:mailer_class) { InternalToolUserMailer}

    describe '#send_internal_tool_admin_account_created_email' do
      let(:mailer_method) { :admin_account_created_email }

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, school.name)
        user.mailer_user.send_internal_tool_admin_account_created_email(school.name)
      end
    end

    describe '#send_internal_tool_made_school_admin_email' do
      let(:mailer_method) { :made_school_admin_email }

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, school.name)
        user.mailer_user.send_internal_tool_made_school_admin_email(school.name)
      end
    end

    describe '#send_internal_tool_made_school_admin_link_school_email' do
      let(:mailer_method) { :made_school_admin_link_school_email }

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, school.name)
        user.mailer_user.send_internal_tool_made_school_admin_link_school_email(school.name)
      end
    end

    describe '#send_internal_tool_made_school_admin_change_school_email' do
      let(:mailer_method) { :made_school_admin_change_school_email }

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, new_school, existing_school)
        user.mailer_user.send_internal_tool_made_school_admin_change_school_email(new_school, existing_school)
      end
    end

    describe '#send_internal_tool_district_admin_account_created_email' do
      let(:mailer_method) { :district_admin_account_created_email }

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, district.name)
        user.mailer_user.send_internal_tool_district_admin_account_created_email(district.name)
      end
    end

    describe '#send_internal_tool_made_district_admin_email' do
      let(:mailer_method) { :made_district_admin_email }

      it 'should send the mail with user mailer' do
        expect(mailer_class).to receive(mailer_method).with(user.mailer_user, district.name)
        user.mailer_user.send_internal_tool_made_district_admin_email(district.name)
      end
    end
  end
end
