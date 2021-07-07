Intro
===

Quill currently uses JMeter for load testing. A JMeter thread group represents a load test against a given API. A test plan has many thread groups. All thread groups in a plan are executed by default.

Setup / Installation
===
1. Install JMeter
    $ brew install jmeter
2. Run JMeter GUI
    $ open /usr/local/bin/jmeter

Usage
===

1. Fine-tune your test plan via the JMeter GUI. Avoiding running large/continuous tests from the GUI.
2. Run your test plan via CLI - [instructions](https://jmeter.apache.org/usermanual/get-started.html#non_gui). Example: `jmeter -n -t testplan1.jmx -l outputs/latest.csv`

Conventions
====

All CSV files in the `inputs/` directory should be cleaned of double quotes - JMeter does not escape double quotes.
