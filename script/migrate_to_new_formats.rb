story_class = ActivityClassification.find_by_key!('story')
practice_class = ActivityClassification.find_by_key!('practice_question_set')

chapters = if ARGV.any?
  [Chapter.find(ARGV.last)]
else
  raise 'no ARGV'
end

chapters.each do |chapter|
  chapter_attributes = chapter.attributes.symbolize_keys.dup

  id         = chapter_attributes.delete(:id)
  created_at = chapter_attributes.delete(:created_at)
  updated_at = chapter_attributes.delete(:updated_at)

  topic    = { id: id, created_at: created_at, updated_at: updated_at }
  story    = {         created_at: created_at, updated_at: updated_at, topic_id: id, data: {}, classification_key: 'story' }
  practice = {         created_at: created_at, updated_at: updated_at, topic_id: id, data: {}, classification_key: 'practice_question_set' }

  topic[:name] = chapter_attributes.delete(:title)
  topic[:section_id] = chapter_attributes.delete(:chapter_level_id)

  story[:name] = chapter_attributes.delete(:article_header)
  story[:description] = chapter.description
  story[:data][:instructions] = chapter.assessment.instructions
  story[:data][:body] = chapter.assessment.body
  # story[:data].merge!(chapter_attributes)

  practice[:name] = chapter.practice_description
  practice[:description] = chapter.description
  practice[:data][:rule_position] = chapter.rule_position.to_yaml

  Section.find(topic[:section_id]).update_column :workbook_id, chapter_attributes.delete(:workbook_id)

  topic    = Topic.create!(topic)
  story    = Activity.create!(story)
  practice = Activity.create!(practice)

  puts 'migrating '+topic.name
  puts chapter.classroom_chapters.count.to_s + ' to migrate'

  chapter.classroom_chapters.each do |classroom_chapter|
    (puts 'nexting' && next) if classroom_chapter.temporary
    (puts 'nexting' && next) if classroom_chapter.classroom.nil?

    [story, practice].each do |activity|
      classroom_activity = activity.classroom_activities.create!(
        activity: activity,
        classroom: classroom_chapter.classroom,
        due_date: classroom_chapter.due_date,
        unit: (classroom_chapter.classroom.units.first || classroom_chapter.classroom.units.create!(name: 'Unit 1'))
      )

      classroom_chapter.scores.each do |score|
        state = case score.state
        when 'trashed' then 'trashed'
        when 'unstarted' then 'unstarted'
        when 'finished' then 'finished'
        else
          'started'
        end

        session_data = if activity.classification == story_class
          hash = {}
          hash[:story_step_input] = score.story_step_input.to_yaml

          begin
            hash[:missed_rules] = score.missed_rules.to_yaml
          rescue Chunk::MissingChunkError
          end

          hash
        else
          {}
        end

        session = classroom_activity.activity_sessions.create!(
          classroom_activity: classroom_activity,
          user: score.user,
          pairing_id: SecureRandom.urlsafe_base64,
          percentage: score[:grade],
          state: state,
          time_spent: nil,
          completed_at: score.completion_date,
          data: session_data,
          temporary: classroom_chapter.temporary
        )

        step = if activity.classification == story_class then 'review' else 'practice' end

        score.inputs.where(step: step).each do |input|
          input.update_attributes! activity_session_id: session.uid
        end
      end
    end

  end
end

puts 'fin.'
