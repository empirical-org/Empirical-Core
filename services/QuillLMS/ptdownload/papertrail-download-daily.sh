#!/usr/bin/env bash
set -o errexit -o pipefail -o nounset

# arguments
DAYS_COUNT="$1"
FILTER="${2:-cat}"


seq 1 "$DAYS_COUNT" | tac | gxargs -I {} gdate -u --date='{} day ago' +%Y-%m-%d | \
    gxargs --max-procs 4 --max-args 1 -I {} ./papertrail-download-single.sh {} "$FILTER"
wait
