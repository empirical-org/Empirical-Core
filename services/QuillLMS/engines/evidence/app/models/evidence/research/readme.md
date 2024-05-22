# Generative AI Experiments
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

## 2. Experiment Configuration
Within the create `Experiment` UI, `LLMConfig`, `LLMPromptTemplate0` and `PassagePrompt` are all selected. Before creation, substitutions are made to the `LLMPromptTemplate` contents and yielding an `LLMPrompt` record which is associated with the experiment

```mermaid
classDiagram
    class LLMConfig {
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
    class Experiment {
         status
    }

    PassagePrompt --|> Experiment
    LLMConfig --|> Experiment
    LLMPromptTemplate --|> LLMPrompt
    LLMPrompt --|> Experiment
```

## 3. Experiment Ouptut
As the `Experiment` is run, the LLM returns feedback relevant to the `PassagePromptResponse` which is stored as `LLMFeedback` along with the corresponding `experiment_id`.   These results are compared with `ExampleFeedback` and evaluated.

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
    Experiment --|> LLMFeedback
```
