# frozen_string_literal: true

module Evidence
  class DataGeneration
    NFL_PASSAGE = "It would have been Julio Jones’ first touchdown as the Tennessee Titans’ wide receiver, and it couldn’t have come at a better time: with just over a minute to go in the first half, the trailing Titans needed a touchdown to start catching up to the Seattle Seahawks. Fans held their breath as the ball spiraled toward Jones—who caught it as he leapt into the end zone. Touchdown! Jones’ fellow Titans ran toward him to celebrate.
But their celebration would soon turn sour. As a scoring play, Jones’ touchdown was subject to an automatic review. Had his whole foot landed within the end zone? Officials scrutinized the instant replay footage and determined that Jones’ heel was out of bounds. The touchdown was overturned.
Instant Replay Takes Off
Whenever a point is scored or a coach challenges a call made on the field, replay officials are called to action. Using a video recording called instant replay, replay officials view the same play from different angles, often in slow motion. Replay officials can either confirm that the call made on the field was accurate or correct the call if necessary.
The National Football League (NFL) began experimenting with instant replay in the 1970s. Right away, they recognized that instant replay had the potential to make football games more accurate. Slow-motion replay footage can help officials pinpoint small but crucial errors that they couldn’t see otherwise, like Jones’ out-of-bounds heel.
Instant replay can also remove individual referee bias. Because the officials reviewing replays are different from the officials on the field, players and fans can be confident that one biased official alone will never throw a game. As the former NFL director of officiating said when instant replay was first introduced, “Replay gives us a better chance to walk off the field error-free.”
An Instant Controversy
But not everyone agrees. Some critics say the rules of the game weren’t written to account for being able to see barely perceptible ball movements. For example, an imprecise definition of what counts as a “catch” caused problems once instant replay was introduced. One player’s catch was ruled incomplete after an instant replay review because his hands had left the ball for a split second—even though the play looked perfect to the naked eye.
Critics also argue that the pursuit of perfect calls has removed the valuable human connection between players and referees. An official off the field making a call based on a slow-motion video can make the game feel less personal.
“I miss the human element of trusting the officials to make the calls in the moment and then the rest of us having to live with what they called,” Seahawks head coach Pete Carroll told NBC. “I really liked the game better when the officials were just as much a part of the game as the players.”
On Further Review
Despite the controversies surrounding instant replay, it’s likely here to stay. The NFL’s confidence in the power of instant replay to make the sport more accurate has led to an increased reliance on replay technology. In 2007, the NFL voted to make instant replay a permanent feature of the game. Four years later, the league expanded its use of instant replay even further by beginning to automatically review all plays where a point is scored.
For players like Jones, instant replays can lead to heartbreak—but at the end of the day, they’re just part of the modern game. “I felt like I was in. I felt like I scored,” he told reporters after the game. \“But it’s not my place to do [the replay officials’] job. They’re professionals at what they do.\""

    NFL_BECAUSE = "Instant replay can make NFL games more accurate because"
    NFL_BUT = "Instant replay can make NFL games more accurate, but"
    NFL_SO = "Instant replay can make NFL games more accurate, so"

    NFL_NOUNS = ['the NFL', 'officials', 'players', 'coaches', 'instant replay', 'it', 'they']

    Result = Struct.new(:text, :seed, keyword_init: true)

    WORD_SPLIT_COUNT = 70
    SPACE = ' '
    BLANK = ''
    PERIOD = '.'

    FULL_COUNT = 100
    FULL_NOUN_COUNT = 50
    SECTION_COUNT = 50

    TEMP_PASSAGE = 1
    TEMP_SECTION = 0.5 # give a lower temp (creativity) when it has less info

    attr_reader :passage, :stem, :nouns, :results


    # passage = Evidence::DataGeneration::NFL_PASSAGE
    # stem = Evidence::DataGeneration::NFL_BECAUSE
    # nouns = Evidence::DataGeneration::NFL_NOUNS
    # generation = Evidence::DataGeneration.new(passage: passage, stem: stem, nouns: nouns)
    # generation.run

    # file_path = "/Users/danieldrabik/Dropbox/quill/synthetic/test_generation_#{Time.current.strftime('%Y-%m-%d-%T')}.csv"
    # generaton.to_csv(file_path)

    def initialize(passage:, stem:, nouns: [])
      @passage = passage
      @stem = stem
      @nouns = nouns
      @results = []
    end

    def run
      # whole passage plus prompt
      prompt = prompt_text(context: passage)
      run_prompt(prompt: prompt, count: FULL_COUNT, seed: 'full_passage')
      # whole passage plus prompt for each noun
      nouns.each do |noun|
        prompt = prompt_text(context: passage, noun: noun)
        run_prompt(prompt: prompt, count: FULL_NOUN_COUNT, noun: noun, seed: "full_passage_noun_#{noun.gsub(SPACE,BLANK)}")
      end

      # chunks plus prompt
      split_passage.each.with_index do |text_chunk, index|
        prompt = prompt_text(context: text_chunk)
        run_prompt(prompt: prompt, count: SECTION_COUNT, seed: "text_chunk_#{index + 1}", temperature: TEMP_SECTION)
      end

      results
    end

    def run_prompt(prompt:, count:, seed:, noun: nil, temperature: TEMP_PASSAGE)
      output = Evidence::OpenAI.new(prompt: prompt, count: count, temperature: temperature).request
      current_result_texts = results.map(&:text)

      new_results = output
        .map {|s| Result.new(text: noun.nil? ? s.lstrip : [noun, s].join(SPACE), seed: seed)}
        .uniq {|r| r.text }
        .reject {|r| r.text.in?(current_result_texts)}

      @results += new_results
    end

    def prompt_text(context: BLANK, noun: BLANK)
      context + SPACE + stem + SPACE + noun + SPACE
    end

    # split passage into words, split words in X-word-length chunks
    # e.g. chunks of 50 words
    def split_passage(size: WORD_SPLIT_COUNT)
      passage
        .split(SPACE)
        .each_slice(size)
        .map{|s| s.join(SPACE)}
        .map{|s| s.last == PERIOD ? s : (s + PERIOD)} # end it in a period, so stem is new sentence.
    end

    def to_csv(file_path)
      CSV.open(file_path, "w") do |csv|
        csv << ['Text', 'Seed']
        results.each {|r| csv << [r.text, r.seed]}
      end
    end

    def passages_to_csv(file_path)
      CSV.open(file_path, "w") do |csv|
        csv << ['Index', 'Passage Chunk']
        split_passage.each.with_index {|s,i| csv << [i + 1, s]}
      end
    end

  end
end
