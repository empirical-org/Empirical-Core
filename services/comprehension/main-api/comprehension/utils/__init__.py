def combine_labels(labels):
    return '-'.join(sorted(labels))


def construct_feedback_payload(feedback, feedback_type, optimal,
                               highlight=[], labels=None):
    payload = {
        'feedback': feedback,
        'feedback_type': feedback_type,
        'optimal': optimal,
        'response_id': 'PLACEHOLDER',
        'highlight': highlight,
    }

    if labels:
        payload['labels'] = labels

    return payload


def construct_highlight_payload(highlight_type, highlight_text,
                                start_index=0, highlight_id=None):
    return {
        'type': highlight_type,
        'id': highlight_id,
        'text': highlight_text,
        'category': None,
        'character': start_index,
    }
