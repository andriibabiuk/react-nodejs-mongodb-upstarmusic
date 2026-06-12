const { app, BrowserWindow } = require('electron');

let win;

app.disableHardwareAcceleration();

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

app.on('ready', function () {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: { nodeIntegration: true, contextIsolation: false },
	});

	win.loadURL(`file://${__dirname}/index.html`);
});
