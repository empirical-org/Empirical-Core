# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClassroomCreator do
  let(:teacher_id) { create(:teacher).id }
  let(:clever_id) { '123_456'}
  let(:grade) { '1' }
  let(:name) { 'clever classroom' }

  let(:data) do
    {
      clever_id: clever_id,
      grade: grade,
      name: name,
      teacher_id: teacher_id
    }
  end

  subject { described_class.run(data) }


  it { expect(subject.clever_id).to eq clever_id }
  it { expect(subject.grade).to eq grade }
  it { expect(subject.name).to eq name }
  it { expect(subject.synced_name).to eq name }

  it { expect { subject }.to change(ClassroomsTeacher, :count).from(0).to(1) }

  context 'teacher owns another classroom with same name' do
    let(:classroom1) { create(:classroom, :from_clever, :with_no_teacher, name: name, grade: grade) }

    before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom1) }

    it { expect(subject.clever_id).to eq clever_id }
    it { expect(subject.grade).to eq grade }
    it { expect(subject.name).to eq "#{name}_1" }
    it { expect(subject.synced_name).to eq name }

    it { expect { subject }.to change(ClassroomsTeacher, :count).from(1).to(2) }

    context "teacher owns another classroom with same name as #{name}_1" do
      let(:name_1) { "#{name}_1" }
      let(:classroom2) { create(:classroom, :from_clever, :with_no_teacher, name: name_1, grade: grade) }

      before { create(:classrooms_teacher, user_id: teacher_id, classroom: classroom2) }

      it { expect(subject.name).to eq "#{name}_1_1" }
      it { expect { subject }.to change(ClassroomsTeacher, :count).from(2).to(3) }
    end
  end

  context 'nil name' do
    let(:name) { nil }

    it { expect(subject.clever_id).to eq clever_id }
    it { expect(subject.grade).to eq grade }
    it { expect(subject.name).to eq "Classroom #{clever_id}" }
    it { expect(subject.synced_name).to eq name }
  end
end
