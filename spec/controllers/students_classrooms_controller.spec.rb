require 'rails_helper'

describe StudentsClassroomsController, type: :controller do
  let(:student) { create(:student) }
  let(:classroom) { create(:classroom)}
  let(:classroom2) { create(:classroom, code: 'merry-honey')}
  let(:classroom3) { create(:classroom, visible: false)}


  describe 'POST #create workers' do
    before do
      session[:user_id] = student.id
    end

    it 'should kick off the join classroom worker when they enter a correct classcode' do
      expect {
        post :create, ({classcode: classroom.code})
      }.to change(JoinClassroomWorker.jobs, :size).by(1)
    end

    it "should be able to handle classcodes with inappropriate spaces" do
      classroom2.save!
      expect {
        post :create, ({classcode: 'merry -  honey'})
      }.to change(JoinClassroomWorker.jobs, :size).by(1)
    end

    describe 'when a student inputs an unknown classcode' do

      it "kicks the invalid class code worker" do
        expect {
          post :create, ({classcode: "i'm not a classcode!"})
        }.to change(InvalidClasscodeWorker.jobs, :size).by(1)
      end

      it "returns a 400 status with an appropriate error message" do
        post :create, ({classcode: "i'm not a classcode!"})
        expect(response.status).to eq(400)
        expect(JSON.parse(response.body)["error"]).to eq('No such classcode')
      end

    end

    describe 'when a student inputs a classcode for an archived class' do

      it "returns a 403 status with an appropriate error message" do
        post :create, ({classcode: classroom3.code})
        expect(response.status).to eq(403)
        expect(JSON.parse(response.body)["error"]).to eq('Class is archived')
      end

    end

  end

end
