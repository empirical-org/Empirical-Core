require 'rails_helper'


describe ActivitySession, type: :model, redis: :true do

  describe "can behave like an uid class" do

    context "when behaves like uid" do
      it_behaves_like "uid"
    end

  end

  let(:activity_session) {build(:activity_session, completed_at: 5.minutes.ago)}

  describe "#activity" do

  	context "when there is a direct activity association" do

	  	let(:activity){ create(:activity) }
		  let(:activity_session){ build(:activity_session,activity_id: activity.id) }

  		it "must return the associated activity" do
  			expect(activity_session.activity).to eq activity
  		end

	end

  describe "#invalidate_activity_session_count_if_completed" do
    let!(:student){ create(:student, :in_one_classroom) }
    let!(:classroom_activity) { create(:classroom_activity, classroom_id: student.classrooms.first.id) }
    let!(:activity_session){   create(:activity_session, classroom_activity_id: classroom_activity.id, state: 'not validated')}

    before(:each) do
      $redis.set("classroom_id:#{student.classrooms.first.id}_completed_activity_count", 10)
    end

    it "deletes redis cache when an activity with a classroom's state is finished" do
      activity_session.update(state: 'finished')
      activity_session.invalidate_activity_session_count_if_completed
      expect($redis.get("classroom_id:#{student.classrooms.first.id}_completed_activity_count")).not_to be
    end

    it "does nothing to redis cache when any other classroom attribute changes" do
      activity_session.update(visible: false)
      activity_session.invalidate_activity_session_count_if_completed
      expect($redis.get("classroom_id:#{student.classrooms.first.id}_completed_activity_count")).to eq('10')
    end

  end

	context "when there's not an associated activity but there's a classroom activity" do

	    let!(:activity){ create(:activity) }
	    let!(:student){ create(:student, :in_one_classroom) }
	    let!(:classroom_activity) { create(:classroom_activity, activity_id: activity.id, classroom_id: student.classrooms.first.id) }
		  let(:activity_session){   build(:activity_session, classroom_activity_id: classroom_activity.id)                     }

  		it "must return the classroom activity" do
  			activity_session.activity_id=nil
  			expect(activity_session.activity).to eq activity_session.classroom_activity.activity
  		end

	end

  end

  describe "#classroom" do
  	it "TODO: must return a valid classroom object"
  end

  describe "#activity_uid=" do

  	let(:activity){ create(:activity) }

  	it "must associate activity by uid" do
  		activity_session.activity_id=nil
  		activity_session.activity_uid=activity.uid
  		expect(activity_session.activity_id).to eq activity.id
  	end

  end

  describe "#activity_uid" do

  	it "must return an uid when activity is present" do
  		expect(activity_session.activity_uid).to be_present
  	end

  end

  describe "#completed?" do

  	it "must be true when completed_at is present" do
  		expect(activity_session).to be_completed
  	end

  	it "must be false when copleted_at is not present" do
  		activity_session.completed_at=nil
  		expect(activity_session).to_not be_completed
  	end

  end

  describe "#by_teacher" do
    # This setup is very convoluted... the factories appear to be untrustworthy w/r/t generating extra records
    let!(:current_classroom) { create(:classroom_with_one_student) }
    let(:current_teacher) { current_classroom.owner }
    let!(:current_student) {current_classroom.students.first}
    let!(:current_teacher_classroom_activity) { create(:classroom_activity_with_activity, classroom: current_classroom)}
    let!(:other_classroom) { create(:classroom_with_one_student) }
    let(:other_teacher) { other_classroom.owner }
    let!(:other_student) {other_classroom.students.first}
    let!(:other_teacher_classroom_activity) { create(:classroom_activity_with_activity, classroom: other_classroom)}

    before do
      # Can't figure out why the setup above creates 2 activity sessions
      ActivitySession.destroy_all
      2.times { create(:activity_session, classroom_activity: current_teacher_classroom_activity, user: current_student) }
      3.times { create(:activity_session, classroom_activity: other_teacher_classroom_activity, user: other_student) }
    end

    it "only retrieves activity sessions for the students who have that teacher" do
      results = ActivitySession.by_teacher(current_teacher)
      expect(results.size).to eq(2)
    end
  end

  #--- legacy methods

  describe "#grade" do

  	it "must be equal to percentage" do
  		expect(activity_session.grade).to eq activity_session.percentage
  	end

  end

  describe "#owner" do

  	it "must be equal to user" do
  		expect(activity_session.owner).to eq activity_session.user
  	end

  end

  describe "#anonymous=" do

  	it "must be equal to temporary" do
  		expect(activity_session.anonymous=true).to eq activity_session.temporary
  	end

  	it "must return temporary" do
  		activity_session.anonymous=true
  		expect(activity_session.anonymous).to eq activity_session.temporary
  	end
  end

  describe "#owned_by?" do

  	let(:user) {build(:user)}

  	it "must return true if temporary true" do
  		activity_session.temporary=true
  		expect(activity_session.owned_by? user).to be_truthy
  	end

  	it "must be true if temporary false and user eq owner" do
  		expect(activity_session.owned_by? activity_session.user).to eq true
  	end

  end

  context "when before_create is fired" do

  	describe "#set_state" do

  		it "must set state as unstarted" do
  			activity_session.state=nil
  			activity_session.save!
  			expect(activity_session.state).to eq "unstarted"
  		end

  	end

  end

  context "when before_save is triggered" do

  	describe "#set_completed_at when state = finished" do
      before do
        activity_session.save!
        activity_session.state="finished"
      end

      context "when completed_at is already set" do
        before do
          activity_session.completed_at = 5.minutes.ago
        end

        it "should not change completed at "do
          expect {
            activity_session.save!
          }.to_not change {
            activity_session.reload.completed_at
          }
        end
      end

      context "when completed_at is not already set" do
        before do
          activity_session.completed_at = nil
          activity_session.save!
        end

        it "should update completed_at" do
          expect(activity_session.completed_at).to_not be_nil
        end
      end
  	end

  end

  context "when completed scope" do
  	describe ".completed" do
  		before do
			create_list(:activity_session, 5, :finished)
  		end
  		it "must locate all the completed items" do
  			expect(ActivitySession.completed.count).to eq 5
  		end

  		it "completed_at must be present" do
  			ActivitySession.completed.each do |item|
  				expect(item.completed_at).to be_present
  			end
  		end

  		it "must order by date desc" do
  			#TODO: This test is not passing cause the ordering is wrong
  			# p completed=ActivitySession.completed
  			# current_date=completed.first.completed_at
  			# completed.each do |item|
  			# 	expect(item.completed_at).to satisfy { |x| p x.to_s+" <= "+current_date.to_s ||x <= current_date  }
  			# 	current_date=item.completed_at
  			# end
  		end
  	end
  end

  context "when incompleted scope" do

  	describe ".incomplete" do

  		before do
			create_list(:activity_session, 3)
  		end

  		it "must locate all the incompleted items" do
  			expect(ActivitySession.incomplete.count).to eq 3
  		end

  		it "completed_at must be nil" do
  			ActivitySession.incomplete.each do |item|
  				expect(item.completed_at).to be_nil
  			end
  		end

  	end

  end

  describe "can act as ownable" do

    context "when it's an ownable model" do

      it_behaves_like "ownable"
    end

  end

  describe '#determine_if_final_score' do
    let!(:classroom) {create(:classroom)}
    let!(:student) {create(:student)}
    let!(:activity) {create(:activity)}

    let!(:classroom_activity)   {create(:classroom_activity, activity: activity, classroom: classroom)}
    let!(:previous_final_score) {create(:activity_session, completed_at: Time.now, percentage: 0.9, is_final_score: true, user: student, classroom_activity: classroom_activity, activity: classroom_activity.activity)}

    it 'updates when new activity session has higher percentage ' do
      new_activity_session =  create(:activity_session, is_final_score: false, user: student, classroom_activity: classroom_activity, activity: classroom_activity.activity)
      new_activity_session.update_attributes completed_at: Time.now, state: 'finished', percentage: 0.95
      expect([ActivitySession.find(previous_final_score.id).is_final_score, ActivitySession.find(new_activity_session.id).is_final_score]).to eq([false, true])
    end

    it 'doesnt update when new activity session has lower percentage' do
      new_activity_session =  create(:activity_session, completed_at: Time.now, state: 'finished', percentage: 0.5, is_final_score: false, user: student, classroom_activity: classroom_activity, activity: classroom_activity.activity)
      expect([ActivitySession.find(previous_final_score.id).is_final_score, ActivitySession.find(new_activity_session.id).is_final_score]).to eq([true, false])
    end

  end


  describe '#validations' do
    let!(:assigned_student){ create(:student) }
    let!(:unassigned_student){ create(:student) }
    let!(:classroom){ create(:classroom, students: [assigned_student, unassigned_student])}
    let!(:activity){ create(:activity) }
    let!(:classroom_activity) { create(:classroom_activity, classroom: classroom, activity_id: activity.id, assigned_student_ids: [assigned_student.id], assign_on_join: false )}

    it 'ensures that the student was correctly assigned' do
      act_sesh = ActivitySession.create(user_id: unassigned_student.id, classroom_activity: classroom_activity)
      expect(act_sesh).not_to be_valid
    end
  end



end
