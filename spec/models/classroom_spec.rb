require 'spec_helper'

describe Classroom do
  it { should have_many :classroom_chapters }
  it { should have_many :chapters }
  it { should have_many :scores }
  it { should have_many :students }
  it { should belong_to :teacher }

  let(:teacher) do
    User.create(username: 'teacher_test',
                password: 'password',
                password_confirmation: 'password',
                role: 'teacher')
  end
  let(:chapter) { FactoryGirl.create(:chapter) }

  before do
    @classroom = FactoryGirl.create(:classroom, teacher_id: teacher.id)
  end

  describe '#classroom_chapter_for' do
    describe 'with classroom chapters' do
      before do
        @classroom_chapter = @classroom.classroom_chapters.create(chapter: chapter)
      end

      it 'should return one classroom chapter' do
        expect(@classroom.classroom_chapter_for(chapter)).
          to eq(@classroom_chapter)
      end
    end

    describe 'without classroom chapters' do
      it 'should return nil' do
        expect(@classroom.classroom_chapter_for(chapter)).to be_nil
      end
    end
  end
end