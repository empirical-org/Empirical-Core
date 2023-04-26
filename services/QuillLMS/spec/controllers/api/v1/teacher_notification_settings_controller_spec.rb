# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::TeacherNotificationSettingsController do
  let!(:teacher) { create(:teacher) }
  let(:notification_type) { TeacherNotification::StudentCompletedDiagnostic }
  let(:notification_type_name) { notification_type.name }

  before do
    # New users default with some of these on, but we want to test cases where
    # a user has none set
    TeacherNotificationSetting.all.destroy_all
    allow(controller).to receive(:current_user).and_return(teacher)
  end

  describe '#index' do
    it 'should include all notification_types' do
      get :index

      expect(JSON.parse(response.body).keys).to eq(TeacherNotificationSetting.notification_types)
    end

    it 'should set values to true for notification_types with saved settings' do
      create(:teacher_notification_setting, user: teacher, notification_type: notification_type)

      get :index

      expect(JSON.parse(response.body)[notification_type_name]).to be(true)
    end

    it 'should set values to false for notification_types without saved settings' do
      get :index

      expect(JSON.parse(response.body)[notification_type_name]).to be(false)
    end
  end

  describe '#bulk_update' do
    it 'should create new settings when passed in via key with a value of true' do
      expect do
        post :bulk_update, params: { notification_types: { notification_type_name => true } }

        expect(response.status).to eq(200)
      end.to change(TeacherNotificationSetting, :count).by(1)
    end

    it 'should not create a new setting when passed a value of true for a setting that is already set' do
      create(:teacher_notification_setting, user: teacher, notification_type: notification_type)

      expect do
        post :bulk_update, params: { notification_types: { notification_type_name => true } }

        expect(response.status).to eq(200)
      end.not_to change(TeacherNotificationSetting, :count)
    end

    it 'should delete settings when passed in via key with a value of false' do
      create(:teacher_notification_setting, user: teacher, notification_type: notification_type)

      expect do
        post :bulk_update, params: { notification_types: { notification_type_name => false } }

        expect(response.status).to eq(200)
      end.to change(TeacherNotificationSetting, :count).by(-1)
    end

    it 'should not delete anything when a setting does not exist and its key has a value of false' do
      expect do
        post :bulk_update, params: { notification_types: { notification_type_name => false } }

        expect(response.status).to eq(200)
      end.not_to change(TeacherNotificationSetting, :count)
    end

    it 'should only make changes if no changes error' do
      create(:teacher_notification_setting, user: teacher, notification_type: notification_type)
      expect(TeacherNotificationSetting).to receive(:create!).and_raise(ActiveRecord::RecordInvalid)

      expect do
        post :bulk_update, params: { notification_types: { notification_type_name => false, TeacherNotification::StudentCompletedAllAssignedActivities.name => true } }

        expect(response.status).to eq(400)
      end.not_to change(TeacherNotificationSetting, :count)      
    end
  end
end
