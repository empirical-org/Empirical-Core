require 'rails_helper'

describe 'Dashboard', redis: :true do

  context '#self.queries' do

    let!(:teacher){ FactoryGirl.create(:teacher_with_students_with_activities) }

    describe 'if there are no cache values set' do

      it 'returns a results hash with the values from running the query' do
        results = Dashboard.queries(teacher)
        expect(results[0][:results]).to eq({"Test User"=>50})
        expect(results[1][:results]).to eq('insufficient data')
      end
    end

    describe 'if there are cached values set' do

      before(:each) do
        $redis.set("user_id:#{teacher.id}_struggling_students", {'Someone': 50}, {ex: 16.hours})
        $redis.set("user_id:#{teacher.id}_difficult_concepts", {'Even Though': 15}, {ex: 16.hours})
      end

      it 'returns a results hash with the values from running the query' do
        results = Dashboard.queries(teacher)
        expect(results[0][:results]).to eq({'Someone': 50})
        expect(results[1][:results]).to eq({'Even Though': 15})
      end

      it 'they have an expiration' do
        # ttl will return -1 if there is no expiration
        expect($redis.ttl("user_id:#{teacher.id}_struggling_students")).not_to eq(-1)
        expect($redis.ttl("user_id:#{teacher.id}_difficult_concepts")).not_to eq(-1)
      end
    end

  end
  after(:all) do
    $redis.flushall
  end
end
