Intro
===

Quill currently uses JMeter for load testing. A JMeter thread group represents a load test against a given API. A test plan has many thread groups. All thread groups in a plan are executed by default.

Setup / Installation
===
1. Install JMeter
    `$ brew install jmeter`
2. Run JMeter GUI
    `$ /usr/local/bin/jmeter -p PROPERTYFILE`

Usage
===

1. Fine-tune your test plan via the JMeter GUI. Avoiding running large/continuous tests from the GUI. 
2. Run your test plan via CLI - [instructions](https://jmeter.apache.org/usermanual/get-started.html#non_gui). Example: `HEAP="-Xms512m -Xmx4096m" jmeter -n -t prod.jmx -l outputs/latest.csv -p property_files/prod_all_1_min_low_traffic.properties`

Conventions / Remarks
====

All CSV files in the `inputs/` directory should be cleaned of double quotes - JMeter does not escape double quotes.

When using the Precise timer, the Timer sets the rate (expected), but the TG sets the total number of requests to be worked off. Thus, a thread group of 100, using a Timer rate of 2 rpm, will take 50 mins.

JMeter's basic currency is CSV files. When a test is run, a CSV file is generated. Graphing and aggregation computations can be later run on this file. The JMeter UI is a bit finicky. For example, when loading two consecutive files into a graph, it will append data by default. To avoid this, click the "broom" clearing icon between graphing workflows.
