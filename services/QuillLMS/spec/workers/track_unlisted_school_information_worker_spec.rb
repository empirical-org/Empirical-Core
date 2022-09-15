# frozen_string_literal: true

require 'rails_helper'

describe TrackUnlistedSchoolInformationWorker, type: :worker do
  let(:worker) { TrackUnlistedSchoolInformationWorker.new }
  let(:analytics) { double(:analytics, identify: true, track: true) }
  let(:teacher) { create(:teacher) }

  school_name = 'Nonexistent'
  zipcode = 55555

  before do
    allow(SegmentAnalytics).to receive(:new) { analytics }
  end

  it 'sends a segment.io event if there is a user and school name' do
    expect(analytics).to receive(:track_teacher_school_not_listed).with(teacher, school_name, zipcode)
    worker.perform(teacher.id, school_name, zipcode)
  end

  it 'does not send a segment.io event if there is no school name' do
    expect(analytics).not_to receive(:track_teacher_school_not_listed)
    worker.perform(teacher.id, nil, zipcode)
  end

  it 'does not send a segment.io event if there is no user' do
    expect(analytics).not_to receive(:track_teacher_school_not_listed)
    worker.perform(nil, school_name, zipcode)
  end

end
