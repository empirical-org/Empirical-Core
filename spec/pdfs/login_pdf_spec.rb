require 'rails_helper'

describe LoginPdf do
  describe 'generate a login pdf' do
    let(:arnold) { FactoryGirl.create(:arnold_horshack) }
    let(:clever_student) { FactoryGirl.create(:student, clever_id: 'clever_id_1', email: 'clever@gmail.com') }
    let(:google_student) { FactoryGirl.create(:student, signed_up_with_google: true, email: 'googler@gmail.com') }
    let(:students) { [arnold, clever_student, google_student] }
    let(:classroom) { FactoryGirl.create(:classroom, students: students) }

    before do
      pdf = LoginPdf.new(classroom)
      rendered_pdf = pdf.render
      @text_analysis = PDF::Inspector::Text.analyze(rendered_pdf)
    end

    it 'lists google students by email' do
      expect(@text_analysis.strings).to include("email: googler@gmail.com")
    end

    it 'lists clever students by email' do
      expect(@text_analysis.strings).to include("email: clever@gmail.com")
    end

    it 'lists regular students by username' do
      expect(@text_analysis.strings).to include("username: #{arnold.username}")
    end

    it 'registers a pdf Mime Type' do
      expect(Mime::Type.lookup_by_extension(:pdf)).to_not be_nil
    end

  end
end
