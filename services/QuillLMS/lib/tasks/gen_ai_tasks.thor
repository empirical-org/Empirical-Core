# frozen_string_literal: true

require_relative '../../config/environment'

class GenAITasks < Thor

  # bundle exec thor gen_a_i_tasks:optimal_test 'because' 2
  desc "sample_test 'because' 2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def sample_test(conjunction, limit = 10, optimal = true, template_file = nil)
    correct_count = 0
    total = 0
    error_count = 0
    incorrect_examples = []
    error_examples = []
    name = optimal ? 'Optimal' : 'Suboptimal'

    all_live_prompts(conjunction, limit).each do |prompt|
      system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:, template_file:)

      prompt.example_sets(optimal:).each do |entry|
        begin
          response = Evidence::OpenAI::Chat.run(system_prompt:, entry:)
          total += 1

          if response[KEY_OPTIMAL] == optimal
            print '.'
            correct_count += 1
          else
            print 'F'
            incorrect_examples.append([prompt, entry, response[KEY_FEEDBACK]])
          end
        rescue => e
          error_count += 1
          error_examples.append([prompt, entry])
        end
      end
    end
    puts '' # new line after prints

    print_results(name, correct_count, total, incorrect_examples, error_count, error_examples)
  end

  # bundle exec thor gen_a_i_tasks:static_sample_test 2
  desc "static_sample_test 2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def static_sample_test(limit = 10, optimal = true, template_file = nil)
    correct_count = 0
    total = 0
    error_count = 0
    incorrect_examples = []
    error_examples = []
    name = optimal ? 'Optimal' : 'Suboptimal'

    prompt_data = Evidence::GenAI::OptimalBoundaryDataFetcher.run

    prompt_data.first(limit.to_i).each do |prompt_id, dataset|
      prompt = Evidence::Prompt.find(prompt_id)
      system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:, template_file:)

      test_data = optimal ? dataset.optimals : dataset.suboptimals
      test_data.each do |entry|
        begin
          response = Evidence::OpenAI::Chat.run(system_prompt:, entry:)
          total += 1

          if response[KEY_OPTIMAL] == optimal
            print '.'
            correct_count += 1
          else
            print 'F'
            incorrect_examples.append([prompt, entry, response[KEY_FEEDBACK]])
          end
        rescue => e
          error_count += 1
          error_examples.append([prompt, entry])
        end
      end
    end
    puts '' # new line after prints

    print_results(name, correct_count, total, incorrect_examples, error_count, error_examples)
  end

  # bundle exec thor gen_a_i_tasks:static_full_test 2
  desc "static_full_test  2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def static_full_test(limit = 50, template_file = nil)
    static_sample_test(limit, true, template_file)
    static_sample_test(limit, false, template_file)
  end

  # bundle exec thor gen_a_i_tasks:static_optimal_test 2
  desc "static_optimal_test  2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def static_optimal_test(limit = 50, template_file = nil)
    static_sample_test(limit, true, template_file)
  end

  # bundle exec thor gen_a_i_tasks:static_suboptimal_test 'because' 2
  desc "static_suboptimal_test 2", 'Run to see if examplar suboptimals are labeled suboptimal by the prompt'
  def static_suboptimal_test(limit = 50, template_file = nil)
    static_sample_test(limit, false, template_file)
  end

  # bundle exec thor gen_a_i_tasks:full_test 'because' 2
  desc "optimal_test 'because' 2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def full_test(conjunction, limit = 10, template_file = nil)
    sample_test(conjunction, limit, true, template_file)
    sample_test(conjunction, limit, false, template_file)
  end

  # bundle exec thor gen_a_i_tasks:optimal_test 'because' 2
  desc "optimal_test 'because' 2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def optimal_test(conjunction, limit = 10, template_file = nil)
    sample_test(conjunction, limit, true, template_file)
  end

  # bundle exec thor gen_a_i_tasks:optimal_test 'because' 2
  desc "suboptimal_test 'because' 2", 'Run to see if examplar suboptimals are labeled suboptimal by the prompt'
  def suboptimal_test(conjunction, limit = 10, template_file = nil)
    sample_test(conjunction, limit, false, template_file)
  end

  # bundle exec prompt_entry 256 'some answer from student'
  desc "prompt_entry 256 'some answer from student'", 'Run to see system prompt and feedback for a given prompt / entry'
  def prompt_entry(prompt_id, entry, template_file: nil)
    prompt = Evidence::Prompt.find(prompt_id)
    system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:, template_file:)

    puts system_prompt
    print_line
    puts "#{prompt.text}: #{entry}"
    print_line
    puts Evidence::OpenAI::Chat.run(system_prompt:, entry:)
  end

  desc "test_csv 'because' 5", 'Create a csv of the prompt test optimal and suboptimals with supporting info.'
  def test_csv(conjunction = 'because', limit = 50)
    CSV.open(output_file(conjunction, limit), 'wb') do |csv|
      csv << csv_headers
      all_live_prompts(conjunction, limit).each do |prompt|
        csv << prompt_csv_row(prompt)
      end
    end
  end

  desc "secondary_feedback_test 'because' 5", 'Create a csv of the prompt test optimal and suboptimals with supporting info.'
  def secondary_feedback_test(limit = 2)
    test_file = Evidence::GenAI::SecondaryFeedbackDataFetcher::TEST_FILE
    test_set = Evidence::GenAI::SecondaryFeedbackDataFetcher.run(test_file)

    results = []
    # Pull a random sample, but use the same seed so examples are consistent.
    test_subset = test_set.sample(limit.to_i, random: Random.new(1))
    test_subset.each do |feedback_set|
      prompt = Evidence::Prompt.find(feedback_set.prompt_id)
      system_prompt = Evidence::GenAI::SecondaryFeedbackPromptBuilder.run(prompt:)
      entry = feedback_set.primary

      response = Evidence::OpenAI::Chat.run(system_prompt:, entry:, model: 'gpt-4o-mini')
      highlight_key = response[KEY_HIGHLIGHT] || 99
      highlight = prompt.distinct_automl_highlight_texts[highlight_key - 1]

      results << [prompt.id, entry, response[KEY_SECONDARY_FEEDBACK], feedback_set.secondary, highlight]
    end

    CSV.open(secondary_output_file(limit), 'wb') do |csv|
      csv << ['Prompt ID', 'Original Feedback', 'LLM Secondary', 'Curriculum Secondary', 'LLM Highlight']
      results.each { |result| csv << result }
    end
  end

  # put helper methods in this block
  no_commands do
    KEY_OPTIMAL = 'optimal'
    KEY_FEEDBACK = 'feedback'
    KEY_SECONDARY_FEEDBACK = 'secondary_feedback'
    KEY_HIGHLIGHT = 'highlight'

    private def output_file(conjunction, limit)
      Rails.root + "lib/data/gen_ai_test_csv_#{conjunction}_#{limit}.csv"
    end

    private def secondary_output_file(limit)
      Rails.root + "lib/data/secondary_feedback_#{limit}_#{Time.now.to_i}.csv"
    end

    private def prompt_csv_row(prompt)
      [
        prompt.activity_id,
        prompt.id,
        activity_link_string(prompt.activity_id),
        prompt.conjunction,
        prompt.plagiarism_text,
        prompt.text,
        prompt.example_sets(optimal: true, limit: 2),
        prompt.example_sets(optimal: false, limit: 2)
      ].flatten
    end

    private def csv_headers
      [
        'Evidence Activity ID',
        'Prompt ID',
        'Link',
        'Conjunction',
        'Plagiarism Text',
        'Stem',
        'Optimal 1',
        'Optimal 2',
        'Suboptimal 1',
        'Suboptimal 2'
      ]
    end

    private def activity_link_string(activity_id) = format('https://www.quill.org/cms/evidence#/activities/%<activity_id>s/settings', activity_id:)

    private def live_activity_ids
      Activity.evidence_live_flags.evidence.pluck(:id)
    end

    private def all_live_prompts(conjunction, limit = 10)
      Evidence::Prompt
        .parent_activity_ids(live_activity_ids)
        .conjunction(conjunction)
        .order(id: :desc)
        .limit(limit)
    end

    private def print_line
      puts '---------------'
    end

    private def print_results(name, correct_count, total, incorrect_examples, error_count, error_examples)
      print_line
      puts "Correct #{name} Percentage: #{((correct_count.to_f / total) * 100).round(2)}"
      puts "#{name} Correct: #{correct_count}"
      puts "Total: #{total}"
      puts "Errors: #{error_count}"
      print_line

      puts 'Incorrect'
      print_line
      puts 'None' if incorrect_examples.empty?
      incorrect_examples.each do |incorrect|
        prompt, entry, feedback = incorrect
        print_example(prompt.id, entry, feedback)
      end

      puts 'Errors'
      print_line
      puts 'None' if error_examples.empty?
      error_examples.each do |error|
        prompt, entry = error
        print_example(prompt.id, entry)
      end
    end

    private def print_example(prompt_id, entry, feedback = nil)
      puts "Prompt: #{prompt_id}, Entry: #{entry} #{feedback.nil? ? '' : " Feedback: #{feedback}"}"
      puts ' '
      puts "bundle exec thor gen_a_i_tasks:prompt_entry #{prompt_id} \"#{entry}\""
      print_line
    end
  end
end
