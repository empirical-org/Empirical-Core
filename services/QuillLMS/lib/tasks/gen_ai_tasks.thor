# frozen_string_literal: true

require_relative '../../config/environment'

class GenAITasks < Thor

  # bundle exec thor gen_a_i_tasks:optimal_test 'because' 2
  desc "optimal_test 'because' 2", 'Run to see if examplar optimals are labeled optimal by the prompt'
  def optimal_test(conjunction, limit = 10, template_file = nil)

    optimal_count = 0
    total = 0
    suboptimals = []

    all_live_prompts(conjunction, limit).each do |prompt|
      system_prompt = Evidence::GenAI::SystemPromptBuilder.run(prompt:, template_file:)

      [prompt.first_strong_example, prompt.second_strong_example].each do |entry|
        response = Evidence::OpenAI::Chat.run(system_prompt:, entry:)

        total += 1
        if response[KEY_OPTIMAL]
          print '.'
          optimal_count += 1
        else
          print 'F'
          suboptimals.append([prompt, entry, response[KEY_FEEDBACK]])
        end
      end
    end
    puts '' # new line after prints

    print_results(optimal_count, total, suboptimals)
  end

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

  # put helper methods in this block
  no_commands do
    KEY_OPTIMAL = 'optimal'
    KEY_FEEDBACK = 'feedback'

    private def live_activity_ids
      Activity.evidence_live_flags.evidence.pluck(:id)
    end

    private def all_live_prompts(conjunction, limit = 10)
      Evidence::Prompt
        .parent_activity_ids(live_activity_ids)
        .conjunction(conjunction)
        .limit(limit)
    end

    private def print_line
      puts '---------------'
    end

    private def print_results(optimal_count, total, suboptimals)
      print_line
      puts "Correct Optimal Percentage: #{((optimal_count.to_f / total.to_f) * 100).round(2)}"
      puts "Optimal Correct: #{optimal_count}"
      puts "Total: #{total}"
      print_line
      puts 'Suboptimals'
      suboptimals.each do |suboptimal|
        prompt, entry, feedback = suboptimal
        puts "Prompt: #{prompt.id}, Entry: #{entry}, Feedback: #{feedback}"
        puts " "
        puts "bundle exec thor gen_a_i_tasks:prompt_entry #{prompt.id} '#{entry}'"
        print_line
      end
    end
  end
end
