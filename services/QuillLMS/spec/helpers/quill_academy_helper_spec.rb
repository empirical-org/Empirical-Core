# frozen_string_literal: true

require 'rails_helper'

describe QuillAcademyHelper do
  let!(:user) { create(:user) }
  let!(:school) { create(:school) }
  let!(:school_with_no_subscription) { create(:school) }
  let!(:subscription) { create(:subscription)}
  let!(:school_subscription) { create(:school_subscription, school: school, subscription: subscription) }

  before { allow(helper).to receive(:current_user) { user } }

  describe '#should_render_quill_academy_button' do

    context 'app setting enabled' do
      let!(:app_setting) { create(:app_setting, name: 'quill_academy', enabled: true, user_ids_allow_list: [user.id])}

      it 'should return true' do
        expect(helper.should_render_quill_academy_button).to eq(true)
      end
    end

    context 'with app setting disabled or user_id not in allow_list' do
      let(:app_setting) { create(:app_setting, name: 'quill_academy', enabled: false, user_ids_allow_list: [user.id])}

      it 'should return false if app setting is disabled' do
        expect(helper.should_render_quill_academy_button).to eq(false)
      end

      it 'should return false if app setting is enabled but user_id is not in allow_list' do
        app_setting.enabled = true
        app_setting.user_ids_allow_list = []
        app_setting.save!
        expect(helper.should_render_quill_academy_button).to eq(false)
      end
    end
  end

  # rubocop:disable Layout/AssignmentIndentation
  describe '#quill_academy_info_section' do
    context 'is school or district premium user' do
      it 'should return the expected string' do
        user.school = school
        user.save!
        expected_string =
        "<div class='quill-academy-button-or-info-section'>
        <img src='https://assets.quill.org/images/quill_academy/quill-academy-icon.svg'></img>
        <h2>Quill Academy</h2>
        <p class='subheader'>Access a growing library of self-paced training courses and resources to help you become a <u>Quill.org</u> expert and writing pedagogue.</p>
        <button class='quill-button primary contained medium focus-on-light disabled' disabled>Coming Soon</button>
      </div>"
        expect(helper.quill_academy_info_section).to eq(expected_string)
      end
    end

    context 'is not school or district premium user' do
      it 'should return the expected string' do
        user.school = school_with_no_subscription
        user.save!
        expected_string =
        "<div class='quill-academy-button-or-info-section'>
        <img src='https://assets.quill.org/images/quill_academy/quill-academy-icon.svg'></img>
        <h2>Quill Academy</h2>
        <p class='subheader'>Access a growing library of self-paced training courses and resources to help you become a <u>Quill.org</u> expert and writing pedagogue.</p>
        <a class='quill-button primary contained medium focus-on-light' href='/premium' tabIndex=0 target='_blank'>Learn more about Premium</a>
      </div>"
        expect(helper.quill_academy_info_section).to eq(expected_string)
      end
    end
  end

  describe '#quill_academy_availability_disclaimer' do
    context 'is school or district premium user' do
      it 'should return the expected string' do
        user.school = school
        user.save!
        expected_string =
        "<div class='availability-disclaimer accessible'>
        <i class='fas fa-icon fa-check-circle'></i>
        <p>You have access to Quill Academy through a School Premium or District Premium subscription.<p>
      </div>"
        expect(helper.quill_academy_availability_disclaimer).to eq(expected_string)
      end
    end

    context 'is not school or district premium user' do
      it 'should return the expected string' do
        user.school = school_with_no_subscription
        user.save!
        expected_string =
        "<div class='availability-disclaimer restricted'>
        <i class='fas fa-icon fa-exclamation-circle'></i>
        <p>Quill Academy and Quill's Professional Development are included in School Premium and District Premium subscriptions.<p>
      </div>"
        expect(helper.quill_academy_availability_disclaimer).to eq(expected_string)
      end
    end
  end
  # rubocop:enable Layout/AssignmentIndentation
end
