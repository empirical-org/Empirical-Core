# frozen_string_literal: true

require 'rails_helper'

class FakeController < ApplicationController
  include DemoAccountBannerLinkGenerator
end

describe FakeController, type: :controller do

  describe 'link generation methods' do
    let!(:classroom) { create(:classroom, name: DemoAccountBannerLinkGenerator::DEMO_ACCOUNT_CLASSROOM_NAME ) }
    let!(:owner) { classroom.owner }
    let!(:post_test_activity) { create(:diagnostic_activity) }
    let!(:pre_test_activity) { create(:diagnostic_activity, id: Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID, follow_up_activity_id: post_test_activity.id )}
    let!(:pre_test_unit) { create(:unit, user_id: owner.id) }
    let!(:pre_test_unit_activity) { create(:unit_activity, unit: pre_test_unit, activity: pre_test_activity) }
    let!(:pre_test_classroom_unit) { create(:classroom_unit, classroom: classroom, unit: pre_test_unit)}
    let!(:post_test_unit) { create(:unit, user_id: owner.id) }
    let!(:post_test_unit_activity) { create(:unit_activity, unit: post_test_unit, activity: post_test_activity) }
    let!(:post_test_classroom_unit) { create(:classroom_unit, classroom: classroom, unit: post_test_unit)}


    before do
      session[:user_id] = owner.id
    end

    describe '#demo_account_recommendations_link' do
      it 'should return the correct link if the classroom exists' do
        expect(controller.demo_account_recommendations_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics/#{pre_test_activity.id}/classroom/#{classroom.id}/recommendations")
      end

      it 'should return the diagnostic reports index link if the classroom does not exist' do
        classroom.destroy
        expect(controller.demo_account_recommendations_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

      it 'should return the diagnostic reports index link if the pre test activity does not exist' do
        pre_test_activity.destroy
        expect(controller.demo_account_recommendations_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

      it 'should return the diagnostic reports index link if the pre test unit activity does not exist' do
        pre_test_unit_activity.destroy
        expect(controller.demo_account_recommendations_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

      it 'should return the diagnostic reports index link if the pre test classroom unit does not exist' do
        pre_test_classroom_unit.destroy
        expect(controller.demo_account_recommendations_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

    end

    describe '#demo_account_growth_summary_link' do
      it 'should return the correct link if the classroom exists' do
        expect(controller.demo_account_growth_summary_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics/#{post_test_activity.id}/classroom/#{classroom.id}/growth_summary")
      end

      it 'should return the diagnostic reports index link if the classroom does not exist' do
        classroom.destroy
        expect(controller.demo_account_growth_summary_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

      it 'should return the diagnostic reports index link if the post test activity does not exist' do
        post_test_activity.destroy
        expect(controller.demo_account_growth_summary_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

      it 'should return the diagnostic reports index link if the post test unit activity does not exist' do
        post_test_unit_activity.destroy
        expect(controller.demo_account_growth_summary_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end

      it 'should return the diagnostic reports index link if the post test classroom unit does not exist' do
        post_test_classroom_unit.destroy
        expect(controller.demo_account_growth_summary_link).to eq("#{teachers_progress_reports_diagnostic_reports_path}#diagnostics")
      end
    end

  end
end
