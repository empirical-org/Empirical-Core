package main

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"bytes"
	"encoding/json"
	"reflect"
	"time"
	"os"
	"github.com/gin-gonic/gin"
)

func TestPublishMessage(t *testing.T) {

	api_request := APIRequest{Prompt_text: "They cut funding because", Entry: "they needed to save money.", Prompt_id: 4, Session_id: "Asfasdf", Attempt: 2}
	request_json, _ := json.Marshal(api_request)
	json_string := bytes.NewBuffer(request_json)

	rr := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/", json_string)

	server := gin.Default()
	server.POST("/", Endpoint)
	server.ServeHTTP(rr, req)

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

	if r.Feedback_type != "autoML" {
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

	server := gin.Default()
	server.POST("/", Endpoint)
	server.ServeHTTP(rr, req)

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

	if r.Feedback_type != "autoML" {
		t.Errorf("The wrong feedback type was returned: %v", r.Feedback_type)
	}
}

func TestTimeoutBehavior(t *testing.T) {
	// We want to confirm that even if the timeout is a client-side one we still generate the
	// InternalAPIResponse object from a server-side error so that we can guarantee that the
	// overall function con construct appropriate feedback for a user.
	handlerFunc := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(time.Millisecond * 10000)
	})

	backend := httptest.NewServer(http.TimeoutHandler(handlerFunc, time.Millisecond * 5000, "server timeout"))

	testClient := &http.Client {
		Timeout: time.Millisecond * 1,
	}

	url := backend.URL

	r := getAPIResponse(url, 1, nil, testClient)

	if !r.Error {
		t.Errorf("Error attribute on response was not true")
	}

	if r.APIResponse.Optimal {
		t.Errorf("Optimal attribute on response was not false")
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

	return_index, returnable := processResults(results, 3)

	if return_index != automl_index {
		t.Errorf("processResults got index %v, want %v", return_index, automl_index)
	}
	if !returnable {
		t.Errorf("processResults returnable should be true")
	}
}

func TestFirstResponseErrorAllOptimal(t *testing.T) {
	responseOptimal := InternalAPIResponse{
		APIResponse: APIResponse{Optimal: true},
		Error: false,
	}

	responseError := InternalAPIResponse{
		APIResponse: APIResponse{Optimal: false},
		Error: true,
	}

	results := map[int]InternalAPIResponse{}
	results[0] = responseError
	results[1] = responseOptimal
	results[2] = responseOptimal

	return_index, returnable := processResults(results, 3)

	if return_index != automl_index {
		t.Errorf("processResults got index %v, want %v", return_index, automl_index)
	}
	if !returnable {
		t.Errorf("processResults returnable should be true")
	}
}

func TestFirstResponseErrorLaterNonOptimal(t *testing.T) {
	responseOptimal := InternalAPIResponse{
		APIResponse: APIResponse{Optimal: true},
		Error: false,
	}

	responseNonOptimal := InternalAPIResponse{
		APIResponse: APIResponse{Optimal: false},
		Error: false,
	}

	responseError := InternalAPIResponse{
		APIResponse: APIResponse{Optimal: false},
		Error: true,
	}

	results := map[int]InternalAPIResponse{}
	results[0] = responseError
	results[1] = responseOptimal
	results[2] = responseNonOptimal

	return_index, returnable := processResults(results, 3)

	if return_index != 2 {
		t.Errorf("processResults got index %v, want %v", return_index, 2)
	}
	if !returnable {
		t.Errorf("processResults returnable should be true")
	}
}

func TestAutoMLIndex(t *testing.T) {
	if "https://www.quill.org/api/v1/evidence/feedback/automl.json" != AssembleUrls()[automl_index] {
		t.Errorf("automl_index does not match automl_api")
	}
}

func TestGetLMSDomainDefault(t *testing.T) {
	result := GetLMSDomain();
	if result != "https://www.quill.org" {
		t.Errorf("Unexpected domain value.")
	}
}

func TestGetLMSDomainOverride(t *testing.T) {
	os.Setenv("lms_domain", "staging.quill.org")
	result := GetLMSDomain();
	if result != "staging.quill.org" {
		t.Errorf("Unexpected domain value.")
	}
}

func TestIdentifyUsedFeedbackIndex(t *testing.T) {
	usable_used_response := InternalAPIResponse { Error: false, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: false, Labels: "test_label" } }
	usable_unused_response := InternalAPIResponse { Error: false, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: false, Labels: "test_label" } }
	error_response := InternalAPIResponse { Error: true, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: false, Labels: "test_label" } }
	optimal_response := InternalAPIResponse { Error: false, APIResponse: APIResponse { Concept_uid: "test_concept", Feedback: "Feedback text: optimal", Feedback_type: "type1", Optimal: true, Labels: "test_label" } }

	feedbacks := map[int]InternalAPIResponse{}

	result := identifyUsedFeedbackIndex(feedbacks)
	if result != -1 {
		t.Errorf("Should have identified -1 for unfound used feedback, but got %d", result)
	}

	feedbacks[0] = error_response
	feedbacks[1] = optimal_response
	feedbacks[2] = usable_used_response
	feedbacks[3] = usable_unused_response
	feedbacks[4] = usable_unused_response

	result = identifyUsedFeedbackIndex(feedbacks)
	if result != 2 {
		t.Errorf("Should have identified 2 for unfound used feedback, but got %d", result)
	}

	for i := 0; i < len(feedbacks); i++ {
		feedbacks[i] = optimal_response
	}

	result = identifyUsedFeedbackIndex(feedbacks)
	if result != automl_index {
		t.Errorf("Should have identified the automl_index constant of %d for unfound used feedback, but got %d", automl_index, result)
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
	feedback := APIResponse {
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
		Hint: Hint {
			Id: 1,
			Explanation: "this is an explanation",
			Image_link: "google.com",
			Image_alt_text: "a description of the image",
		},
	}
	used := true
	time_received := time.Now()

	result := buildFeedbackHistory(request_object, feedback, used, time_received)
	expected := FeedbackHistory {
		Feedback_session_uid: request_object.Session_id,
		Prompt_id: request_object.Prompt_id,
		Concept_uid: feedback.Concept_uid,
		Attempt: request_object.Attempt,
		Entry: request_object.Entry,
		Feedback_text: feedback.Feedback,
		Feedback_type: feedback.Feedback_type,
		Optimal: feedback.Optimal,
		Used: used,
		Time: time_received,
		Metadata: FeedbackHistoryMetadata{
			Highlight: feedback.Highlight,
			Labels: feedback.Labels,
			Response_id: feedback.Response_id,
			Hint: feedback.Hint,
		},
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("buildFeedbackHistory did not generate expected payload")
	}
}

type ResponseJson struct {
	Feedback string
	Optimal bool
	Feedback_type string
	Response_id string
	Highlight []string
	Hint Hint
}
