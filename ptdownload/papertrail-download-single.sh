#!/usr/bin/env bash
set -o pipefail -o nounset

# arguments
FILE_NAME="$1"
FILTER="${2:-cat}"

# local variables
OUTPUT_PATH="$FILE_NAME.tsv"
OUTPUT_PATH_TMP=="$OUTPUT_PATH.tmp"
OUTPUT_PATH_UNFILTERED="$OUTPUT_PATH.unfiltered"
OUTPUT_PATH_GZ="$OUTPUT_PATH_UNFILTERED.gz"
OUTPUT_PATH_GZ_TMP="$OUTPUT_PATH_GZ.tmp"


if [ -f "$OUTPUT_PATH" ]; then
	echo -n "." # skipped

elif [ -f "$OUTPUT_PATH_GZ" ]; then
	gunzip "$OUTPUT_PATH_GZ" && \
	"$FILTER" < "$OUTPUT_PATH_UNFILTERED" > "$OUTPUT_PATH_TMP" && \
	mv "$OUTPUT_PATH_TMP" "$OUTPUT_PATH" && \
	rm "$OUTPUT_PATH_UNFILTERED" && \
	echo -n "E" # extracted

elif [ -f "$OUTPUT_PATH_UNFILTERED" ]; then
	"$FILTER" < "$OUTPUT_PATH_UNFILTERED" > "$OUTPUT_PATH_TMP" && \
	mv "$OUTPUT_PATH_TMP" "$OUTPUT_PATH" && \
	rm "$OUTPUT_PATH_UNFILTERED" && \
	echo -n "T" # transformed

else
	rm -f "OUTPUT_PATH_TMP" "$OUTPUT_PATH_GZ_TMP" && \
	curl -f --no-include --fail --retry 3 --silent -o "$OUTPUT_PATH_GZ_TMP" -L -H "X-Papertrail-Token: $PAPERTRAIL_TOKEN" "https://papertrailapp.com/api/v1/archives/$FILE_NAME/download"
	DOWNLOAD_RESULT=$?

	if [ $DOWNLOAD_RESULT -eq 0 ]; then
		mv "$OUTPUT_PATH_GZ_TMP" "$OUTPUT_PATH_GZ" && \
		gunzip "$OUTPUT_PATH_GZ" && \
		"$FILTER" < "$OUTPUT_PATH_UNFILTERED" > "$OUTPUT_PATH_TMP" && \
		mv "$OUTPUT_PATH_TMP" "$OUTPUT_PATH" && \
		rm "$OUTPUT_PATH_UNFILTERED" && \
		echo -n ":" # downloaded

	elif [ $DOWNLOAD_RESULT -eq 22 ]; then
		touch "$OUTPUT_PATH" && \
		echo -n "N" # not found

	else
		echo -n "F" # failed
	fi
fi
