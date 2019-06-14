# RPL Source

This documentation is for developers who will be updating the RPL source code, written in Angular.

## Setup

Before working on the source code, you will need to install dependencies using `npm i` from the **rpl-src** directory.

Additionally, you will need to add some sample pattern library data to work with while developing. The easiest way to do this is to copy the existing sample files.

1. Create an **assets** directory under **/rpl-src/src**.
1. Copy the **/rpl-assets** directory to the new **assets** directory.
1. Create a **user-assets** directory under the new **assets** directory.
1. Copy the **/src/html** and **/src/styles** directories to the new **user-assets** directory.
1. Copy the **/.tmp/rpl-scoped-styles.css** file to the new **user-assets/styles** directory.

The sample file structure should appear as follows:

```
rpl-src
└ src
  └ assets
    └ rpl-assets
      ├ rpl-images
      └ rpl-pages
        rpl-config.json
        rpl-logo.svg
        rpl-styles.css
      user-assets
      ├ html
      │ └ components
      │   └ ...
      │   form.html
      │   index.html
      │   interior.html
      └ styles
        ├ modules
        └ partials
          main.scss
          rpl-scoped-styles.css
```

## Development

Run `ng serve -o` from the **rpl-src** directory to start a server and open RPL in a browser. Images and page previews may be broken due to relative paths that don't match the production values.

## Building

When changes are complete:

1. Change to the root directory.
1. Run `npm run build-rpl` to generate a new **dist** directory under **rpl-src**.
