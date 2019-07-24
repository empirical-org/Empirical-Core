require 'rails_helper'

describe 'CleverIntegration::Importers::Classrooms' do

  let!(:teacher) {
    create(:teacher, :signed_up_with_clever)
  }

  let!(:district_token) { '1' }

  let!(:sections_response) {
    section = Clever::Section.new({
      id: teacher.clever_id,
      name: 'section1',
      grade: '2'
    })
    section_response = Clever::SectionResponse.new({ data: section })
    Clever::SectionsResponse.new({
      data: [section_response]
     })
  }

  before do
    allow_any_instance_of(Clever::DataApi).to receive(:get_sections_for_teacher).and_return(sections_response)
  end

  def subject
    CleverIntegration::Importers::Classrooms.run(teacher, district_token)
    Classroom.find_by(clever_id: teacher.clever_id, name: 'section1', grade: '2')
  end

  it 'creates a classroom' do
    expect(subject).to_not be_nil
  end

  it 'associates classroom to teacher' do
    expect(subject.owner).to eq(teacher)
  end
end
