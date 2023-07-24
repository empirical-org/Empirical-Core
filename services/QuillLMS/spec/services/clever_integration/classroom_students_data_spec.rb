# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomStudentsData do
  include_context 'Clever Library Students Data'

  let(:classroom) { create(:classroom, :from_clever) }
  let(:classroom_external_id) { classroom.classroom_external_id }

  let(:students_data) { [student1_attrs, student2_attrs] }
  let(:classroom_students_data) { students_data.map { |attrs| attrs.merge(classroom: classroom) } }
  let(:client) { double('client') }

  subject { described_class.new(classroom, client) }

  before { allow(client).to receive(:classroom_students).with(classroom_external_id).and_return(students_data) }

  it { expect(subject.to_a).to match_array classroom_students_data }
end

