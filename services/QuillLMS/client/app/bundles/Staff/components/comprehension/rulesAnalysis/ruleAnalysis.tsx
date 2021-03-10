import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import stripHtml from "string-strip-html";
import moment from 'moment';

import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../../Shared/index';

const Rule = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleId } = params;

  // cache rule data
  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const responseData = {
    responses: [
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/01/30", // thoughts on the formatting, Emilia?
        entry: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: true
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: false
      },
      {
        response_id: "asdfe0d5-4976-4d7d-a7e2-547fd875f50e",
        datetime: "2020/02/30", // thoughts on the formatting, Emilia?
        entry: "Put the word so in here somewhere",
        highlight: "so",
        view_session_url: 'asdf.com', // should this be passed as nil when unavailable?,
        strength: null
      },
		]
 }

 function makeStrong(response) {

 }

 function makeWeak(response) {

 }

  const ruleRows = ({ rule }) => {
    if(!rule) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { description, feedbacks, name, rule_type, level_zero_concept_name, level_one_concept_name, level_two_concept_name, } = rule;
      const fields = [
        {
          label: 'API Name',
          value: rule_type
        },
        {
          label: 'Name',
          value: name
        },
        {
          label: 'Rule Description',
          value: description ? stripHtml(description) : ''
        },
        {
          label: 'Concept - Level 0',
          value: level_zero_concept_name
        },
        {
          label: 'Concept - Level 1',
          value: level_one_concept_name
        },
        {
          label: 'Concept - Level 2',
          value: level_two_concept_name
        },
        {
          label: 'Feedback - 1st Attempt',
          value: feedbacks[0] ? feedbacks[0].text : null
        },
        {
          label: 'Feedback - 2nd Attempt',
          value: feedbacks[1] ? feedbacks[1].text : null
        },
        {
          label: 'Responses',
          value: responseData.responses.length
        }
      ];
      return fields.map((field, i) => {
        const { label, value } = field
        return {
          id: `${label}-${i}`,
          field: label,
          value
        }
      });
    }
  }

  // The header labels felt redundant so passing empty strings and hiding header display
  const ruleHeaders = [
    { name: "", attribute:"field", width: "180px" },
    { name: "", attribute:"value", width: "1000px" }
  ];

  const responseRows = ({ responses, }) => {
    if (!activityData && !responseData) { return [] }
    return responses.map(r => {
      const formattedResponse = {...r}
      const highlightedEntry = r.entry.replace(r.highlight, `<strong>${r.highlight}</strong>`)
      const strongButton = <button className={r.strength === true ? 'strength-button strong' : 'strength-button'} onClick={makeStrong(r)}>Strong</button>
      const weakButton = <button className={r.strength === false ? 'strength-button weak' : 'strength-button'} onClick={makeWeak(r)}>Weak</button>

      formattedResponse.entry = <span dangerouslySetInnerHTML={{ __html: highlightedEntry }} />
      formattedResponse.datetime = moment(r.datetime).format('MM/DD/YYYY')
      formattedResponse.strengthButtons = (<div className="strength-buttons">{strongButton}{weakButton}</div>)

      return formattedResponse
    })
  }

  const responseHeaders = [
    {
      name: "Time",
      attribute: "datetime",
      width: '100px'
    },
    {
      name: activityData ? activityData.activity.prompts[0].text.replace(activityData.activity.prompts[0].conjunction, '') : '', // necessary because sometimes the conjunction is part of the prompt and sometimes it isn't
      attribute: "entry",
      width: '600px'
    },
    {
      name: "Highlighted Output",
      attribute: "highlight",
      width: '100px'
    },
    {
      name: "",
      attribute: "strengthButtons",
      width: '300px'
    }
  ]

  if(!ruleData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleData.error}`} />
      </div>
    );
  }

  return(
    <div className="rule-analysis-container">
      <div className="header-container">
        <h2>Rule: {ruleData.rule.name}</h2>
      </div>
      <DataTable
        className="rule-table"
        headers={ruleHeaders}
        rows={ruleRows(ruleData)}
      />
      <Link className="quill-button medium contained primary" to={`/activities/${activityId}/rules/${ruleData.rule.id}`}>Edit Rule Feedback</Link>
      <DataTable
        className="responses-table"
        headers={responseHeaders}
        rows={responseRows(responseData)}
      />
    </div>
  );
}

export default Rule
