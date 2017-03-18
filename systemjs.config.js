/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'ng2-codemirror':            'npm:ng2-codemirror',
      'codemirror':                'npm:codemirror',
      '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
      'd3': 'npm:d3',
      'd3-array': 'npm:d3-array/',
      'd3-axis': 'npm:d3-axis/',
      'd3-collection': 'npm:d3-collection/',
      'd3-color': 'npm:d3-color/',
      'd3-dispatch': 'npm:d3-dispatch/',
      'd3-ease': 'npm:d3-ease/',
      'd3-format': 'npm:d3-format/',
      'd3-interpolate': 'npm:d3-interpolate/',
      'd3-path': 'npm:d3-path/',
      'd3-scale': 'npm:d3-scale/',
      'd3-selection': 'npm:d3-selection/',
      'd3-shape': 'npm:d3-shape/',
      'd3-time': 'npm:d3-time/',
      'd3-time-format': 'npm:d3-time-format/',
      'd3-timer': 'npm:d3-timer/',
      'd3-transition': 'npm:d3-transition/'
    },
    // packages tells the System loader how to load when no filename and/or no extension
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
      'd3': { "main": 'build/d3.min.js', "defaultExtension": "js"},
      'd3-array': { "main": 'build/d3-array.min.js', "defaultExtension": "js"},
      'd3-axis': { "main": 'build/d3-axis.min.js', "defaultExtension": "js"},
      'd3-collection': { "main": 'build/d3-collection.js', "defaultExtension": "js"},
      'd3-color': { "main": 'build/d3-color.min.js', "defaultExtension": "js"},
      'd3-dispatch': { "main": 'build/d3-dispatch.min.js', "defaultExtension": "js"},
      'd3-ease': { "main": 'build/d3-ease.min.js', "defaultExtension": "js"},
      'd3-format': { "main": 'build/d3-format.min.js', "defaultExtension": "js"},
      'd3-interpolate': { "main": 'build/d3-interpolate.min.js', "defaultExtension": "js"},
      'd3-path': { "main": 'build/d3-path.min.js', "defaultExtension": "js"},
      'd3-scale': { "main": 'build/d3-scale.min.js', "defaultExtension": "js"},
      'd3-selection': { "main": 'build/d3-selection.min.js', "defaultExtension": "js"},
      'd3-shape': { "main": 'build/d3-shape.min.js', "defaultExtension": "js"},
      'd3-time': { "main": 'build/d3-time.min.js', "defaultExtension": "js"},
      'd3-time-format': { "main": 'build/d3-time-format.min.js', "defaultExtension": "js"},
      'd3-timer': { "main": 'build/d3-timer.min.js', "defaultExtension": "js"},
      'd3-transition': { "main": 'build/d3-transition.min.js', "defaultExtension": "js"}

    }
  });
})(this);
