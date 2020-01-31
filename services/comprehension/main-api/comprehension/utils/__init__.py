def combine_labels(labels):
    return '_'.join(sorted(labels))


def construct_feedback_payload(feedback, feedback_type, optimal, labels=None):
    payload = {
        'feedback': feedback,
        'feedback_type': feedback_type,
        'optimal': optimal,
        'response_id': 'PLACEHOLDER',
        'highlight': [],
    }

    if labels:
        payload['labels'] = labels

    return payload
