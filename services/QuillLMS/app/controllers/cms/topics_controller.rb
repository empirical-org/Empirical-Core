class Cms::TopicsController < Cms::CmsController

  def index
    live_topics = Topic.where(visible: true).map do |t|
      topic = t.attributes
      if t.level === 3
        child_topics = Topic.where(visible: true, parent_id: t.id)
        topic[:activity_count] = child_topics.map { |ct| ct.activities.count}.reduce(:+)
      else
        topic[:activity_count] = t.activities.count
      end
      topic
    end
    archived_topics = Topic.where(visible: false).map { |t| t.attributes }
    render json: { live_topics: live_topics, archived_topics: archived_topics }
  end

end
