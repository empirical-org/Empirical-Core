def combine_labels(labels):
    return '-'.join(sorted(labels))


def construct_feedback_payload(feedback, feedback_type, optimal,
                               response_id, highlight=[], labels=None):
    payload = {
        'feedback': str(feedback),
        'feedback_type': str(feedback_type),
        'optimal': bool(optimal),
        'response_id': str(response_id),
        'highlight': list(highlight),
    }

    if labels:
        payload['labels'] = str(labels)

    return payload


def construct_highlight_payload(highlight_type, highlight_text,
                                highlight_id, start_index=0):
    return {
        'type': str(highlight_type),
        'id': int(highlight_id),
        'text': str(highlight_text),
        'category': str(''),
        'character': int(start_index),
    }
