# frozen_string_literal: true

class Cms::TopicsController < Cms::CmsController

  def index
    change_logs = []
    topics = Topic.includes(:activities, change_logs: :user).all.map do |t|
      topic = t.attributes
      if t.level == 3
        child_topics = Topic.where(visible: true, parent_id: t.id)
        grandchild_topics = child_topics.map { |ct| Topic.where(parent_id: ct.id) }.flatten
        topic[:activity_count] = grandchild_topics.map { |gct| gct.activities.count}.reduce(:+)
      elsif t.level == 2
        child_topics = Topic.where(visible: true, parent_id: t.id)
        topic[:activity_count] = child_topics.map { |gct| gct.activities.count}.reduce(:+)
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


  def create
    topic = topic_params

    if topic[:change_logs_attributes]
      topic[:change_logs_attributes] = topic[:change_logs_attributes].map do |cl|
        cl[:user_id] = current_user.id
        cl
      end
    end

    new_topic = Topic.create!(topic)

    render json: { topic: new_topic }
  end

  def update
    topic = topic_params
    topic[:change_logs_attributes] = topic[:change_logs_attributes].map do |cl|
      cl[:user_id] = current_user.id
      cl
    end

    updated_topic = Topic.find_by_id(params[:id]).update(topic)

    render json: { topic: updated_topic }
  end

  def topic_params
    params.require(:topic).permit(
      :name,
      :id,
      :visible,
      :parent_id,
      :level,
      change_logs_attributes: [
        :action,
        :explanation,
        :changed_attribute,
        :previous_value,
        :new_value,
        :changed_record_id,
        :changed_record_type,
        :user_id
      ]
    )
  end

end
