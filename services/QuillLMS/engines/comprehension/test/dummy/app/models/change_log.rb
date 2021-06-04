class ChangeLog < ActiveRecord::Base
  COMPREHENSION_ACTIONS = {
    create_activity: 'Comprehension Activity - created',
    delete_activity: 'Comprehension Activity - deleted',
    update_passage: 'Comprehension Passage Text - updated',
    create_regex: 'Regex Rule - created',
    update_regex: 'Regex Rule - updated',
    delete_regex: 'Regex Rule - deleted',
    update_prompt: 'Comprehension Stem - updated',
    create_automl: 'AutoML Model - created',
    activate_automl: 'AutoML Model - activated',
    deactivate_automl: 'AutoML Model - de-activated',
    create_semantic: 'Semantic Label - created',
    delete_semantic: 'Semantic Label - deleted',
    update_semantic: 'Semantic Label - updated',
    update_feedback_1: 'Semantic Label First Layer Feedback - updated',
    update_highlight_1: 'Semantic Label First Layer Feedback Highlight - added',
    update_feedback_2: 'Semantic Label Second Layer Feedback - updated',
    update_highlight_2: 'Semantic Label Second Layer Feedback Highlight - added',
    create_plagiarism: 'Plagiarism - created',
    update_plagiarism: 'Plagiarism - updated',
    update_universal: 'Universal Rule - updated',
    create_universal: 'Universal Rule - created'
  }

end
