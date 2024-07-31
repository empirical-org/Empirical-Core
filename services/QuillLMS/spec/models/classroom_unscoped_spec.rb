# frozen_string_literal: true

require 'rails_helper'

describe ClassroomUnscoped, type: :model do
  describe 'default_scope' do
    it 'includes classrooms that are marked invisible' do
      result = Classroom.create(name: 'hidden classroom', visible: false)
      expect(ClassroomUnscoped.where(name: result.name).count).to eq(1)
    end
  end
end
