# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_infos
#
#  id                      :bigint           not null, primary key
#  maximum_grade_level     :integer
#  minimum_grade_level     :integer
#  role_selected_at_signup :string           default("")
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  user_id                 :bigint           not null
#
# Indexes
#
#  index_teacher_infos_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

describe TeacherInfo, type: :model, redis: true do
  it { should have_many(:subject_areas) }
  it { should have_many(:teacher_info_subject_areas) }
  it { should belong_to(:user) }

  it {should validate_numericality_of(:minimum_grade_level)}
  it {should validate_numericality_of(:maximum_grade_level)}

  it {should validate_presence_of(:user_id)}

  context 'uniqueness' do
    let!(:teacher_info) {create(:teacher_info)}

    it {should validate_uniqueness_of(:user_id)}
  end

  let(:teacher_info) {create(:teacher_info)}
  let(:teacher) {create(:teacher)}

  describe 'minimum_grade_level=' do
    it 'should set the minimum grade level to 0 if it is passed in as K' do
      teacher_info = TeacherInfo.create(minimum_grade_level: 'K')
      expect(teacher_info.attributes["minimum_grade_level"]).to equal(0)
    end
  end

  describe 'maximum_grade_level=' do
    it 'should set the maximum grade level to 0 if it is passed in as K' do
      teacher_info = TeacherInfo.create(maximum_grade_level: 'K')
      expect(teacher_info.attributes["maximum_grade_level"]).to equal(0)
    end
  end

  describe 'minimum_grade_level' do
    it 'should read the minimum grade level as K if it is saved as 0' do
      teacher_info = TeacherInfo.create(minimum_grade_level: 0)
      expect(teacher_info.minimum_grade_level).to equal('K')
    end
  end

  describe 'maximum_grade_level' do
    it 'should read the minimum grade level as K if it is saved as 0' do
      teacher_info = TeacherInfo.create(maximum_grade_level: 0)
      expect(teacher_info.maximum_grade_level).to equal('K')
    end
  end

  describe 'teacher' do
    it 'should read the user for the teacher' do
      expect(teacher_info.teacher).to eq(teacher_info.user)
    end
  end

  describe 'teacher_id' do
    it 'should read the user_id for the teacher_id' do
      expect(teacher_info.teacher_id).to eq(teacher_info.user_id)
    end
  end

  describe 'teacher=' do
    it 'should set the user for the teacher' do
      teacher_info.teacher = teacher
      expect(teacher_info.user).to eq(teacher)
    end
  end

  describe 'teacher_id=' do
    it 'should set the user_id for the teacher_id' do
      teacher_info.teacher_id = teacher.id
      expect(teacher_info.user_id).to eq(teacher.id)
    end
  end

  describe '#grade_levels' do
    it { expect(build(:teacher_info, minimum_grade_level: 0, maximum_grade_level: 12).grade_levels).to eq (0..12).to_a }
    it { expect(build(:teacher_info, minimum_grade_level: 8, maximum_grade_level: 8).grade_levels).to eq [8] }
    it { expect(build(:teacher_info, minimum_grade_level: nil, maximum_grade_level: nil).grade_levels).to eq [] }
    it { expect(build(:teacher_info, minimum_grade_level: nil, maximum_grade_level: 9).grade_levels).to eq [9] }
    it { expect(build(:teacher_info, minimum_grade_level: 5, maximum_grade_level: nil).grade_levels).to eq [5]}
  end

  describe '#in_eighth_through_twelfth?' do
    it { expect(build(:teacher_info, minimum_grade_level: 0, maximum_grade_level: 12).in_eighth_through_twelfth?).to be true }
    it { expect(build(:teacher_info, minimum_grade_level: 0, maximum_grade_level: 7).in_eighth_through_twelfth?).to be false }
    it { expect(build(:teacher_info, minimum_grade_level: 8, maximum_grade_level: 8).in_eighth_through_twelfth?).to eq true }
    it { expect(build(:teacher_info, minimum_grade_level: nil, maximum_grade_level: nil).in_eighth_through_twelfth?).to eq false }
    it { expect(build(:teacher_info, minimum_grade_level: nil, maximum_grade_level: 9).in_eighth_through_twelfth?).to eq true }
    it { expect(build(:teacher_info, minimum_grade_level: 5, maximum_grade_level: nil).in_eighth_through_twelfth?).to eq false}
  end

  describe '#subject_areas_string' do
    let(:subject1) { create(:subject_area, name: "subject 1")}
    let(:subject2) { create(:subject_area, name: "subject 2")}
    let(:subject3) { create(:subject_area, name: "subject 3")}

    before do
      create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject1)
      create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject2)
      create(:teacher_info_subject_area, teacher_info: teacher_info, subject_area: subject3)
    end

    context 'when multiple subject areas are attached' do
      it 'should return a list of attached subject areas in a comma-separated string' do
        expect(teacher_info.subject_areas_string).to eq("#{subject1.name}, #{subject2.name}, #{subject3.name}")
      end
    end

    context 'when no subject areas are attached' do
      it 'should return nil' do
        teacher_info2 = create(:teacher_info)
        expect(teacher_info2.subject_areas_string).to eq(nil)
      end
    end
  end
end
