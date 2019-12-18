
package main

import (
	"bytes"
	"fmt"
	"net/http"
	"encoding/json"
	"time"
)

func main() {
	start := time.Now()
	// mocking the API Request
	// TODO pass in real API request
	api_request := APIRequest{Entry: "more people vote", Prompt_id: 98, Session_id: "Asfasdf", Attempt: 2}
	request_json, err := json.Marshal(api_request)

	if err != nil {
		fmt.Println("Marshall error", err)
		// TODO return an APIResponse
		return
	}

	urls := [...]string{
		"https://us-central1-comprehension-247816.cloudfunctions.net/bing-API-spell-check",
		"https://us-central1-comprehension-247816.cloudfunctions.net/spelling-check-alpha",
		"https://us-central1-comprehension-247816.cloudfunctions.net/spelling-check-alpha",
		"https://us-central1-comprehension-247816.cloudfunctions.net/bing-API-spell-check",
	}

	results := map[int]APIResponse{}

	c := make(chan InternalAPIResponse)

	for priority, url := range urls {
		go getAPIResponse(url, priority, request_json, c)
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
}
// returns a typle of results index and that should be returned.
func processResults(results map[int]APIResponse, length int) (int, bool) {
	for i := 0; i < len(results); i++ {
		fmt.Println("\n*****in for loop***************\n")
		result, has_key := results[i]
		if !has_key {
			fmt.Println("\n*****missing***************\n")
			return 0, false
		}

		if !result.Optimal {
			fmt.Println("\n*****incorrect***************\n")
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
	response_json, err := http.Post(url, "application/json", bytes.NewBuffer(json_params))

	fmt.Println("\n*****response received***************\n", url, time.Now())
	if err != nil {
		fmt.Println("error: ", err)
		c <- InternalAPIResponse{Priority: priority, APIResponse: APIResponse{Feedback: "There was an endpoint hitting the API", Optimal: false}}
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
	Feedback string `json:"message"`
	Optimal bool `json:"optimal"`
	Label string `json:"label"`
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
