# Junk Robot Simulator

This repository is written by Chevy Ng Zhi Wei of University College London.
The purpose of the repository is to create a robot simulator which works with the junk robot that was created as part of Chevy Individual Final Year Project.

The code was written using Angular2 Quickstart repository at [angular.io quickstart](https://angular.io/docs/ts/latest/quickstart.html)

## Prerequisites

Node.js and npm are essential to Angular development.

<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">
Get it now</a> if it's not already installed on your machine.

**Verify that you are running at least node `v4.x.x` and npm `3.x.x`**
by running `node -v` and `npm -v` in a terminal/console window.
Older versions produce errors.

## Running the repository

Clone this repo into new project folder (e.g., `junk-robot`).
```shell
git clone https://github.com/chevyng/junk-robot
cd junk-robot
npm install
npm install ng-2codemirror
```

Open project folder in text editor of choice of use. I used [Atom](https://atom.io/) because it's awesome and free!

Open `Systemjs.config.js` file

Ensure ng2-codemirror is set to `lib/index.js` and not `lib/Codemirror.js`
```shell
...
packages: {
  app: {
    main: './main.js',
    defaultExtension: 'js'
  },
  rxjs: {
    defaultExtension: 'js'
  },  
  'ng2-codemirror': { main: 'lib/index.js', defaultExtension: 'js' },
  'codemirror': { main: 'lib/codemirror.js', defaultExtension: 'js' },
```

#### Lastly to run the robot simulator

```shell
npm start
```

Shut it down manually with `Ctrl-C`.

### Delete _non-essential_ files (optional)

You can quickly delete the _non-essential_ files that concern testing and QuickStart repository maintenance
(***including all git-related artifacts*** such as the `.git` folder and `.gitignore`!)
by entering the following commands while in the project folder:

##### OS/X (bash)
```shell
xargs -a non-essential-files.txt rm -rf
rm app/*.spec*.ts
rm non-essential-files.txt
```

##### Windows
```shell
for /f %i in (non-essential-files.txt) do del %i /F /S /Q
rd .git /s /q
rd e2e /s /q
```
