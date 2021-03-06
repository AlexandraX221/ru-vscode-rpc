'use strict';
import * as vscode from 'vscode';

const DiscordRPC = require("discord-rpc");
const ClientId = '466039114878418944';
DiscordRPC.register(ClientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let langs = ['typescript', 'javascript', 'php', 'css', 'html', 'json', 'markdown', 'csharp', 'aspnetcorerazor'];
let timestamp: number;

export function activate(context: vscode.ExtensionContext) {
    console.log('Расширение Включено!');
    timestamp = new Date().getTime();
    let cmdActivate = vscode.commands.registerCommand('StartRich', () => {
        
        vscode.window.showInformationMessage('Статус Активен!');
        console.log("Инициализация RPC...");
        rpc.login(ClientId).catch(console.error);
        rpc.on('ready', () => {
            console.log("RPC Запущено!");
            updateActivity();
        });

        vscode.window.onDidChangeActiveTextEditor(editor => {
            updateActivity();
        });
    });

    let cmdDisable = vscode.commands.registerCommand('StopRich', async () => {
        if (!rpc) return; 
        await rpc.destroy();
        vscode.window.showInformationMessage('Статус Выключен!');
    });

    context.subscriptions.push(cmdActivate, cmdDisable);
}

export async function deactivate() {
    if (!rpc) return;
    await rpc.destroy();
}

function updateActivity() {
    let editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        rpc.setActivity({
            details: vscode.workspace.name,
            state: "Файл не открыт",
            largeImageKey: "undefined",
            largeImageText: "Не Найдено",
            smallImageKey: "logo",
            smallImageText: "Visual Studio Code",
            startTimestamp: timestamp,
            instance: false
        });
        return;
    }
    let fileName = editor.document.fileName;
    let lang: string;
    if (langs.indexOf(editor.document.languageId) == -1) {
        lang = "undefined";
    } else {
        lang = editor.document.languageId;
    }
    rpc.setActivity({
        details: vscode.workspace.name,
        state: "Редактирует " + fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length),
        largeImageKey: lang,
        largeImageText: lang,
        smallImageKey: 'logo',
        smallImageText: 'Visual Studio Code',
        startTimestamp: timestamp,
        instance: false,
    });
}

