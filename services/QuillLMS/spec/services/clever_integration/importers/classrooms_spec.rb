# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::Importers::Classrooms do
  let!(:teacher) { create(:teacher, :signed_up_with_clever) }
  let!(:district_token) { '1' }

  let!(:section) { Clever::Section.new(id: teacher.clever_id, name: 'section1', grade: '2') }
  let!(:section_response) { Clever::SectionResponse.new(data: section) }
  let!(:sections_response) { Clever::SectionsResponse.new(data: [section_response]) }

  before { allow_any_instance_of(Clever::DataApi).to receive(:get_sections_for_teacher).and_return(sections_response) }

  def subject
    CleverIntegration::Importers::Classrooms.run(teacher, district_token)
    Classroom.find_by(clever_id: teacher.clever_id, name: 'section1', grade: '2')
  end

  it { expect(subject).to_not be_nil }
  it { expect(subject.owner).to eq(teacher) }
end
