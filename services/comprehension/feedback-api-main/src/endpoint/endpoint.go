
package endpoint

import (
	"bytes"
	"fmt"
	"net/http"
	"encoding/json"
	"time"
	"io/ioutil"
)

func Endpoint(responseWriter http.ResponseWriter, request *http.Request) {
	start := time.Now()

	request_body, err := ioutil.ReadAll(request.Body)
	if err != nil {
	  http.Error(responseWriter, err.Error(), http.StatusInternalServerError)
	  return
	}

	// Note, arrays can't be constants in Go, so this has to stay in the method
	urls := [...]string{
		"https://us-central1-comprehension-247816.cloudfunctions.net/spelling-check-alpha",
	}

	results := map[int]APIResponse{}

	c := make(chan InternalAPIResponse)

	for priority, url := range urls {
		go getAPIResponse(url, priority, request_body, c)
	}

	var returnable_result APIResponse

	for response := range c {
		results[response.Priority] = response.APIResponse

		fmt.Println("\n*********in loop***********\n", results)
		return_index, returnable := processResults(results, len(urls))

		if returnable {
			fmt.Println("Return value: ", results[return_index])
			returnable_result = results[return_index]
			break
		}
	}

	fmt.Println("\n*****END OF FUNCTION**************\n", returnable_result)
	t := time.Now()
	elapsed := t.Sub(start)
	fmt.Println("Time Elapsed: ", elapsed)

	responseWriter.Header().Set("Content-Type", "application/json")
  json.NewEncoder(responseWriter).Encode(returnable_result)
}
// returns a typle of results index and that should be returned.
func processResults(results map[int]APIResponse, length int) (int, bool) {
	for i := 0; i < len(results); i++ {
		fmt.Println("\n*****in for loop***************")
		result, has_key := results[i]
		if !has_key {
			fmt.Println("\n*****missing***************")
			return 0, false
		}

		if !result.Optimal {
			fmt.Println("\n*****incorrect***************")
			return i, true
		}
	}

	all_correct := len(results) >= length

	fmt.Println("\n*****past for**************\n", all_correct)

	return 0, all_correct
}


func getAPIResponse(url string, priority int, json_params [] byte, c chan InternalAPIResponse) {
	start := time.Now()
	fmt.Println("\n*****in request***************\n", url, time.Now())
	response_json, err := http.Post(url, "application/json", bytes.NewReader(json_params))

	fmt.Println("\n*****response received***************\n", url, time.Now())
	if err != nil {
		fmt.Println("error: ", err)
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an error hitting the API", Optimal: false}}
		return
	}

	var result APIResponse

	if err := json.NewDecoder(response_json.Body).Decode(&result); err != nil {
		fmt.Println(err)
		// TODO might want to think about what this should be.
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an JSON error", Optimal: false}}
		return
	}

	c <- InternalAPIResponse{Priority: priority, APIResponse: result}
	t := time.Now()
	elapsed := t.Sub(start)
	fmt.Println("Time Elapsed: ", elapsed)
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
