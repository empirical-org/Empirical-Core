# Generative AI Trials
## 1. Data Importing
`Activity`, `StemVault`, `Dataset`, `TestExample`, and `PromptExample` records are imported with the following structure

```mermaid
classDiagram
    class Activity {
         name
         text
    }
    class StemVault {
         conjunction
         stem
         prompt
    }
    class Guideline {
        text
        category
    }
    class Dataset {
        optimal_count
        suboptimal_count
        locked
    }
    class TestExample {
          student_response
          staff_assigned_status
          staff_feedback
          highlight
    }
    class PromptExample {
          student_response
          staff_assigned_status
          staff_feedback
    }
    Activity --|> StemVault
    StemVault --|> Guideline
    StemVault --|> Dataset
    Dataset --|> TestExample
    Dataset --|> PromptExample
```

## 2. Trial Configuration

Within the create `Trial` UI, `LLM`, `LLMPromptTemplate` are selected. Before creation, substitutions are made to the `LLMPromptTemplate` contents and yielding an `LLMPrompt` record which is associated with the trial.

```mermaid
classDiagram
    class LLM {
         vendor
         version
    }
    class LLMPrompt {
         prompt
         optimal_guidelines_count
         suboptimal_guidelines_count
         optimal_examples_count
         suboptimal_examples_count
         locked
    }
    class LLMPromptTemplate {
         contents
         description
    }

    Dataset --|> Trial
    LLM --|> Trial
    LLMPromptTemplate --|> LLMPrompt
    LLMPrompt --|> Trial
```

## 3. LLMPrompt Configuration

Within the UI, the user can select `PromptExample` and `Guideline` records for the `LLMPrompt` which will create `LLMPromptPromptExample` and `LLMPromptGuideline` records respectively.

```mermaid
classDiagram
    StemVault --|> Guideline
    Guideline --|> LLMPromptGuideline
    LLMPrompt --|> LLMPromptGuideline
    LLMPrompt --|> LLMPromptPromptExample
    Dataset --|> PromptExample
    PromptExample --|> LLMPromptPromptExample
    Trial --|> LLMPrompt
```

## 4. Trial Ouptut

As the `Trial` is run, the LLM returns feedback relevant to each `TestExample` which is stored as `LLMFeedback` along with the corresponding `trial_id`.   These results are compared with `QuillFeedback` and evaluated.

```mermaid
classDiagram
    class TestExample {
    }
    class LLMFeedback {
        feedback
        label
    }
    class Trial {
    }
    TestExample --|> LLMFeedback
    Trial --|> LLMFeedback
```
