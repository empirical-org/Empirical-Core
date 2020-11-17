package endpoint

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"bytes"
	"encoding/json"
	"reflect"
	"time"
)

func TestPublishMessage(t *testing.T) {

	api_request := APIRequest{Prompt_text: "They cut funding because", Entry: "they needed to save money.", Prompt_id: 4, Session_id: "Asfasdf", Attempt: 2}
	request_json, _ := json.Marshal(api_request)
	json_string := bytes.NewBuffer(request_json)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/", json_string)
	Endpoint(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Endpoint got response code %v, want %v", rr.Code, http.StatusOK)
	}

	resp := rr.Result()
	body, _ := ioutil.ReadAll(resp.Body)

	var r ResponseJson
	err := json.Unmarshal(body, &r)
	if err != nil {
		t.Errorf("There was a problem converting the response to JSON: %v", err)
	}

	if !r.Optimal {
		t.Errorf("The response was not optimal.")
	}

	if r.Feedback_type != "semantic" {
		t.Errorf("The wrong feedback type was returned: %v", r.Feedback_type)
	}
}

func TestDefaultFeedbackFallback(t *testing.T) {
	// Same as the regular test, but with a missing PromptID param which should crash the endpoint
	api_request := APIRequest{Prompt_text: "They cut funding because", Entry: "they needed to save money.", Session_id: "Asfasdf", Attempt: 2}
	request_json, _ := json.Marshal(api_request)
	json_string := bytes.NewBuffer(request_json)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/", json_string)
	Endpoint(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Endpoint got response code %v, want %v", rr.Code, http.StatusOK)
	}

	resp := rr.Result()
	body, _ := ioutil.ReadAll(resp.Body)

	var r ResponseJson
	err := json.Unmarshal(body, &r)
	if err != nil {
		t.Errorf("There was a problem converting the response to JSON: %v", err)
	}

	if !r.Optimal {
		t.Errorf("The response was not optimal.")
	}

	if r.Feedback_type != "fallback" {
		t.Errorf("The wrong feedback type was returned: %v", r.Feedback_type)
	}
}

func TestAllOptimal(t *testing.T) {
	responseOptimal := InternalAPIResponse{
		APIResponse: APIResponse{Optimal: true},
		Error: false,
	}

	results := map[int]InternalAPIResponse{}
	results[0] = responseOptimal
	results[1] = responseOptimal
	results[2] = responseOptimal

	return_index, returnable := processResults(results, 3, true)

	if return_index != automl_index {
		t.Errorf("processResults got index %v, want %v", return_index, automl_index)
	}
	if !returnable {
		t.Errorf("processResults returnable should be true")
	}
}

func TestAutoMLIndex(t *testing.T) {
	if automl_api != urls[automl_index] {
		t.Errorf("automl_index does not match automl_api")
	}
}

func TestIdentifyUsedFeedbackIndex(t *testing.T) {
	usable_response := InternalAPIResponse { Error: false, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: false, Labels: "test_label" } }
	error_response := InternalAPIResponse { Error: true, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: false, Labels: "test_label" } }
	optimal_response := InternalAPIResponse { Error: false, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: true, Labels: "test_label" } }

	feedbacks := map[int]InternalAPIResponse{}

	result := identifyUsedFeedbackIndex(feedbacks)
	if result != -1 {
		t.Errorf("Should have identified -1 for unfound used feedback, but got %d", result)
	}

	feedbacks[0] = error_response
	feedbacks[1] = optimal_response
	feedbacks[2] = usable_response

	result = identifyUsedFeedbackIndex(feedbacks)
	if result != 2 {
		t.Errorf("Should have identified 2 for unfound used feedback, but got %d", result)
	}
}


