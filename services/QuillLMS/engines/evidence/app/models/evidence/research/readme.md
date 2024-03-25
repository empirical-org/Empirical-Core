# Generative AI Experiments
## 1. Data Importing
`Passage`, `PassagePrompt`, `PassagePromptResponse` and `ExamplePromptResponseFeedback` records are imported with the following structure

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
    class ExamplePromptResponseFeedback {
         evaluation
         feedback
         label
    }
    Passage --|> PassagePrompt
    PassagePrompt --|> PassagePromptResponse
    PassagePromptResponse --|> ExamplePromptResponseFeedback
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
As the `Experiment` is run, the LLM returns feedback relevant to the `PassagePromptResponse` which is stored as `LLMPromptResponseFeedback`.   These results are compared with ExamplePromptResponseFeedback and evaluated.

```mermaid
classDiagram
    class PassagePromptResponse {
    }
    class ExamplePromptResponseFeedback {
    }
    class LLMPromptResponseFeedback {
        feedback
        label
    }
    PassagePromptResponse --|> ExamplePromptResponseFeedback
    PassagePromptResponse --|> LLMPromptResponseFeedback
```