class MigrateToNewFormats < ActiveRecord::Migration
  def change
    create_table :activity_classifications, force: true do |t|
      t.string :name
      t.string :key, null: false
      t.index :key, unique: true

      t.timestamps
    end

    create_table :activities, force: true do |t|
      t.hstore :data
      t.belongs_to :activity_classification
      t.belongs_to :topic

      t.timestamps
    end

    create_table :topics, force: true do |t|
      t.string :name
      t.belongs_to :section

      t.timestamps
    end

    create_table :classroom_activities, force: true do |t|
      t.belongs_to :classroom
      t.belongs_to :activity
      t.datetime :due_date
      t.boolean :temporary

      t.timestamps
    end

    create_table :activity_enrollments, force: true do |t|
      t.belongs_to :classroom_activity
      t.belongs_to :user

      t.string :pairing_id
      t.float :percentage
      t.string :state, default: 'unstarted', null: false
      t.integer :time_spent
      t.timestamp :completed_at

      t.hstore :data
      t.index :pairing_id, unique: true
    end

    remove_column :scores, :practice_step_input
    remove_column :scores, :review_step_input
    remove_column :scores, :items_missed
    remove_column :scores, :lessons_completed
    remove_column :scores, :score_values

    rename_table :chapter_levels, :sections
    change_table :sections do |t|
      t.belongs_to :workbook
    end

    reversible { |d| d.up &method(:up) }
  end

  def up
    story_class = ActivityClassification.create!(
      name: 'Story',
      key: 'story'
    )

    practice_class = ActivityClassification.create(
      name: 'Practice Questions',
      key: 'practice_question_set'
    )

    ActivityClassification.destroy_all
    Activity.destroy_all
    RuleQuestionInput.includes(:rule_question).where('rule_questions.id is null').map(&:destroy)

    Chapter.all.each do |chapter|
      chapter_attributes = chapter.attributes.symbolize_keys.dup

      id         = chapter_attributes.delete(:id)
      created_at = chapter_attributes.delete(:created_at)
      updated_at = chapter_attributes.delete(:updated_at)

      topic    = { id: id, created_at: created_at, updated_at: updated_at }
      story    = {         created_at: created_at, updated_at: updated_at, topic_id: id, data: {}, classification_key: 'story' }
      practice = {         created_at: created_at, updated_at: updated_at, topic_id: id, data: {}, classification_key: 'practice' }

      topic[:name] = chapter_attributes.delete(:title)
      topic[:section_id] = chapter_attributes.delete(:chapter_level_id)

      story[:data][:name] = chapter_attributes.delete(:article_header)
      story[:data][:body] = chapter.assessment.body
      story[:data][:instructions] = chapter.assessment.instructions
      story[:data].merge!(chapter_attributes)

      Section.find(topic[:section_id]).update_column :workbook_id, chapter_attributes.delete(:workbook_id)

      topic    = Topic.create(topic)
      story    = Activity.create(story)
      practice = Activity.create(practice)

      chapter.classroom_chapters.each do |classroom_chapter|
        next if classroom_chapter.temporary

        [story, practice].each do |activity|
          classroom_activity = activity.classroom_activities.create!(
            activity: activity,
            classroom: classroom_chapter.classroom,
            due_date: classroom_chapter.due_date,
            temporary: classroom_chapter.temporary
          )

          classroom_chapter.scores.each do |score|
            enrollment = classroom_activity.activity_enrollments.create!(
              classroom_activity: classroom_activity,
              user: score.user,
              pairing_id: SecureRandom.urlsafe_base64,
              percentage: score.grade,
              state: score.state,
              time_spent: nil,
              completed_at: score.completion_date
            )

            # if activity.classification == story_class
            #   enrollment.data = {
            #     t
            #   }
            # else

            # end
          end
        end

      end
    end

    puts 'fin.'
  end
end
