#!/bin/sh
# Posts a test address to the configured Google Form and reports the result.
# Usage: ./verify-signup.sh [email]

set -eu

cd "$(dirname "$0")"

FORM_ID=$(sed -n 's/^var FORM_ID *= *"\(.*\)".*/\1/p' signup.js)
ENTRY_ID=$(sed -n 's/^var ENTRY_ID *= *"\(.*\)".*/\1/p' signup.js)

case "$FORM_ID$ENTRY_ID" in
  *PASTE*)
    echo "signup.js is not configured yet — see README.md step 6." >&2
    exit 1
    ;;
esac

EMAIL=${1:-"test+$(date +%Y%m%d-%H%M%S)@example.com"}
URL="https://docs.google.com/forms/d/e/$FORM_ID/formResponse"

echo "form:  $FORM_ID"
echo "field: $ENTRY_ID"
echo "email: $EMAIL"
echo

CODE=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$URL" \
  --data-urlencode "$ENTRY_ID=$EMAIL")

echo "HTTP $CODE"

case "$CODE" in
  200)
    echo "Accepted. Refresh the linked Sheet — '$EMAIL' should be the newest row."
    ;;
  400)
    echo "Rejected. ENTRY_ID is probably wrong, or the form has other required questions." >&2
    exit 1
    ;;
  404)
    echo "Not found. FORM_ID is wrong, or the form is not accepting responses." >&2
    exit 1
    ;;
  *)
    echo "Unexpected response. Check FORM_ID and that the form is open." >&2
    exit 1
    ;;
esac
