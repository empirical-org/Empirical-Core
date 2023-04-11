# module QuillAcademyHelper
#   AVAILABLE = "Available now"
#   COMING_SOON = "Coming SY '22-'23"
#   JUMPSTART_WITH_QUILL = "Jump Start with Quill"
#   PLANNING_AND_IMPLEMENTING_A_DIAGNOSTICS_STRATEGY = "Planning & Implementing a Diagnostics Strategy"
#   QUILLS_INDEPENDENT_TOOLS = "Quill's Independent Tools: Grammar, Connect, & Proofreader"
#   USING_QUILL_LESSONS = "Using Quill Lessons"
#   USING_QUILL_READING_FOR_EVIDENCE = "Using Quill Reading for Evidence"
#   UNDERSTANDING_QUILL_DATA_REPORTS = "Understanding Quill Data Reports"
#   DATA_AND_INSTRUCTION_BEST_PRACTICES = "Data & Instruction Best Practices"
#   EXPLORING_THE_QUILL_ACTIVITY_LIBRARY = "Exploring the Quill Activity Library"
#   IMPROVING_SENTENCE_FLUENCY = "Improving Sentence Fluency"
#   ENCOURAGING_AND_EMPOWERING_YOUR_WRITERS = "Encouraging and Empowering Your Writers"
#   USING_QUILL_TO_SUPPORT_STUDENTS_EXCEPTIONAL_LEARNERS = "Using Quill to Support Students Exceptional Learners"
#   USING_QUILL_TO_SUPPORT_ENGLISH_LANGUAGE_LEARNERS = "Using Quill to Support English Language Learners"

#   COURSES = {
#     JUMPSTART_WITH_QUILL => {
#       header: JUMPSTART_WITH_QUILL,
#       text: "This course leads you through the initial set-up of your account and classes, understanding your dashboard, and the possibilities for future assignments."
#     },
#     PLANNING_AND_IMPLEMENTING_A_DIAGNOSTICS_STRATEGY => {
#       header: PLANNING_AND_IMPLEMENTING_A_DIAGNOSTICS_STRATEGY,
#       text: "Learn how to create and launch a strong diagnostic strategy that helps you identify and target student grammar needs. This course covers the selection and administering of a diagnostic, plus the interpreting and action on the diagnostic results."
#     },
#     QUILLS_INDEPENDENT_TOOLS => {
#       header: QUILLS_INDEPENDENT_TOOLS,
#       text: "Learn more about our independent activity grammar tools that unlock the power of feedback."
#     },
#     USING_QUILL_LESSONS => {
#       header: USING_QUILL_LESSONS,
#       text: "Learn more about Quill Lessons which is our interactive writing tool that helps teachers lead students through live grammar lessons. In this course, you will learn how to use and implement the tool to maximize group learning."
#     },
#     USING_QUILL_READING_FOR_EVIDENCE => {
#       header: USING_QUILL_READING_FOR_EVIDENCE,
#       text: "Learn more about Quill Reading for Evidence which provides students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking."
#     },
#     UNDERSTANDING_QUILL_DATA_REPORTS => {
#       header: UNDERSTANDING_QUILL_DATA_REPORTS,
#       text: "Quill offers a range of student data reports to help you make sense of student performance. In this course, you will learn how to navigate these reports."
#     },
#     DATA_AND_INSTRUCTION_BEST_PRACTICES => {
#       header: DATA_AND_INSTRUCTION_BEST_PRACTICES,
#       text: "Explore strategies to intentionally embed Quill into your instructional plans and the data reports that can provide immediate insight into student learning."
#     },
#     EXPLORING_THE_QUILL_ACTIVITY_LIBRARY => {
#       header: EXPLORING_THE_QUILL_ACTIVITY_LIBRARY,
#       text: "Explore the different pathways to assigning the just-right content to your students, including pre-made activity packs and curating your own packs using the Quill activity library."
#     },
#     IMPROVING_SENTENCE_FLUENCY => {
#       header: IMPROVING_SENTENCE_FLUENCY,
#       text: "Explore ways to expand students' work on the Quill platform to improve their sentence fluency in their writing beyond Quill."
#     },
#     ENCOURAGING_AND_EMPOWERING_YOUR_WRITERS => {
#       header: ENCOURAGING_AND_EMPOWERING_YOUR_WRITERS,
#       text: "Explore ways to encourage and increase students' writing self-efficacy using Quill's tools beyond extrinsic carrot-and-stick approaches."
#     },
#     USING_QUILL_TO_SUPPORT_STUDENTS_EXCEPTIONAL_LEARNERS => {
#       header: USING_QUILL_TO_SUPPORT_STUDENTS_EXCEPTIONAL_LEARNERS,
#       text: "Learn how to modify Quill's learning plans for your students with IEPs, provide targeted support, and track students' growth and progress."
#     },
#     USING_QUILL_TO_SUPPORT_ENGLISH_LANGUAGE_LEARNERS => {
#       header: USING_QUILL_TO_SUPPORT_ENGLISH_LANGUAGE_LEARNERS,
#       text: "Explore Quill's content created specifically for English Language Learners and learn strategies to utilize these resources to support students' written language acquisition."
#     }
#   }

#   def should_render_quill_academy_button
#     quill_academy_feature_flag = AppSetting.where(name: 'quill_academy')&.first
#     current_user && quill_academy_feature_flag && quill_academy_feature_flag.enabled && quill_academy_feature_flag.user_ids_allow_list.include?(current_user.id)
#   end

#   def quill_academy_info_section
#     if current_user&.has_school_or_district_premium?
#       "<div class='quill-academy-button-or-info-section'>
#         <img src='https://assets.quill.org/images/quill_academy/quill-academy-icon.svg'></img>
#         <h2>Quill Academy</h2>
#         <p class='subheader'>Access a growing library of self-paced training courses and resources to help you become a <u>Quill.org</u> expert and writing pedagogue.</p>
#         <button class='quill-button primary contained medium focus-on-light disabled' disabled>Coming Soon</button>
#       </div>"
#     else
#       "<div class='quill-academy-button-or-info-section'>
#         <img src='https://assets.quill.org/images/quill_academy/quill-academy-icon.svg'></img>
#         <h2>Quill Academy</h2>
#         <p class='subheader'>Access a growing library of self-paced training courses and resources to help you become a <u>Quill.org</u> expert and writing pedagogue.</p>
#         <a class='quill-button primary contained medium focus-on-light' href='/premium' tabIndex=0 target='_blank'>Learn more about Premium</a>
#       </div>"
#     end
#   end

#   def quill_academy_availability_disclaimer
#     if current_user&.has_school_or_district_premium?
#       "<div class='availability-disclaimer accessible'>
#       <i class='fas fa-icon fa-check-circle'></i>
#       <p>You have access to Quill Academy through a School Premium or District Premium subscription.<p>
#       </div>"
#     else
#       "<div class='availability-disclaimer restricted'>
#         <i class='fas fa-icon fa-exclamation-circle'></i>
#         <p>Quill Academy and Quill's Professional Development are included in School Premium and District Premium subscriptions.<p>
#       </div>"
#     end
#   end
# end

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
      it 'should return false if app setting is disabled ' do
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
end
