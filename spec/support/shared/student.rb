shared_examples_for "student" do


  let(:classroom){ FactoryGirl.build(:classroom, code: '101') }
  let(:student){FactoryGirl.build(:student)} 


  context 'if username is not present' do

    let!(:student){ FactoryGirl.build(:student, username: nil) }

    it 'should be valid' do
      expect(student).to be_valid
    end

    context 'when email and username is missing' do

      it 'should have an error' do
        student.email = nil
        student.valid?
        expect(student.errors[:email]).to include "can't be blank"
      end

    end

  end

  describe "#unfinished_activities" do 

    it "must return an empty list when there aren't any available yet" do 
      expect(student.unfinished_activities(classroom)).to be_empty
    end

    context "when there is one available" do 

      let(:activity){FactoryGirl.build(:activity)}

      it "must return one item" do 
        student.classroom.activities<<activity
        expect(student.unfinished_activities(student.classroom).count).to eq 1 
      end

    end

  end


  describe "#activity_sessions" do 
    let!(:activity){ FactoryGirl.create(:activity) }  
    let!(:student){ FactoryGirl.build(:student) }
    let!(:classroom_activity) { FactoryGirl.create(:classroom_activity,activity_id: activity.id, classroom_id: student.classroom.id) }

    it "must returns an empty array when none is assigned" do 
      expect(student.activity_sessions).to be_empty
    end

    describe "return availables" do
      before do
        student.activity_sessions.build()
      end
      it "must return which are available" do 
        expect(student.activity_sessions).to_not be_empty
      end
    end

    context "with a valid activity_session initialized" do

        before do
          student.save!
          student.activity_sessions.create!(classroom_activity_id: classroom_activity.id, activity_id: activity.id)
        end

        describe "#rel_for_activity" do 

          it "must not be an empty list" do 
            expect(student.activity_sessions.rel_for_activity(activity)).to_not be_empty
          end

        end
        describe "#for_activity" do 

          it "must be present" do 
            expect(student.activity_sessions.for_activity(activity)).to be_present
          end

        end

        context "when the activity is completed" do

            before do
              activity_session=student.activity_sessions.first
              activity_session.completed_at=Time.now
              activity_session.save
            end

            describe "#completed_for_activity" do 

              it "must be present" do 
                expect(student.activity_sessions.completed_for_activity(activity)).to be_present
              end

            end
            describe "#for_classroom" do 

              it "must be present" do 
                expect(student.activity_sessions.for_classroom(student.classroom)).to be_present
              end

            end
        end
    end
  end


end
