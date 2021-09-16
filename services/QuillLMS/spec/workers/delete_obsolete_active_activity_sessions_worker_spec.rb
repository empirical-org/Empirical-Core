require 'rails_helper'

describe DeleteObsoleteActiveActivitySessionsWorker, type: :worker do
  let(:worker) { described_class.new }

  let!(:active_session) { create(:active_activity_session) }
  let!(:obsolete_session1) { create(:active_activity_session) }
  let!(:obsolete_session2) { create(:active_activity_session) }

  before do
    create(:activity_session, :finished, uid: obsolete_session1.uid)

    create(:activity_session, :started,
      uid: obsolete_session2.uid,
      classroom_unit: create(:classroom_unit, visible: false)
    )
  end

  it 'should delete obsolete sessions' do
    active_id = active_session.id
    obsolete1_id = obsolete_session1.id
    obsolete2_id = obsolete_session2.id

    worker.perform

    expect(ActiveActivitySession.find_by(id: active_id).id).to be active_id
    expect(ActiveActivitySession.find_by(id: obsolete1_id)).to be nil
    expect(ActiveActivitySession.find_by(id: obsolete2_id)).to be nil
  end
end
