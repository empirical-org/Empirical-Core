require 'rails_helper'

describe GoogleIntegration::UpdateTeacherImportedClassroomsWorker do
  let(:worker) { described_class.new }

  let(:retriever_class) { GoogleIntegration::TeacherClassroomsRetriever}
  let(:updater_class) { GoogleIntegration::TeacherImportedClassroomsUpdater }

  subject { worker.perform(user_id) }

  context 'nil user_id' do
    let(:user_id) { nil }

    it { should_not_call_service_objects }
  end

  context 'user does not exist' do
    let(:user_id) { 0 }

    it { should_not_call_service_objects }
  end

  context 'user exists' do
    context 'that does not have google_id' do
      let(:user_id) { create(:teacher).id }

      it { should_not_call_service_objects }
    end

    context 'that has google_id' do
      let(:updater) { instance_double(updater_class, run: nil) }
      let(:retriever) { instance_double(retriever_class, run: nil) }

      let(:user_id) { create(:teacher, google_id: 123).id }

      it { should_call_service_objects }
    end
  end

  def should_not_call_service_objects
    expect(retriever_class).to_not receive(:new)
    expect(updater_class).to_not receive(:new)
    subject
  end

  def should_call_service_objects
    expect(retriever_class).to receive(:new).with(user_id).and_return(retriever)
    expect(updater_class).to receive(:new).with(user_id).and_return(updater)
    subject
  end
end
