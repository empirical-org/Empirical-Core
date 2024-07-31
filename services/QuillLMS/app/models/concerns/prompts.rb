
module Prompts
  def prompt_start(locale:)
      <<~STRING
        You are going to do a translation from english to #{locale} using simple words and language at a 5th grade reading level. Use shorter words over longer if possible. The tone should be somewhat casual. Return just the translated text preserving (but not translating) the HTML.

        We are translating the instructions and feedback for an English-language grammar activity. The content of the activity itself is not translated.

      STRING
  end

  def open_ai_prompt(locale:)
    "#{prompt_start(locale:)}#{custom_prompt}#{examples}\n text to translate: "
  end

  private def custom_prompt
    config_yaml['custom_prompt']
  end

  private def config_filename = "#{self.class.name.underscore}.yml"
  private def config_file = Rails.root.join('app/models/translation_config', config_filename)
  private def config_yaml = YAML.load_file(config_file)

  private def examples
    examples = config_yaml['examples']
    return '' unless examples.present?

    formatted_examples = "Examples: \n"
    examples.each_with_index do |example, index|
      formatted_examples += "#{index + 1}. English: \"#{example['english']}\"\n"
      formatted_examples += "   Spanish: \"#{example['spanish']}\"\n\n"
    end
    formatted_examples
  end
end
