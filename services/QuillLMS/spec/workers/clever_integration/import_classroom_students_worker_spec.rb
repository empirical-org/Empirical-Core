# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ImportClassroomStudentsWorker do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:classroom_ids) { [100, 205] }

  it 'should run importing with valid teacher id and classroom_clever_ids' do
    expect(CleverIntegration::TeacherClassroomsStudentsImporter).to receive(:run).with(teacher, classroom_ids)
    subject.perform(teacher.id, classroom_ids)
  end
end
