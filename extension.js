const vscode = require('vscode');
const createProject = require('./lib/createProject');
const buildPackage = require('./lib/buildPackage');
const certificateManager = require('./lib/certificateManager');
const launchWits = require('./lib/witsLauncher');
const launchApplication = require('./lib/launchApplication');
const toolManager = require('./lib/toolManager');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.createProject', async () => createProject())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.buildPackage', () => buildPackage())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.certificateManager', async () => certificateManager())
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.launchApplication', async () => launchApplication(false))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.debugApplication', async () => launchApplication(true))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.witsStart', async () => launchWits('start'))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.witsWatch', async () => launchWits('watch'))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('tizentv.witsStop', async () => launchWits('stop'))
    )

    if (toolManager.checkLocalTools() == false) {
        toolManager.prepareTools();

        let platform = process.platform;
        if (platform != 'win32') {
            const fs = require('fs');
            let sdbTool = `${__dirname}/tools//sdb`;
            let secretTool = platform == 'linux' ? `${__dirname}/tools/certificate-encryptor/secret-tool` : null;
            if (platform == 'linux') {
                try {
                    fs.accessSync(sdbTool, fs.constants.S_IXUSR);
                } catch(err) {
                    fs.chmodSync(sdbTool, fs.constants.S_IXUSR)
                }
                try {
                    fs.accessSync(secretTool, fs.constants.S_IXUSR);
                } catch(err) {
                    fs.chmodSync(secretTool, fs.constants.S_IXUSR)
                }
            } 
            if (platform == 'darwin') {
                try {
                    fs.accessSync(sdbTool, '0777');
                } catch(err) {
                    fs.chmodSync(sdbTool, '0777');
                }
            }
        }
    }
}
exports.activate = activate;

// This method is called when your extension is deactivated
function deactivate() {
    // Do nothing
}
exports.deactivate = deactivate;