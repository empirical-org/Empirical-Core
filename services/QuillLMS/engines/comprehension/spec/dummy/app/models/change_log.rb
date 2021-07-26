class ChangeLog < ActiveRecord::Base
  COMPREHENSION_ACTIONS = {
    create: 'created',
    delete: 'deleted',
    update: 'updated',
    activate_automl: 'activated'
  }

  belongs_to :changed_record, polymorphic: true
  belongs_to :user

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :action, :changed_attribute, :changed_record_type, :changed_record_id,
             :explanation, :new_value, :previous_value, :created_at, :updated_at, :user_id],
      methods: [:comprehension_action, :comprehension_url, :comprehension_name, :conjunctions, :user, :updated_local_time]
    ))
  end

  def comprehension_action
    "#{changed_record.change_log_name} - #{action}"
  end

  def comprehension_url
    changed_record.url if changed_record.respond_to? :url
  end

  def comprehension_name
    changed_record.comprehension_name if changed_record.respond_to? :comprehension_name
  end

  def conjunctions
    changed_record.conjunctions if changed_record.respond_to? :conjunctions
  end

  def user
    Comprehension.user_class.find_by(id: user_id)&.name
  end

  def updated_local_time
    updated_at.localtime.to_s
  end
end
