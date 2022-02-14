package main

import (
	"bytes"
	"crypto/tls"
	"net/http"
	"encoding/json"
	"io/ioutil"
	"fmt"
	"time"
	"os"
	"net/http/httputil"
	"github.com/gin-gonic/gin"
)

const automl_index = 4
const api_count = 9

// you can't use const for structs, so this is the closest thing we can get for this value
var default_api_response = APIResponse{
	Feedback: "Thank you for your response.",
	Feedback_type: "autoML",
	Optimal: true,
}

// TODO: This is a temporary replacement `http` that allows us to bypass SSL security checks
var base_client = &http.Client {
	Transport: &http.Transport {
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	},
	Timeout: time.Millisecond * 5000,
}

func GetFeedbackHistoryUrl() (string) {
	lms_domain := GetLMSDomain()
	return fmt.Sprintf("%s/api/v1/feedback_histories.json", lms_domain)
}

func GetLMSDomain() (string) {
	var maybe_domain = os.Getenv("lms_domain")

	var lms_domain = "https://www.quill.org"

	if len(maybe_domain) > 0 {
		lms_domain = maybe_domain
	}
	return lms_domain
}

func AssembleUrls() ([api_count]string) {
	lms_domain := GetLMSDomain()

	var (
		automl_api                    = fmt.Sprintf("%s/api/v1/evidence/feedback/automl.json", lms_domain)
		plagiarism_api                = fmt.Sprintf("%s/api/v1/evidence/feedback/plagiarism.json", lms_domain)
		prefilters_api                = fmt.Sprintf("%s/api/v1/evidence/feedback/prefilter.json", lms_domain)
		sentence_structure_regex_api  = fmt.Sprintf("%s/api/v1/evidence/feedback/regex/rules-based-1.json", lms_domain)
		post_topic_regex_api          = fmt.Sprintf("%s/api/v1/evidence/feedback/regex/rules-based-2.json", lms_domain)
		typo_regex_api                = fmt.Sprintf("%s/api/v1/evidence/feedback/regex/rules-based-3.json", lms_domain)
		spell_check_bing              = fmt.Sprintf("%s/api/v1/evidence/feedback/spelling.json", lms_domain)
		grammar_check_api 						= fmt.Sprintf("%s/api/v1/evidence/feedback/grammar", lms_domain)
		opinion_check_api             = fmt.Sprintf("%s/api/v1/evidence/feedback/opinion", lms_domain)
	)

	var urls = [...]string{
		prefilters_api,
		sentence_structure_regex_api,
		opinion_check_api,
		plagiarism_api,
		automl_api,
		post_topic_regex_api,
		grammar_check_api,
		spell_check_bing,
		typo_regex_api,
	}

	return urls
}

func Endpoint(context *gin.Context) {
	urls := AssembleUrls()

	requestDump, err := httputil.DumpRequest(context.Request, true)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(requestDump))

	request_body, err := ioutil.ReadAll(context.Request.Body)
	if err != nil {
		//TODO make this response in the same format maybe?
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	results := map[int]InternalAPIResponse{}

	var returnable_result APIResponse

	for index, url := range urls {
		results[index] = getAPIResponse(url, index, request_body, base_client)
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

	var request_object APIRequest
	// TODO convert the 'feedback' bytes and combine with incoming_params bytes
	// instead of transforming from bytes to object, combining, and then converting back to bytes
	if err := json.NewDecoder(bytes.NewReader(request_body)).Decode(&request_object); err != nil {
		return
	}

	recordFeedback(request_object, returnable_result, GetFeedbackHistoryUrl(), base_client)

	context.Header("Access-Control-Allow-Origin", "*")
	context.Header("Content-Type", "application/json")
	context.JSON(200, returnable_result)

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

func getAPIResponse(url string, priority int, json_params [] byte, client *http.Client) InternalAPIResponse {

	// response_json, err := http.Post(url, "application/json", bytes.NewReader(json_params))

	// TODO For now, just swallow any errors from this, but we'd want to report errors.
	// TODO: Replace "client" with "http" when we remove the segment above
	response_json, err := client.Post(url, "application/json",  bytes.NewReader(json_params))

	if err != nil {
		return InternalAPIResponse{Priority: priority, Error: true, APIResponse: APIResponse{Feedback: "There was an error hitting the API", Feedback_type: "API Error", Optimal: false}}

	}
	defer response_json.Body.Close()

	var result APIResponse

	if err := json.NewDecoder(response_json.Body).Decode(&result); err != nil {
		// TODO might want to think about what this should be.
		return InternalAPIResponse{Priority: priority, Error: true, APIResponse: APIResponse{Feedback: "There was an JSON error" + err.Error(), Feedback_type: "API Error", Labels: url, Optimal: false}}

	}

	return InternalAPIResponse{Priority: priority, Error: false, APIResponse: result}
}

func identifyUsedFeedbackIndex(feedbacks map[int]InternalAPIResponse) int {
	for i := 0; i < len(feedbacks); i++ {
		feedback := feedbacks[i]
		if !feedback.Error && !feedback.APIResponse.Optimal {
			return i
		}
	}
	// If none of the feedbacks are non-optimal, check to see if automl is feedback
	// is not optimal and not in error.  Because if it so, that's the feedback we'll use
	if !feedbacks[automl_index].Error && feedbacks[automl_index].APIResponse.Optimal {
		return automl_index
	}
	// We use -1 as the return value if we couldn't find an index since
	// it should correspond to no index
	return -1
}

func buildFeedbackHistory(request_object APIRequest, feedback APIResponse, used bool, time_received time.Time) FeedbackHistory {
	return FeedbackHistory{
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
		Rule_uid: feedback.Rule_uid,
		Metadata: FeedbackHistoryMetadata{
			Highlight: feedback.Highlight,
			Labels: feedback.Labels,
			Response_id: feedback.Response_id,
			Hint: feedback.Hint,
		},
	}
}

func recordFeedback(incoming_params APIRequest, feedback APIResponse, feedback_history_url string, client *http.Client) {


	history := buildFeedbackHistory(incoming_params, feedback, true, time.Now())

	history_json, _ := json.Marshal(history)

	// TODO For now, just swallow any errors from this, but we'd want to report errors.
	// TODO: Replace "client" with "http" when we remove the segment above
	client.Post(feedback_history_url, "application/json",  bytes.NewBuffer(history_json))
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
	Hint Hint `json:"hint,omitempty"`
	Labels string `json:"labels,omitempty"`
	Rule_uid string `json:"rule_uid"`
}

type Highlight struct {
	Type string `json:"type"`
	Id int `json:"id,omitempty"`
	Text string `json:"text"`
	Category string `json:"category"`
	Character int `json:"character,omitempty"`
}

type Hint struct {
  Id int `json:"id,omitempty"`
  Explanation string `json:"explanation,omitempty"`
  Image_link string `json:"image_link,omitempty"`
  Image_alt_text string `json:"image_alt_text,omitempty"`
}

type InternalAPIResponse struct {
	Priority int
	APIResponse APIResponse
	Error bool
}

type FeedbackHistoryMetadata struct {
	Highlight []Highlight `json:"highlight"`
	Hint Hint `json:"hint,omitempty"`
	Labels string `json:"labels,omitempty"`
	Response_id string `json:"response_id"`
}

type FeedbackHistory struct {
	Feedback_session_uid string `json:"feedback_session_uid"`
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
	Rule_uid string `json:"rule_uid"`
}