func TestBuildFeedbackHistory(t *testing.T) {
	request_object := APIRequest {
		Entry: "test entry",
		Prompt_text: "test prompt_text",
		Prompt_id: 1,
		Session_id: "test session_id",
		Attempt: 1,
	}
	feedback := InternalAPIResponse {
		Error: false,
		APIResponse: APIResponse {
			Concept_uid: "test concept_uid",
			Feedback: "test feedback",
			Feedback_type: "test feedback_type",
			Optimal: false,
			Response_id: "test response_id",
			Labels: "test labels",
			Highlight: []Highlight {
				Highlight {
					Type: "passage",
					Text: "test highlight",
					Category: "test highlight category",
					Character: 0,
				},
			},
		},
	}
	used := true
	time_received := time.Now()

	result := buildFeedbackHistory(request_object, feedback, used, time_received)
	expected := FeedbackHistory {
		Activity_session_uid: request_object.Session_id,
		Prompt_id: request_object.Prompt_id,
		Concept_uid: feedback.APIResponse.Concept_uid,
		Attempt: request_object.Attempt,
		Entry: request_object.Entry,
		Feedback_text: feedback.APIResponse.Feedback,
		Feedback_type: feedback.APIResponse.Feedback_type,
		Optimal: feedback.APIResponse.Optimal,
		Used: used,
		Time: time_received,
		Metadata: FeedbackHistoryMetadata{
			Highlight: feedback.APIResponse.Highlight,
			Labels: feedback.APIResponse.Labels,
			Response_id: feedback.APIResponse.Response_id,
		},
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("buildFeedbackHistory did not generate expected payload")
	}
}

func TestBuildBatchFeedbackHistories(t *testing.T) {
	api_request := APIRequest{Prompt_text: "They cut funding because", Entry: "they needed to save money.", Prompt_id: 4, Session_id: "Asfasdf", Attempt: 2}

	results := map[int]InternalAPIResponse{}
	results[0] = InternalAPIResponse { APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: true, Labels: "test_label" } }
	results[2] = InternalAPIResponse { APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: non-optimal", Feedback_type: "type2", Optimal: false, Labels: "test_label" } }
	results[3] = InternalAPIResponse { APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type3", Optimal: false, Labels: "test_label" } }

	now := time.Now()

	payload, _ := buildBatchFeedbackHistories(api_request, results, now)

	expected := BatchHistoriesAPIRequest {
		Feedback_histories: []FeedbackHistory{
			FeedbackHistory {
				Activity_session_uid: api_request.Session_id,
				Prompt_id: api_request.Prompt_id,
				Concept_uid: results[0].APIResponse.Concept_uid,
				Attempt: api_request.Attempt,
				Entry: api_request.Entry,
				Feedback_text: results[0].APIResponse.Feedback,
				Feedback_type: results[0].APIResponse.Feedback_type,
				Optimal: results[0].APIResponse.Optimal,
				Used: false,
				Time: now,
				Metadata: FeedbackHistoryMetadata { Labels: results[0].APIResponse.Labels },
			},
			FeedbackHistory {
				Activity_session_uid: api_request.Session_id,
				Prompt_id: api_request.Prompt_id,
				Concept_uid: results[2].APIResponse.Concept_uid,
				Attempt: api_request.Attempt,
				Entry: api_request.Entry,
				Feedback_text: results[2].APIResponse.Feedback,
				Feedback_type: results[2].APIResponse.Feedback_type,
				Optimal: results[2].APIResponse.Optimal,
				Used: true,
				Time: now,
				Metadata: FeedbackHistoryMetadata { Labels: results[2].APIResponse.Labels },
			},
			FeedbackHistory {
				Activity_session_uid: api_request.Session_id,
				Prompt_id: api_request.Prompt_id,
				Concept_uid: results[3].APIResponse.Concept_uid,
				Attempt: api_request.Attempt,
				Entry: api_request.Entry,
				Feedback_text: results[3].APIResponse.Feedback,
				Feedback_type: results[3].APIResponse.Feedback_type,
				Optimal: results[3].APIResponse.Optimal,
				Used: false,
				Time: now,
				Metadata: FeedbackHistoryMetadata { Labels: results[3].APIResponse.Labels },
			},
		},
	}

	if len(payload.Feedback_histories) != len(expected.Feedback_histories){
		t.Errorf("Batch Feedback History rolled up the wrong number of items.\nReceived: %d\nExpected: %d", len(payload.Feedback_histories), len(expected.Feedback_histories))
	}

	payload_json, _ := json.Marshal(payload)
	payload_str := string(payload_json)
	expected_json, _ := json.Marshal(expected)
	expected_str := string(expected_json)
	if payload_str != expected_str {
		t.Errorf("Payload not properly formatted.\n\nReceived:\n%s\n\nExpected:\n%s", payload_str, expected_str)
	}
}

type ResponseJson struct {
	Feedback string
	Optimal bool
	Feedback_type string
	Response_id string
	Highlight []string
}
