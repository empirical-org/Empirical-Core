
package endpoint

import (
	"bytes"
	"crypto/tls"
	"net/http"
	"encoding/json"
	"io/ioutil"
	"fmt"
	"sync"
	"time"
	"net/http/httputil"
)

const (
	automl_api = "https://comprehension-247816.appspot.com/feedback/ml"
	//automl_api = "https://www.quill.org/comprehension/ml_feedback.json"
	grammar_check_api = "https://us-central1-comprehension-247816.cloudfunctions.net/topic-grammar-API"
	plagiarism_api = "https://www.quill.org/api/v1/comprehension/feedback/plagiarism.json"
	regex_rules_api = "https://comprehension-247816.appspot.com/feedback/rules/first_pass"
	spell_check_local = "https://us-central1-comprehension-247816.cloudfunctions.net/spell-check-cloud-function"
	spell_check_bing = "https://us-central1-comprehension-247816.cloudfunctions.net/bing-API-spell-check"
	batch_feedback_history_url = "https://www.quill.org/api/v1/feedback_histories/batch.json"
	automl_index = 1
)

var wg sync.WaitGroup

var urls = [...]string{
	plagiarism_api,
	automl_api,
	regex_rules_api,
	grammar_check_api,
	spell_check_bing,
}

// you can't use const for structs, so this is the closest thing we can get for this value
var default_api_response = APIResponse{
	Feedback: "Thank you for your response.",
	Feedback_type: "semantic",
	Optimal: true,
}

// TODO: This is a temporary replacement `http` that allows us to bypass SSL security checks
var client = &http.Client {
	Transport: &http.Transport {
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	},
}


func Endpoint(responseWriter http.ResponseWriter, request *http.Request) {
	// need this for javascript cors requests
	// https://cloud.google.com/functions/docs/writing/http#functions_http_cors-go
	if request.Method == http.MethodOptions {
		responseWriter.Header().Set("Access-Control-Allow-Origin", "*")
		responseWriter.Header().Set("Access-Control-Allow-Methods", "POST")
		responseWriter.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		responseWriter.Header().Set("Access-Control-Max-Age", "3600")
		responseWriter.WriteHeader(http.StatusNoContent)
		return
	}

	requestDump, err := httputil.DumpRequest(request, true)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(requestDump))

	request_body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		//TODO make this response in the same format maybe?
		http.Error(responseWriter, err.Error(), http.StatusInternalServerError)
		return
	}

	results := map[int]InternalAPIResponse{}

	c := make(chan InternalAPIResponse)

	for priority, url := range urls {
		go getAPIResponse(url, priority, request_body, c)
	}

	var returnable_result APIResponse

	for response := range c {
		results[response.Priority] = response
		return_index, finished := processResults(results, len(urls))

		if finished {
			// If processResults reports that it's "finished", but the APIResponse at
			// that index is flagged as an Error, we'll need to return a default response of
			// some sort
			// This should really only happen when there's no Semantic Feedback available,
			// even for success cases, which means that if everything is working correctly,
			// this only comes up during the initial Turking process
			if !results[return_index].Error {
				returnable_result = results[return_index].APIResponse
			} else {
				returnable_result = default_api_response
			}
			break
		}
	}

	// TODO make this a purely async task instead of coroutine that waits to finish
	wg.Add(1)

	var request_object APIRequest
	// TODO convert the 'feedback' bytes and combine with incoming_params bytes
	// instead of transforming from bytes to object, combining, and then converting back to bytes
	if err := json.NewDecoder(bytes.NewReader(request_body)).Decode(&request_object); err != nil {
		return
	}

	go batchRecordFeedback(request_object, results)

	responseWriter.Header().Set("Access-Control-Allow-Origin", "*")
	responseWriter.Header().Set("Content-Type", "application/json")
	json.NewEncoder(responseWriter).Encode(returnable_result)

	wg.Wait()
}
// returns a typle of results index and that should be returned.
func processResults(results map[int]InternalAPIResponse, length int) (int, bool) {
	for i := 0; i < len(results); i++ {
		result, has_key := results[i]
		if !has_key {
			return 0, false
		}

		if !result.Error && !result.APIResponse.Optimal {
			return i, true
		}
	}

	all_correct := len(results) >= length

	return automl_index, all_correct
}

func getAPIResponse(url string, priority int, json_params [] byte, c chan InternalAPIResponse) {
	// response_json, err := http.Post(url, "application/json", bytes.NewReader(json_params))

	// TODO For now, just swallow any errors from this, but we'd want to report errors.
	// TODO: Replace "client" with "http" when we remove the segment above
	response_json, err := client.Post(url, "application/json",  bytes.NewReader(json_params))

	if err != nil {
		c <- InternalAPIResponse{Priority: priority, Error: true, APIResponse: APIResponse{Feedback: "There was an error hitting the API", Feedback_type: "API Error", Optimal: false}}
		return
	}

	var result APIResponse

	if err := json.NewDecoder(response_json.Body).Decode(&result); err != nil {
		// TODO might want to think about what this should be.
		c <- InternalAPIResponse{Priority: priority, Error: true, APIResponse: APIResponse{Feedback: "There was an JSON error" + err.Error(), Feedback_type: "API Error", Labels: url, Optimal: false}}
		return
	}

	c <- InternalAPIResponse{Priority: priority, Error: false, APIResponse: result}
}

