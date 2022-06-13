# frozen_string_literal: true

require 'rails_helper'

describe SetTeacherLessonCache do
  subject { described_class.new }

  describe '#perform' do
    let!(:teacher) { create(:teacher) }

    it 'should set the lesson cache' do
      expect_any_instance_of(User).to receive(:set_lessons_cache)
      subject.perform(teacher.id)
    end
  end
end
