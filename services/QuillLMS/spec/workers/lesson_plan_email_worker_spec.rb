require 'rails_helper'

describe LessonPlanEmailWorker do
  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:activity) { create(:activity) }
    let!(:unit) { create(:unit) }
    let(:lessons) { Activity.where(id: activity.id)
      .joins("JOIN activity_category_activities AS aca ON aca.activity_id = activities.id")
      .joins("JOIN activity_categories AS ac ON ac.id = aca.activity_category_id")
      .order("ac.order_number, aca.order_number")
    }

    it 'should send the lesson plan email' do
      expect_any_instance_of(User).to receive(:send_lesson_plan_email).with(lessons, unit)
      subject.perform(user.id, [activity.id], unit.id)
    end
  end
end