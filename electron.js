/* jshint node: true */
'use strict';

const electron             = require('electron');
const path                 = require('path');
// const defaultMenu          = require('electron-default-menu');
// const Menu                 = require('menu');
const {app, BrowserWindow} = electron;
const dirname              = __dirname || path.resolve(path.dirname());
const emberAppLocation     = `file://${dirname}/dist/index.html`;

let mainWindow = null;

// Uncomment the lines below to enable Electron's crash reporter
// For more information, see http://electron.atom.io/docs/api/crash-reporter/

// electron.crashReporter.start({
//     productName: 'YourName',
//     companyName: 'YourCompany',
//     submitURL: 'https://your-domain.com/url-to-submit',
//     autoSubmit: true
// });

const {Menu} = require('electron')

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform === 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      }
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = require('electron').app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      }
    ]
  })
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}



app.on('window-all-closed', function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 750
    });

    delete mainWindow.module;

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();

    // By default, we'll open the Ember App by directly going to the
    // file system.
    //
    // Please ensure that you have set the locationType option in the
    // config/environment.js file to 'hash'. For more information,
    // please consult the ember-electron readme.
    mainWindow.loadURL(emberAppLocation);

    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.loadURL(emberAppLocation);
    });

    mainWindow.webContents.on('crashed', () => {
        console.log('Your Ember app (or other code) in the main window has crashed.');
        console.log('This is a serious issue that needs to be handled and/or debugged.');
    });

    mainWindow.on('unresponsive', () => {
        console.log('Your Ember app (or other code) has made the window unresponsive.');
    });

    mainWindow.on('responsive', () => {
        console.log('The main window has become responsive again.');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // const menu = defaultMenu();
    //
    // Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Handle an unhandled error in the main thread
    //
    // Note that 'uncaughtException' is a crude mechanism for exception handling intended to
    // be used only as a last resort. The event should not be used as an equivalent to
    // "On Error Resume Next". Unhandled exceptions inherently mean that an application is in
    // an undefined state. Attempting to resume application code without properly recovering
    // from the exception can cause additional unforeseen and unpredictable issues.
    //
    // Attempting to resume normally after an uncaught exception can be similar to pulling out
    // of the power cord when upgrading a computer -- nine out of ten times nothing happens -
    // but the 10th time, the system becomes corrupted.
    //
    // The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
    // resources (e.g. file descriptors, handles, etc) before shutting down the process. It is
    // not safe to resume normal operation after 'uncaughtException'.
    process.on('uncaughtException', (err) => {
        console.log('An exception in the main thread was not handled.');
        console.log('This is a serious issue that needs to be handled and/or debugged.');
        console.log(`Exception: ${err}`);
    });
});
