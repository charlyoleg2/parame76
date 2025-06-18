Parame76
========


Presentation
------------

*Parame76* is the top-monorepo for the design-library *desi76*, which contains a collection of 3D shapes.

This monorepo contains the following *javascript* package:

1. desi76: a *parametrix* design library
2. desi76-cli: the cli of desi76
3. desi76-ui: the web-ui of desi76
4. desi76-uis: the web-server of desi76-ui

This repo is a typical designer-repository using [parametrix](https://charlyoleg2.github.io/parametrix/).
The design-library and its associated UI and CLI are published as *npm-packages*.
The UI is also available on the github-page.


Links
-----

- [desi76-ui](https://charlyoleg2.github.io/parame76/) : public instance of the UI
- [sources](https://github.com/charlyoleg2/parame76) : git-repository
- [pkg](https://www.npmjs.com/package/desi76) : desi76 as npm-package
- [pkg-cli](https://www.npmjs.com/package/desi76-cli) : desi76-cli as npm-package
- [pkg-uis](https://www.npmjs.com/package/desi76-uis) : desi76-uis as npm-package


Usage for Makers
----------------

Parametrize and generate your 3D-files with the online-app:

[https://charlyoleg2.github.io/parame76/](https://charlyoleg2.github.io/parame76/)

Or use the UI locally:

```bash
npx desi76-uis
```

Or use the command-line-interface (CLI):

```bash
npx desi76-cli
```

Getting started for Dev
-----------------------

```bash
git clone https://github.com/charlyoleg2/parame76
cd parame76
npm i
npm run ci
npm run preview
```

Other useful commands:
```bash
npm run clean
npm run ls-workspaces
npm -w desi76 run check
npm -w desi76 run build
npm -w desi76-ui run dev
```

Prerequisite
------------

- [node](https://nodejs.org) version 22.0.0 or higher
- [npm](https://docs.npmjs.com/cli/v11/commands/npm) version 11.0.0 or higher


Publish a new release
---------------------

```bash
npm run versions
git commit -am 'increment sub versions'
npm version patch
git push
git push origin v0.5.6
```
