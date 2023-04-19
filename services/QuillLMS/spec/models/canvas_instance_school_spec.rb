# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_instance_schools
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint           not null
#  school_id          :bigint           not null
#
# Indexes
#
#  index_canvas_instance_schools_on_canvas_instance_and_school  (canvas_instance_id,school_id) UNIQUE
#  index_canvas_instance_schools_on_canvas_instance_id          (canvas_instance_id)
#  index_canvas_instance_schools_on_school_id                   (school_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (school_id => schools.id)
#
require 'rails_helper'

RSpec.describe CanvasInstanceSchool, type: :model do
  subject { create(:canvas_instance_school) }

  it { expect(subject).to be_valid }

  it { should belong_to(:canvas_instance) }
  it { should belong_to(:school) }

  context 'uniqueness' do
    it { expect { subject.dup.save!}.to raise_error ActiveRecord::RecordNotUnique }
  end
end
