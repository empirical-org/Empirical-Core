# Generative AI Trials
## 1. Data Importing
`Activity`, `StemVault`, `StudentResponse` and `QuillFeedback` records are imported with the following structure

```mermaid
classDiagram
    class Activity {
         name
         text
    }
    class StemVault {
         conjunction
         instructions
         prompt
         relevant_passage
    }
    class StudentResponse {
         response
    }
    class QuillFeedback {
         text
         evaluation
         label
    }
    Activity --|> StemVault
    StemVault --|> StudentResponse
    StudentResponse --|> QuillFeedback
```

## 2. Trial Configuration
Within the create `Trial` UI, `LLM`, `LLMPromptTemplate` and `StemVault` are all selected. Before creation, substitutions are made to the `LLMPromptTemplate` contents and yielding an `LLMPrompt` record which is associated with the trial

```mermaid
classDiagram
    class LLM {
         vendor
         version
    }
    class LLMPrompt {
         prompt
    }
    class LLMPromptTemplate {
         contents
         description
    }
    class StemVault {
    }
    class Trial {
         status
    }

    StemVault --|> Trial
    LLM --|> Trial
    LLMPromptTemplate --|> LLMPrompt
    LLMPrompt --|> Trial
```

## 3. Trial Ouptut
As the `Trial` is run, the LLM returns feedback relevant to the `StudentResponse` which is stored as `LLMFeedback` along with the corresponding `trial_id`.   These results are compared with `QuillFeedback` and evaluated.

```mermaid
classDiagram
    class StudentResponse {
    }
    class QuillFeedback {
    }
    class LLMFeedback {
        feedback
        label
    }
    StudentResponse --|> QuillFeedback
    StudentResponse --|> LLMFeedback
    Trial --|> LLMFeedback
```
