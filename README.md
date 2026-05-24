# Dala Catalog

Static catalog website for Dala artist materials and the Teddy kids creative
materials brand.

## Local preview

Serve the folder with any static server, then open the site in a browser.

```bash
python3 -m http.server 4173
```

The current preview URL is:

```text
http://127.0.0.1:4173/
```

## Editing catalog content

Open `cms.html` from the same local server:

```text
http://127.0.0.1:4173/cms.html
```

The CMS stores a draft in browser local storage so you can preview edits on the
site immediately. When the catalog is ready, use `Export Data` in the CMS and
replace `catalog-data.js` with the exported content.

## Static publishing

There is no build step yet. Deploy these files and folders as a static site:

- `index.html`
- `styles.css`
- `app.js`
- `catalog-data.js`
- `cms.html`
- `cms.css`
- `cms.js`
- `assets/`
