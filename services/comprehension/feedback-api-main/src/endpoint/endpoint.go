
package endpoint

import (
	"bytes"
	"net/http"
	"encoding/json"
	"io/ioutil"
)

const (
	automl_api = "https://us-east1-comprehension-247816.cloudfunctions.net/response-api-alpha"
	grammar_check = "https://us-central1-comprehension-247816.cloudfunctions.net/topic-grammar-API"
	spell_check_local = "https://us-central1-comprehension-247816.cloudfunctions.net/spelling-check-alpha"
)

func Endpoint(responseWriter http.ResponseWriter, request *http.Request) {

	request_body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		//TODO make this response in the same format maybe?
	  http.Error(responseWriter, err.Error(), http.StatusInternalServerError)
	  return
	}

	// Note, arrays can't be constants in Go, so this has to stay in the method
	urls := [...]string{
		automl_api,
		spell_check_local,
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

	responseWriter.Header().Set("Content-Type", "application/json")
  json.NewEncoder(responseWriter).Encode(returnable_result)
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

	return 0, all_correct
}

func getAPIResponse(url string, priority int, json_params [] byte, c chan InternalAPIResponse) {
	response_json, err := http.Post(url, "application/json", bytes.NewReader(json_params))

	if err != nil {
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an error hitting the API", Optimal: false}}
		return
	}

	var result APIResponse

	if err := json.NewDecoder(response_json.Body).Decode(&result); err != nil {
		// TODO might want to think about what this should be.
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an JSON error", Optimal: false}}
		return
	}

	c <- InternalAPIResponse{Priority: priority, APIResponse: result}
}

type APIRequest struct {
	Entry string `json:"entry"`
	Prompt_id int `json:"prompt_id"`
	Session_id string `json:"session_id"`
	Attempt int `json:"attempt"`
}

type APIResponse struct {
	Feedback string `json:"feedback"`
	Optimal bool `json:"optimal"`
	Response_id string `json:"response_id"`
	Highlight []Highlight `json:"highlight"`
}

type Highlight struct {
	Type string `json:"type"`
	Id int `json:"id,omitempty"`
	Text string `json:"text"`
}

type InternalAPIResponse struct {
	Priority int
	APIResponse APIResponse
}
