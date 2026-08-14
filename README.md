# Crowdsourced Personalization — site

Static site for GitHub Pages.

```
index.html      the whole page
style.css       styles
signup.js       email form -> Google Form -> Google Sheet
verify-signup.sh  posts a test address and tells you if it was accepted
assets/logos/   Cornell Tech, Stanford, Princeton marks
```

## Editing

- **About** — add text inside `<section id="about">` in `index.html`.
- **Personnel** — copy an `<li>` block inside `<ul class="personnel-list">`.
- **Logos** — the three files in `assets/logos/`. To swap one, either keep the
  existing filename or update the matching `src` in the footer of `index.html`.
  They are fitted to a common box in `.logos img`, so differing aspect ratios
  are fine.

## Wiring up the email field

1. Go to <https://forms.google.com> and create a blank form.
2. Add one **Short answer** question. Title it `Email`. Mark it required.
3. Click **Responses → Link to Sheets** to create the spreadsheet the
   addresses land in.
4. Click **Send → link icon** to get the public form URL. It looks like:
   `https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform`
   The part between `/d/e/` and `/viewform` is your **FORM_ID**.
5. Open that public URL, right-click the email box, choose **Inspect**, and
   find the `name` attribute on the `<input>`. It looks like
   `entry.1234567890`. That is your **ENTRY_ID**.
6. Put both values at the top of `signup.js`.

### Check it actually stores addresses

```sh
./verify-signup.sh
```

It reads the two values out of `signup.js`, posts a timestamped test address,
and reports whether Google accepted it. Then refresh the linked Sheet — the
test address should be the newest row.

Google Forms sends no CORS headers, so the browser cannot read the response to
a cross-origin submit. `signup.js` posts with `mode: "no-cors"` and reports
success once the request leaves the browser. The Sheet is the source of truth,
which is what this script checks against.

## Publishing

Push to GitHub, then **Settings → Pages → Source: Deploy from a branch**,
branch `main`, folder `/ (root)`.
