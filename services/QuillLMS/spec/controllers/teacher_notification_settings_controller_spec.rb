# frozen_string_literal: true

require 'rails_helper'

describe TeacherNotificationSettingsController do
  let!(:teacher) { create(:teacher) }
  let(:notification_type) { TeacherNotification::STUDENT_COMPLETED_DIAGNOSTIC }

  before do
    # New users default with some of these on, but we want to test cases where
    # a user has none set
    TeacherNotificationSetting.all.destroy_all
    allow(controller).to receive(:current_user).and_return(teacher)
  end

  describe '#activate' do
    it 'should create a new TeacherNotificationSetting when called' do
      expect do
        post :activate, params: { notification_type: notification_type }

        expect(response.status).to be(200)

        expect(TeacherNotificationSetting.find_by(user: teacher, notification_type: notification_type)).to be
      end.to change(TeacherNotificationSetting, :count).by(1)
    end

    it 'should count as a success if a unique user-setting combination already exists' do
      create(:teacher_notification_setting, user: teacher, notification_type: notification_type)

      expect do
        post :activate, params: { notification_type: notification_type }

        expect(response.status).to be(200)

        expect(TeacherNotificationSetting.find_by(user: teacher, notification_type: notification_type)).to be
      end.not_to change(TeacherNotificationSetting, :count)
    end

    it 'should return a 400 if the notification_setting value passed in is not valid' do
      post :activate, params: { notification_type: 'SOME_NONSENSE' }

      expect(response.status).to be(400)

      expect(JSON.parse(response.body)['errors']).to include('notification_type')
    end
  end

  describe '#deactivate' do
    it 'should remove the matching TeacherNotificationSetting when called' do
      create(:teacher_notification_setting, user: teacher, notification_type: notification_type)

      expect do
        post :deactivate, params: { notification_type: notification_type }

        expect(response.status).to be(200)

        expect(TeacherNotificationSetting.find_by(user: teacher, notification_type: notification_type)).not_to be
      end.to change(TeacherNotificationSetting, :count).by(-1)
    end

    it 'should count as a success if the specified record already does not exist' do
      expect do
        post :deactivate, params: { notification_type: notification_type }

        expect(response.status).to be(200)

        expect(TeacherNotificationSetting.find_by(user: teacher, notification_type: notification_type)).not_to be
      end.not_to change(TeacherNotificationSetting, :count)

    end
  end
end
