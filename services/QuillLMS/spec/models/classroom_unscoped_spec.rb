# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms
#
#  id                  :integer          not null, primary key
#  code                :string(255)
#  grade               :string(255)
#  grade_level         :integer
#  name                :string(255)
#  synced_name         :string
#  visible             :boolean          default(TRUE), not null
#  created_at          :datetime
#  updated_at          :datetime
#  clever_id           :string(255)
#  google_classroom_id :bigint
#
# Indexes
#
#  index_classrooms_on_clever_id            (clever_id)
#  index_classrooms_on_code                 (code)
#  index_classrooms_on_google_classroom_id  (google_classroom_id)
#  index_classrooms_on_grade                (grade)
#  index_classrooms_on_grade_level          (grade_level)
#
require 'rails_helper'

describe ClassroomUnscoped, type: :model do
  describe 'default_scope' do
    it 'includes classrooms that are marked invisible' do
      result = Classroom.create(name: 'hidden classroom', visible: false)
      expect(ClassroomUnscoped.where(name: result.name).count).to eq(1)
    end
  end
end
