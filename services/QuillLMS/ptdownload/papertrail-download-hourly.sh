#!/usr/bin/env bash
set -o errexit -o pipefail -o nounset

# arguments
HOURS_COUNT="$1"
FILTER="${2:-cat}"


seq 1 "$HOURS_COUNT" | tac | gxargs -I {} gdate -u --date='{} hours ago' +%Y-%m-%d-%H | \
    gxargs --max-procs 8 --max-args 1 -I {} ./papertrail-download-single.sh {} "$FILTER"
wait
