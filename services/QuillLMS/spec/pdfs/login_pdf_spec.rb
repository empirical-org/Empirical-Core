# frozen_string_literal: true

require 'rails_helper'

describe LoginPdf do
  let(:student) { create(:student) }
  let(:clever_student) { create(:student, :signed_up_with_clever) }
  let(:google_student) { create(:student, :signed_up_with_google) }
  let(:normal_student) { create(:student, :with_generated_password) }
  let(:custom_pass_student) { create(:student) }

  describe 'generate a login pdf' do
    let(:students) { [student, clever_student, google_student, normal_student] }
    let(:classroom) { create(:classroom, students: students) }

    before do
      pdf = LoginPdf.new(classroom)
      rendered_pdf = pdf.render
      @text_analysis = PDF::Inspector::Text.analyze(rendered_pdf)
    end

    it 'lists google students by email' do
      expect(@text_analysis.strings).to include(google_student.email)
    end

    it 'tells google students to log in with google' do
      expect(@text_analysis.strings).to include("N/A (Log in with Google)")
    end

    it 'displays the right steps for google students' do
      expect(@text_analysis.strings).to include("Login with Google")
    end

    it 'lists clever students by email' do
      expect(@text_analysis.strings).to include(clever_student.email)
    end

    it 'tells clever students to log in with clever' do
      expect(@text_analysis.strings).to include("N/A (Log in with Clever)")
    end

    it 'displays the right steps for cleverstudents' do
      expect(@text_analysis.strings).to include("Login with Clever")
    end

    it 'lists regular students by username' do
      expect(@text_analysis.strings).to include(student.username)
    end

    it 'shows users with the default password the default password' do
      expect(@text_analysis.strings).to include(normal_student.last_name.capitalize.to_s)
    end

    it 'shows users with a custom password the right message' do
      expect(@text_analysis.strings).to include('N/A (Custom Password)')
    end

    it 'tells the teacher the right class code' do
      expect(@text_analysis.strings).to include(classroom.code)
    end

    it 'registers a pdf Mime Type' do
      expect(Mime::Type.lookup_by_extension(:pdf)).to_not be_nil
    end

  end

  describe 'when given a student with a username containing non-Windows-1252 characters' do
    let(:student_with_weird_username) { create(:student, username: 'studentツ' )}
    let(:students) { [student, clever_student, google_student, normal_student] }
    let(:classroom) { create(:classroom, students: students) }

    it 'will not error' do
      expect { LoginPdf.new(classroom) }.not_to raise_error
    end

  end
end
