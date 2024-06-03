# Generative AI Trials
## 1. Data Importing
`Passage`, `PassagePrompt`, `PassagePromptResponse` and `ExampleFeedback` records are imported with the following structure

```mermaid
classDiagram
    class Passage {
         contents
         name
    }
    class PassagePrompt {
         conjunction
         instructions
         prompt
         relevant_passage
    }
    class PassagePromptResponse {
         response
    }
    class ExampleFeedback {
         text
         evaluation
         label
    }
    Passage --|> PassagePrompt
    PassagePrompt --|> PassagePromptResponse
    PassagePromptResponse --|> ExampleFeedback
```

## 2. Trial Configuration
Within the create `Trial` UI, `LLM`, `LLMPromptTemplate0` and `PassagePrompt` are all selected. Before creation, substitutions are made to the `LLMPromptTemplate` contents and yielding an `LLMPrompt` record which is associated with the trial

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
    class PassagePrompt {
    }
    class Trial {
         status
    }

    PassagePrompt --|> Trial
    LLM --|> Trial
    LLMPromptTemplate --|> LLMPrompt
    LLMPrompt --|> Trial
```

## 3. Trial Ouptut
As the `Trial` is run, the LLM returns feedback relevant to the `PassagePromptResponse` which is stored as `LLMFeedback` along with the corresponding `trial_id`.   These results are compared with `ExampleFeedback` and evaluated.

```mermaid
classDiagram
    class PassagePromptResponse {
    }
    class ExampleFeedback {
    }
    class LLMFeedback {
        feedback
        label
    }
    PassagePromptResponse --|> ExampleFeedback
    PassagePromptResponse --|> LLMFeedback
    Trial --|> LLMFeedback
```
