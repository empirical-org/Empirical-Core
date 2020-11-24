class Cms::TopicsController < Cms::CmsController

  def index
    change_logs = []
    topics = Topic.includes(:activities, change_logs: :user).all.map do |t|
      topic = t.attributes
      if t.level == 3
        child_topics = Topic.where(visible: true, parent_id: t.id)
        topic[:activity_count] = child_topics.map { |ct| ct.activities.count}.reduce(:+)
      else
        topic[:activity_count] = t.activities.count
      end
      topic[:change_logs] = t.change_logs.map do |cl|
        change_log = cl.attributes
        change_log[:user] = cl.user
        change_log[:topic_name] = t.name
        change_logs.push(change_log)
        change_log
      end
      topic
    end
    render json: { topics: topics, change_logs: change_logs }
  end

end
