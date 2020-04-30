package endpoint

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"bytes"
	"encoding/json"
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

type ResponseJson struct {
	Feedback string
	Optimal bool
	Feedback_type string
	Response_id string
	Highlight []string
}
