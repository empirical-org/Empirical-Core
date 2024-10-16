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
      system_prompt = Evidence::GenAI::PrimaryFeedback::PromptBuilder.run(prompt:, template_file:)

      prompt.example_sets(optimal:).each do |entry|
        response = feedback_api.run(system_prompt:, entry:)
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
    puts '' # new line after prints

    print_results(name, correct_count, total, incorrect_examples, error_count, error_examples)
  end

  # bundle exec thor gen_a_i_tasks:static_sample_test 2
  desc 'static_sample_test 2', 'Run to see if examplar optimals are labeled optimal by the prompt'
  def static_sample_test(limit = 10, optimal = true, template_file = nil)
    correct_count = 0
    total = 0
    error_count = 0
    incorrect_examples = []
    error_examples = []
    name = optimal ? 'Optimal' : 'Suboptimal'

    prompt_data = Evidence::GenAI::PrimaryFeedback::DataFetcher.run

    prompt_data.first(limit.to_i).each do |prompt_id, dataset|
      prompt = Evidence::Prompt.find(prompt_id)
      system_prompt = Evidence::GenAI::PrimaryFeedback::PromptBuilder.run(prompt:, template_file:)

      test_data = optimal ? dataset.optimals : dataset.suboptimals
      test_data.each do |entry|
        response = feedback_api.run(system_prompt:, entry:)
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
    puts '' # new line after prints

    print_results(name, correct_count, total, incorrect_examples, error_count, error_examples)
  end

  # bundle exec thor gen_a_i_tasks:static_full_test 2
  desc 'static_full_test  2', 'Run to see if examplar optimals are labeled optimal by the prompt'
  def static_full_test(limit = 50, template_file = nil)
    static_sample_test(limit, true, template_file)
    static_sample_test(limit, false, template_file)
  end

  # bundle exec thor gen_a_i_tasks:static_optimal_test 2
  desc 'static_optimal_test  2', 'Run to see if examplar optimals are labeled optimal by the prompt'
  def static_optimal_test(limit = 50, template_file = nil)
    static_sample_test(limit, true, template_file)
  end

  # bundle exec thor gen_a_i_tasks:static_suboptimal_test 'because' 2
  desc 'static_suboptimal_test 2', 'Run to see if examplar suboptimals are labeled suboptimal by the prompt'
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

  # bundle exec thor gen_a_i_tasks:prompt_entry 256 'some answer from student'
  desc "prompt_entry 256 'some answer from student'", 'Run to see system prompt and feedback for a given prompt / entry'
  def prompt_entry(prompt_id, entry, template_file: nil)
    prompt = Evidence::Prompt.find(prompt_id)
    system_prompt = Evidence::GenAI::PrimaryFeedback::PromptBuilder.run(prompt:, template_file:)

    puts system_prompt
    print_line
    puts "#{prompt.text}: #{entry}"
    print_line
    puts feedback_api.run(system_prompt:, entry:)
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

  SecondaryTestRow = Data.define(:description, :api, :model, :temperature, :prompt_text, :template, :sample_size, :similarity_score, :highlight_score, :highlight_percent)

  # bundle exec thor gen_a_i_tasks:secondary_feedback_test 2
  desc "secondary_feedback_test 'because' 5", 'Create a csv of the prompt test optimal and suboptimals with supporting info.'
  def secondary_feedback_test(description, limit = 2, temperature = 0)
    test_file = Evidence::GenAI::SecondaryFeedback::DataFetcher::FILE_TEST
    test_set = Evidence::GenAI::SecondaryFeedback::DataFetcher.run(file: test_file)

    results = []
    # Pull a random sample, but use the same seed so examples are consistent.
    test_subset = test_set.sample(limit.to_i, random: Random.new(1))
    highlight_matches = []
    similarities = []
    test_subset.each do |feedback_set|
      prompt = Evidence::Prompt.find(feedback_set.prompt_id)
      system_prompt = Evidence::GenAI::SecondaryFeedback::PromptBuilder.run(prompt:)

      response = secondary_api.run(system_prompt:, entry: feedback_set.primary, model: secondary_model)
      highlight_key = response[KEY_HIGHLIGHT] || 99
      llm_highlight = prompt.distinct_automl_highlight_arrays[highlight_key - 1] || []

      highlight_match = feedback_set.highlights == llm_highlight
      highlight_matches << highlight_match

      print highlight_match ? '.' : 'F'
      similarity = cosine_similarity(feedback_set.secondary, response[KEY_SECONDARY_FEEDBACK])
      similarities << similarity

      results << [
        prompt.id,
        prompt.text,
        feedback_set.sample_entry,
        feedback_set.primary,
        response[KEY_SECONDARY_FEEDBACK],
        feedback_set.secondary,
        similarity,
        highlight_match,
        llm_highlight.join('|'),
        feedback_set.highlights.join('|')
      ]
    end
    puts ''

    CSV.open(secondary_output_file(limit), 'wb') do |csv|
      csv << ['Prompt ID', 'Stem', 'Sample Response', 'Original Feedback', 'LLM Secondary', 'Curriculum Secondary', 'Secondary Similarity', 'Highlight Match', 'LLM Highlight', 'Curriculum Highlight']
      results.each { |result| csv << result }
    end
    highlight_match_count = highlight_matches.count(true)
    highlight_total = highlight_matches.count

    highlight_score = "#{highlight_match_count}/#{highlight_total}"
    highlight_percent = (100 * highlight_match_count / highlight_total.to_f).round(2)
    similarity_score = similarities.average

    puts "Highlight Matches: #{highlight_score}: #{highlight_percent}"
    puts "Similarity Score: #{similarity_score}"

    example_prompt = Evidence::Prompt.find(test_subset.first.prompt_id)
    result_row = SecondaryTestRow.new(
      description:,
      api: secondary_api,
      model: secondary_model,
      temperature:,
      prompt_text: secondary_template_text(example_prompt),
      template: secondary_template,
      sample_size: test_subset.size,
      highlight_score:,
      highlight_percent:,
      similarity_score:
    )
    # append results to test file
    CSV.open(secondary_test_runs_file, 'a') do |csv|
      csv << result_row.deconstruct
    end
  end

  # bundle exec thor gen_a_i_tasks:generate_secondary_data_files
  desc 'generate_secondary_data_files', 'Create a csv for training and test.'
  def generate_secondary_data_files
    file_all = Evidence::GenAI::SecondaryFeedback::DataFetcher::FILE_ALL
    file_train = Evidence::GenAI::SecondaryFeedback::DataFetcher::FILE_TRAIN
    file_test = Evidence::GenAI::SecondaryFeedback::DataFetcher::FILE_TEST

    full_set = Evidence::GenAI::SecondaryFeedback::DataFetcher.run(file: file_all)
    file_test = Evidence::GenAI::SecondaryFeedback::DataFetcher.new(file: file_test).send(:file_path)
    file_train = Evidence::GenAI::SecondaryFeedback::DataFetcher.new(file: file_train).send(:file_path)

    test_set = full_set.select { |f| f.activity_id.in?(TEST_SET_ACTIVITY_IDS) }
    train_set = full_set.reject { |f| f.activity_id.in?(TEST_SET_ACTIVITY_IDS) }

    CSV.open(file_test, 'wb') do |csv|
      csv << SECONDARY_CSV_HEADERS
      test_set.each { |result| csv << result.to_a }
    end

    CSV.open(file_train, 'wb') do |csv|
      csv << SECONDARY_CSV_HEADERS
      train_set.each { |result| csv << result.to_a }
    end
  end

  Repeated = Data.define(:activity_id, :prompt_id, :original, :different, :paraphrase)

  # bundle exec thor gen_a_i_tasks:generate_repeated_data_file
  desc 'generate_repeated_data_file', 'Create a csv for example data.'
  def generate_repeated_data_file
    file_all = Evidence::GenAI::SecondaryFeedback::DataFetcher::FILE_ALL
    full_set = Evidence::GenAI::SecondaryFeedback::DataFetcher.run(file: file_all)

    total = full_set.size

    new_data = full_set
      .map.with_index { |fs, index|
        puts "#{index + 1} of #{total}"
        Repeated.new(
          activity_id: fs.activity_id,
          prompt_id: fs.prompt_id,
          original: fs.primary,
          different: full_set.select { |f| f.prompt_id == fs.prompt_id && f.rule_id != fs.rule_id }.sample.primary,
          paraphrase: paraphrase(fs.primary)
        )
      }

    CSV.open("#{repeated_folder}all.csv", 'wb') do |csv|
      csv << Repeated.members.map(&:to_s)
      new_data.each { |data| csv << data.deconstruct }
    end
  end

  # bundle exec thor gen_a_i_tasks:generate_repeated_test_files
  desc 'generate_repeated_test_files', 'Generate test.csv and train.csv files from all.csv'
  def generate_repeated_test_files
    csv_data = CSV.read("#{repeated_folder}all.csv", headers: true)
    full_set = csv_data.map { |d| Repeated.new(**d) }

    test_set = full_set.select { |f| f.activity_id.to_i.in?(TEST_SET_ACTIVITY_IDS) }
    train_set = full_set.reject { |f| f.activity_id.to_i.in?(TEST_SET_ACTIVITY_IDS) }

    save_repeated_file('test.csv', test_set)
    save_repeated_file('train.csv', train_set)
  end

  RepeatedResult = Data.define(:activity_id, :prompt_id, :original, :different, :repeated_different, :paraphrase, :repeated_paraphrase)
  RepeatedTestRow = Data.define(:description, :api, :model, :temperature, :prompt_text, :template, :sample_size, :different_score, :different_percent, :similar_score, :similar_percent, :matrix)

  # bundle exec thor gen_a_i_tasks:repeated_feedback_test 'gemini new prompt with examples' 2
  desc 'repeated_feedback_test description limit', 'Test a number or entries from the test.csv file'
  def repeated_feedback_test(description, limit = 150, temperature = 1)
    csv_data = CSV.read("#{repeated_folder}test.csv", headers: true)
    test_set = csv_data.first(limit.to_i).map { |d| Repeated.new(**d) }

    results = []

    test_set.each do |data|
      # test difference
      repeated_different = repeated_feedback?(data.original, [data.different], temperature.to_i)
      # test similar
      repeated_paraphrase = repeated_feedback?(data.original, [data.paraphrase], temperature.to_i)

      params = data.to_h.merge(repeated_different:, repeated_paraphrase:)

      results << RepeatedResult.new(**params)
    end
    total = results.size
    different_correct = results.count { |r| !r.repeated_different }
    paraphrase_correct = results.count { |r| r.repeated_paraphrase }

    different_score = "#{different_correct}/#{total}"
    different_percent = ((different_correct / total.to_f) * 100).round(2).to_s

    similar_score = "#{paraphrase_correct}/#{total}"
    similar_percent = ((paraphrase_correct / total.to_f) * 100).round(2).to_s

    puts "Difference: #{different_score} | #{different_percent}"
    puts "Similar: #{similar_score} | #{similar_percent}"

    CSV.open(repeated_output_file(limit), 'wb') do |csv|
      csv << RepeatedResult.members.map(&:to_s)
      results.each { |data| csv << data.deconstruct }
    end

    matrix = [[different_correct, total - different_correct], [total - paraphrase_correct, paraphrase_correct]].to_s

    result_row = RepeatedTestRow.new(
      description:,
      api: repeat_api,
      model: repeat_model,
      temperature:,
      prompt_text: repeat_template_text,
      template: repeat_template,
      sample_size: total * 2,
      different_score:,
      different_percent:,
      similar_score:,
      similar_percent:,
      matrix:
    )

    # append results to test file
    CSV.open(repeat_test_runs_file, 'a') do |csv|
      csv << result_row.deconstruct
    end
  end

  # bundle exec thor gen_a_i_tasks:repeated_generate_examples 2
  desc 'repeated_generate_examples limit', 'print some examples to the screen for use in prompt'
  def repeated_generate_examples(limit = 150)
    csv_data = CSV.read("#{repeated_folder}train.csv", headers: true)
    train_set = csv_data.to_a[1..].sample(limit.to_i).map { |d| Repeated.new(*d) }

    3.times { print_line }

    train_set.each do |data|
      entry = strip_tags(data.original)
      different = strip_tags(data.different)
      similar = strip_tags(data.paraphrase)

      nonrepeat = { entry:, list: "1. #{different}", repeat_feedback: false }
      repeat = { entry:, list: "1. #{similar}", repeat_feedback: true }
      puts nonrepeat.to_json
      puts repeat.to_json
    end
  end

  # bundle exec thor gen_a_i_tasks:secondary_prompt_entry 753 'Keep revising! Try to be even more specific. What did Black South African students do to show that they opposed segregated schools?  Read the highlighted text for ideas.'
  desc "secondary_prompt_entry 256 'some feedback'", 'Run to see system prompt and feedback for a given prompt / entry'
  def secondary_prompt_entry(prompt_id, feedback_primary, template_file: nil)
    prompt = Evidence::Prompt.find(prompt_id)
    system_prompt = Evidence::GenAI::SecondaryFeedback::PromptBuilder.run(prompt:, template_file:)

    puts system_prompt
    print_line
    puts "Original Feedback: #{feedback_primary}"
    print_line
    puts secondary_api.run(system_prompt:, entry: feedback_primary, model: secondary_model)
  end

  # bundle exec thor gen_a_i_tasks:repeated_feedback_prompt_entry 'some feedback' 'feedback in history'
  desc "repeated_feedback_prompt_entry 'some feedback' 'feedback in history'", 'Run to see system prompt and response'
  def repeated_feedback_prompt_entry(entry, previous)
    prompt = Evidence::Prompt.first
    history_item = Evidence::GenAI::HistoryItem.new(user: 'unused', assistant: previous)
    system_prompt = Evidence::GenAI::RepeatedFeedback::PromptBuilder.run(prompt:, history: [history_item])

    puts system_prompt
    print_line
    puts entry
    print_line
    puts repeat_api.run(system_prompt:, entry:, model: repeat_model)
  end

  # bundle exec thor gen_a_i_tasks:example_check
  desc 'example_check', 'Run to see system prompt and feedback for a given prompt / entry'
  def example_check
    prompt = Evidence::Prompt.last
    entry = 'because it is good.'

    previous = [
      { 'feedback' => 'Clear your response and try again. Think about what specific actions Korean leaders took to remove the pirates. Can you mention a specific strategy they used?' },
      { 'feedback' => 'Clear your response and try again. Think about a specific action or strategy that Korean leaders used to remove Wokou pirates. What did they do to discourage piracy?' },
      { 'feedback' => 'Clear your response and try again. Can you think of a specific way Korean leaders tried to stop the pirates, using information from the text?' }
    ]

    start_time = Time.zone.now
    check = Evidence::Check::GenAI.new(entry, prompt, previous)
    response = check.run
    end_time = Time.zone.now

    puts 'System Prompt'
    puts check.send(:system_prompt)
    print_line
    puts "Original Response: #{check.send(:primary_response)}"
    print_line
    puts "Repeated Feedback?: #{check.send(:repeated_feedback?)}"
    print_line
    puts 'Secondary Prompt'
    puts check.send(:secondary_feedback_prompt)
    print_line
    puts "Secondary Response: #{check.send(:secondary_feedback_response)}"
    print_line
    puts response
    puts "Time elapsed: #{end_time - start_time} seconds"
  end

  desc 'populate_concepts_and_rules', 'Seed the 3 GenAI concepts, the 6 rules needed by the system'
  def populate_concepts_and_rules
    concept_mapping = {
      'because' => 'qkjnIjFfXdTuKO7FgPzsIg',
      'but' => 'KwspxuelfGZQCq7yX6ThPQ',
      'so' => 'IBdOFpAWi42LgfXvcz0scQ'
    }
    rules_uids_optimal = Evidence::GenAI::ResponseBuilder::RULES_OPTIMAL
    rule_uids_suboptimal = Evidence::GenAI::ResponseBuilder::RULES_SUBOPTIMAL

    Evidence::Prompt::CONJUNCTIONS.each do |conjunction|
      [true, false].each do |optimal|
        uid_mapping = optimal ? rules_uids_optimal : rule_uids_suboptimal

        Evidence::Rule.create(
          uid: uid_mapping[conjunction],
          concept_uid: concept_mapping[conjunction],
          universal: true,
          rule_type: Evidence::Rule::TYPE_GEN_AI,
          optimal:,
          state: 'active',
          name: "GenAI universal #{conjunction} - #{optimal ? 'optimal' : 'suboptimal'}"
        )
      end
    end
  end

  # put helper methods in this block
  no_commands do
    KEY_OPTIMAL = 'optimal'
    KEY_FEEDBACK = 'feedback'
    KEY_SECONDARY_FEEDBACK = 'secondary_feedback'
    KEY_HIGHLIGHT = 'highlight'
    TEST_SET_ACTIVITY_IDS = [467, 460, 442, 435, 431, 387]
    SECONDARY_CSV_HEADERS = %w[activity_id prompt_id conjunction rule_id label sample_entry feedback_primary feedback_secondary highlights_secondary]
    GEN_AI_OUTPUT_FOLDER = ENV.fetch('GEN_AI_OUTPUT_FOLDER', Rails.root.join('/lib/data/'))

    private def feedback_api = Evidence::Check::GenAI::FEEDBACK_API
    private def repeat_api = Evidence::Check::GenAI::REPEAT_API
    private def secondary_api = Evidence::Check::GenAI::SECONDARY_API

    private def repeat_model = repeat_api::SMALL_MODEL
    private def secondary_model = secondary_api::SMALL_MODEL

    private def secondary_template_text(prompt) = Evidence::GenAI::SecondaryFeedback::PromptBuilder.new(prompt:).send(:template)
    private def secondary_template = Evidence::GenAI::SecondaryFeedback::PromptBuilder.new(prompt: nil).template_file

    private def repeat_template_text = Evidence::GenAI::RepeatedFeedback::PromptBuilder.new(prompt: nil).send(:template)
    private def repeat_template = Evidence::GenAI::RepeatedFeedback::PromptBuilder.new(prompt: nil).template_file

    private def repeated_feedback?(feedback, history, temperature)
      system_prompt = Evidence::GenAI::RepeatedFeedback::PromptBuilder.run(prompt: nil, history:)

      llm_response = repeat_api.run(system_prompt:, entry: strip_tags(feedback), model: repeat_model, temperature:)

      puts llm_response

      !!llm_response[Evidence::GenAI::RepeatedFeedback::Checker::KEY_REPEAT]
    end

    private def cosine_similarity(text1, text2) = embeddings(text1).cosine_similarity(embeddings(text2))

    private def embeddings(text) = Evidence::OpenAI::EmbeddingFetcher.run(input: strip_tags(text))

    private def strip_tags(text) = Evidence::HTMLTagRemover.run(text.chomp)

    private def paraphrase(entry)
      result = Evidence::OpenAI::Chat.run(
        system_prompt: "rephrase the user's entry with some synonyms. Return as JSON with one key `text`",
        entry:,
        model: 'gpt-4o-mini'
      )

      result['text']
    end

    private def save_repeated_file(name, dataset)
      CSV.open("#{repeated_folder}#{name}", 'wb') do |csv|
        csv << Repeated.members.map(&:to_s)
        dataset.each { |data| csv << data.deconstruct }
      end
    end

    private def repeat_test_runs_file = Evidence::Engine.root.join('app/services/evidence/gen_ai/repeated_feedback/results/test_runs.csv')
    private def secondary_test_runs_file = Evidence::Engine.root.join('app/services/evidence/gen_ai/secondary_feedback/results/test_runs.csv')

    private def repeated_output_file(limit)
      "#{GEN_AI_OUTPUT_FOLDER}repeated_feedback_#{limit}_#{Time.now.to_i}.csv"
    end

    def repeated_folder
      Evidence::Engine.root.join('app/services/evidence/gen_ai/repeated_feedback/data/')
    end

    private def output_file(conjunction, limit)
      Rails.root + "lib/data/gen_ai_test_csv_#{conjunction}_#{limit}.csv"
    end

    private def secondary_output_file(limit)
      "#{GEN_AI_OUTPUT_FOLDER}secondary_feedback_#{limit}_#{Time.now.to_i}.csv"
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
