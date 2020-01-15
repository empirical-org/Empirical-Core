def combine_labels(labels):
    return '_'.join(sorted(labels))


def construct_feedback_payload(feedback, feedback_type, optimal):
    return {
        'feedback': feedback,
        'feedback_type': feedback_type,
        'optimal': optimal,
        'response_id': 'PLACEHOLDER',
        'highlight': [],
    }
