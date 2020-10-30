
package endpoint

import (
	"bytes"
	"crypto/tls"
	"net/http"
	"encoding/json"
	"io/ioutil"
	"log"
	"sync"
	"time"
	"net/http/httputil"
)

const (
	automl_api = "https://staging.quill.org/comprehension/ml_feedback.json"
	grammar_check_api = "https://us-central1-comprehension-247816.cloudfunctions.net/topic-grammar-API"
	plagiarism_api = "https://comprehension-247816.appspot.com/feedback/plagiarism"
	regex_rules_api = "https://comprehension-247816.appspot.com/feedback/rules/first_pass"
	spell_check_local = "https://us-central1-comprehension-247816.cloudfunctions.net/spell-check-cloud-function"
	spell_check_bing = "https://us-central1-comprehension-247816.cloudfunctions.net/bing-API-spell-check"
	batch_feedback_history_url = "https://staging.quill.org/api/v1/feedback_histories/batch.json"
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
		log.Println(err)
	}
	log.Println(string(requestDump))

	request_body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		//TODO make this response in the same format maybe?
		http.Error(responseWriter, err.Error(), http.StatusInternalServerError)
		return
	}

	results := map[int]APIResponse{}

	c := make(chan InternalAPIResponse)

	for priority, url := range urls {
		go getAPIResponse(url, priority, request_body, c)
	}

	var returnable_result APIResponse

	for response := range c {
		results[response.Priority] = response.APIResponse
		return_index, returnable := processResults(results, len(urls))

		if returnable {
			returnable_result = results[return_index]
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

	log.Println("Attempting to batch record Feedback History")
	log.Println(results)
	go batchRecordFeedback(request_object, results)

	responseWriter.Header().Set("Access-Control-Allow-Origin", "*")
	responseWriter.Header().Set("Content-Type", "application/json")
	json.NewEncoder(responseWriter).Encode(returnable_result)

	wg.Wait()
}
// returns a typle of results index and that should be returned.
func processResults(results map[int]APIResponse, length int) (int, bool) {
	for i := 0; i < len(results); i++ {
		result, has_key := results[i]
		if !has_key {
			return 0, false
		}

		if !result.Optimal {
			return i, true
		}
	}

	all_correct := len(results) >= length

	return automl_index, all_correct
}

func getAPIResponse(url string, priority int, json_params [] byte, c chan InternalAPIResponse) {
	// response_json, err := http.Post(url, "application/json", bytes.NewReader(json_params))

	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}


	// TODO For now, just swallow any errors from this, but we'd want to report errors.
	// TODO: Replace "client" with "http" when we remove the segment above
	log.Println("Posting to endpoint")
	response_json, err := client.Post(url, "application/json",  bytes.NewReader(json_params))

	if err != nil {
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an error hitting the API", Feedback_type: "API Error", Optimal: false}}
		return
	}

	var result APIResponse

	if err := json.NewDecoder(response_json.Body).Decode(&result); err != nil {
		// TODO might want to think about what this should be.
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an JSON error" + err.Error(), Feedback_type: "API Error", Labels: url, Optimal: false}}
		return
	}

	c <- InternalAPIResponse{Priority: priority, APIResponse: result}
}

func buildBatchFeedbackHistories(request_object APIRequest, feedbacks map[int]APIResponse, time_received time.Time) (BatchHistoriesAPIRequest, error) {
	feedback_histories := []FeedbackHistory{}
	used_set := false
	for _, feedback := range feedbacks {
		if feedback.Feedback_type != "API Error" {
			feedback_histories = append(feedback_histories, FeedbackHistory{
				Activity_session_uid: request_object.Session_id,
				Prompt_id: request_object.Prompt_id,
				Concept_uid: feedback.Concept_uid,
				Attempt: request_object.Attempt,
				Entry: request_object.Entry,
				Feedback_text: feedback.Feedback,
				Feedback_type: feedback.Feedback_type,
				Optimal: feedback.Optimal,
				Used: !feedback.Optimal && !used_set,
				Time: time_received,
				Metadata: FeedbackHistoryMetadata{
					Highlight: feedback.Highlight,
					Labels: feedback.Labels,
					Response_id: feedback.Response_id,
				},
			})
			if !used_set {
				used_set = !feedback.Optimal
			}
		}
	}

	return BatchHistoriesAPIRequest {
		Feedback_histories: feedback_histories,
	}, nil
}

func batchRecordFeedback(incoming_params APIRequest, feedbacks map[int]APIResponse) {
	log.Println("Constructing batch Feedback History payload")
	histories, err := buildBatchFeedbackHistories(incoming_params, feedbacks, time.Now())
	log.Println(histories)
	log.Println(err)

	if err != nil {
		log.Println(err)
	}

	log.Println("Marshalling histories into JSON")
	histories_json, _ := json.Marshal(histories)

	// TODO: Remove temporary SSL bypass to turn security back on
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}


	// TODO For now, just swallow any errors from this, but we'd want to report errors.
	// TODO: Replace "client" with "http" when we remove the segment above
	log.Println("Posting to endpoint")
	result, err := client.Post(batch_feedback_history_url, "application/json",  bytes.NewBuffer(histories_json))
	log.Println(result)
	log.Println(err)
	log.Println("Triggering wg.Done()")
	wg.Done() // mark task as done in WaitGroup

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