func identifyUsedFeedbackIndex(feedbacks map[int]InternalAPIResponse) int {
	for key, feedback := range feedbacks {
		if !feedback.Error && !feedback.APIResponse.Optimal {
			return key
		}
	}
	// We use -1 as the return value if we couldn't find an index since
	// it should correspond to no index
	return -1
}

func buildFeedbackHistory(request_object APIRequest, feedback InternalAPIResponse, used bool, time_received time.Time) FeedbackHistory {
	return FeedbackHistory{
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
}

func buildBatchFeedbackHistories(request_object APIRequest, feedbacks map[int]InternalAPIResponse, time_received time.Time) (BatchHistoriesAPIRequest, error) {
	feedback_histories := []FeedbackHistory{}
	used_key := identifyUsedFeedbackIndex(feedbacks)
	fmt.Println("Constructing FeedbackHistory batch payload")
	fmt.Println(fmt.Sprintf("Session: %s, Prompt: %d", request_object.Session_id, request_object.Prompt_id))
	for key, feedback := range feedbacks {
		if !feedback.Error{
			feedback_histories = append(feedback_histories, buildFeedbackHistory(request_object, feedback, used_key == key, time_received))
			fmt.Println("Adding Feedback to history batch:")
			fmt.Println(feedback)
		} else if key == automl_index || key == -1 {
			fallback_feedback := InternalAPIResponse{APIResponse: default_api_response}
			feedback_histories = append(feedback_histories, buildFeedbackHistory(request_object, fallback_feedback, used_key == key, time_received))
			fmt.Println("Adding Feedback to history batch:")
			fmt.Println(fallback_feedback)
		} else {
			fmt.Println("Not adding Feedback to history batch:")
			fmt.Println(feedback)
		}
	}

	return BatchHistoriesAPIRequest {
		Feedback_histories: feedback_histories,
	}, nil
}

func batchRecordFeedback(incoming_params APIRequest, feedbacks map[int]InternalAPIResponse) {
	defer wg.Done() // mark task as done in WaitGroup on return

	histories, err := buildBatchFeedbackHistories(incoming_params, feedbacks, time.Now())

	if err != nil {
		fmt.Println(err)
	}

	histories_json, _ := json.Marshal(histories)

	// TODO For now, just swallow any errors from this, but we'd want to report errors.
	// TODO: Replace "client" with "http" when we remove the segment above
	result, err := client.Post(batch_feedback_history_url, "application/json",  bytes.NewBuffer(histories_json))
	fmt.Println("FeedbackHistory batch POST result:")
	fmt.Println(result)
	fmt.Println(err)
}

type APIRequest struct {
	Entry string `json:"entry"`
	Prompt_text string `json:"prompt_text"`
	Prompt_id int `json:"prompt_id"`
	Session_id string `json:"session_id"`
	Attempt int `json:"attempt"`
}

type APIResponse struct {
	Concept_uid string `json:"concept_uid"`
	Feedback string `json:"feedback"`
	Feedback_type string `json:"feedback_type"`
	Optimal bool `json:"optimal"`
	Response_id string `json:"response_id"`
	Highlight []Highlight `json:"highlight"`
	Labels string `json:"labels,omitempty"`
}

type Highlight struct {
	Type string `json:"type"`
	Id int `json:"id,omitempty"`
	Text string `json:"text"`
	Category string `json:"category"`
	Character int `json:"character,omitempty"`
}

type InternalAPIResponse struct {
	Priority int
	APIResponse APIResponse
	Error bool
}

type FeedbackHistoryMetadata struct {
	Highlight []Highlight `json:"highlight"`
	Labels string `json:"labels,omitempty"`
	Response_id string `json:"response_id"`
}

type FeedbackHistory struct {
	Activity_session_uid string `json:"activity_session_uid"`
	Prompt_id int `json:"prompt_id"`
	Concept_uid string `json:"concept_uid"`
	Attempt int `json:"attempt"`
	Entry string `json:"entry"`
	Feedback_text string `json:"feedback_text"`
	Feedback_type string `json:"feedback_type"`
	Optimal bool `json:"optimal"`
	Used bool `json:"used"`
	Time time.Time `json:"time"`
	Metadata FeedbackHistoryMetadata `json:"metadata"`
}

type BatchHistoriesAPIRequest struct {
	Feedback_histories []FeedbackHistory `json:"feedback_histories"`
}
