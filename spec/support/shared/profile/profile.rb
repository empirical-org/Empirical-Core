shared_context 'profile' do
  let(:teacher) { FactoryGirl.create(:user, role: 'teacher', name: 'Teacher teacher') }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) { FactoryGirl.create(:user, role: 'student', classroom: classroom) }

  let(:game1) { FactoryGirl.create(:activity_classification, id: 1) }
  let(:game2) { FactoryGirl.create(:activity_classification, id: 2) }

  let(:activity) { FactoryGirl.create(:activity, classification: game2) }
  let(:activity_1a) { FactoryGirl.create(:activity, classification: game1) }
  let(:activity_1aa) { FactoryGirl.create(:activity, classification: game2) }
  let!(:activity_1b) { FactoryGirl.create(:activity, classification: game2) }
  let(:unit1) { FactoryGirl.create(:unit) }
  let!(:classroom_activity) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity,
                       unit: unit1)
  end

  let!(:classroom_activity_1a) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity_1a,
                       unit: unit1)
  end

  let!(:classroom_activity_1aa) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity_1aa,
                       unit: unit1)
  end

  let!(:classroom_activity_1b) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity_1b,
                       unit: unit1)
  end

  let(:activity2) { FactoryGirl.create(:activity, classification: game2) }
  let(:activity_2a) { FactoryGirl.create(:activity, classification: game1) }
  let(:activity_2aa) { FactoryGirl.create(:activity, classification: game2) }
  let(:activity_2b) { FactoryGirl.create(:activity, classification: game2) }

  let!(:unit2) { FactoryGirl.create(:unit) }
  let!(:classroom_activity2) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity2,
                       unit: unit2,
                       due_date: Date.today + 3)
  end

  let!(:classroom_activity_2a) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity_2a,
                       unit: unit2,
                       due_date: Date.today + 100)
  end

  let!(:classroom_activity_2aa) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity_2aa,
                       unit: unit2,
                       due_date: Date.today + 100)
  end

  let!(:classroom_activity_2b) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity_2b,
                       unit: unit2,
                       due_date: Date.today + 1)
  end

  # let(:activity3) { FactoryGirl.create(:activity, classification: game1) }

  # let!(:unit3) { FactoryGirl.create(:unit) }
  # let!(:classroom_activity3) { FactoryGirl.create(:classroom_activity,
  #                                                 classroom: classroom,
  #                                                 activity: activity3,
  #                                                 unit: unit3,
  #                                                 due_date: Date.today + 3) }

  let!(:as1) { classroom_activity.session_for(student) }
  let!(:as_1a) { classroom_activity_1a.session_for(student) }
  let!(:as_1aa) { classroom_activity_1aa.session_for(student) }
  let!(:as_1b) { classroom_activity_1b.session_for(student) }

  let!(:as2) { classroom_activity2.session_for(student) }
  let!(:as_2a) { classroom_activity_2a.session_for(student) }
  let!(:as_2aa) { classroom_activity_2aa.session_for(student) }
  let!(:as_2b) { classroom_activity_2b.session_for(student) }

  # let!(:as3_unstarted) { classroom_activity3.session_for(student) }
  # let!(:as3_started) { classroom_activity3.session_for(student) }
  # let!(:as3_finished) { classroom_activity3.session_for(student) }

  before do
    as1.update_attributes(percentage: 0.8, state: 'finished')
    as_1a.update_attributes(percentage: 0.5, state: 'finished')
    as_1aa.update_attributes(percentage: 0.5, state: 'finished')
    as_1b.update_attributes(percentage: 1, state: 'finished')
  end

  # before do
  #   as3_unstarted.update_attributes(state: 'unstarted')
  #   as3_started.update_attributes(percentage: 0.5, state: 'started')
  #   as3_finished.update_attributes(percentage: 0.5, state: 'finished')
  # end
end
