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
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity,
                                                  classroom: classroom,
                                                  activity: activity,
                                                  unit: unit1) }

  let!(:classroom_activity_1a) { FactoryGirl.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity_1a,
                                                    unit: unit1)}


  let!(:classroom_activity_1aa) { FactoryGirl.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity_1aa,
                                                    unit: unit1)}

  let!(:classroom_activity_1b) { FactoryGirl.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity_1b,
                                                    unit: unit1)}

  let(:activity2) { FactoryGirl.create(:activity, classification: game2) }
  let(:activity_2a) { FactoryGirl.create(:activity, classification: game1) }
  let(:activity_2aa) { FactoryGirl.create(:activity, classification: game2) }
  let(:activity_2b) { FactoryGirl.create(:activity, classification: game2) }

  let!(:unit2) { FactoryGirl.create(:unit) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity,
                                                  classroom: classroom,
                                                  activity: activity2,
                                                  unit: unit2,
                                                  due_date: Date.today + 3) }

  let!(:classroom_activity_2a) { FactoryGirl.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity_2a,
                                                    unit: unit2,
                                                    due_date: Date.today + 100)}

  let!(:classroom_activity_2aa) { FactoryGirl.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity_2aa,
                                                    unit: unit2,
                                                    due_date: Date.today + 100)}


  let!(:classroom_activity_2b) { FactoryGirl.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity_2b,
                                                    unit: unit2,
                                                    due_date: Date.today + 1)}


  let!(:as1) { classroom_activity.session_for(student) }
  let!(:as_1a) { classroom_activity_1a.session_for(student) }
  let!(:as_1aa) { classroom_activity_1aa.session_for(student) }
  let!(:as_1b) { classroom_activity_1b.session_for(student) }

  let!(:as2) { classroom_activity2.session_for(student) }
  let!(:as_2a) { classroom_activity_2a.session_for(student) }
  let!(:as_2aa) { classroom_activity_2aa.session_for(student) }
  let!(:as_2b) { classroom_activity_2b.session_for(student) }
end