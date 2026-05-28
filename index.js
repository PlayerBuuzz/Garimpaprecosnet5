const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const GROUP_NAME = 'Assuntos primaria';
const DOWNLOAD_FOLDER = path.join(__dirname, 'downloads');

if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER);
}

console.log('🚀 Inicializando WhatsApp...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        executablePath:
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox']
    }
});

async function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function baixarPDF() {
    console.log('🌐 Conectando Chrome debug...');

    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222'
    });

    // pega abas já abertas
    const pages = await browser.pages();

    // tenta achar a aba do PDF
    let page = null;

    for (const p of pages) {
        const titulo = await p.title();

        console.log('📄 Aba encontrada:', titulo);

        if (
            titulo.toLowerCase().includes('.pdf') ||
            titulo.toLowerCase().includes('sharepoint') ||
            titulo.toLowerCase().includes('saojoseteste')
        ) {
            page = p;
            break;
        }
    }

    if (!page) {
        throw new Error(
            'Não achei a aba do PDF. Deixe o relatório aberto no Chrome.'
        );
    }

    console.log('✅ Aba do PDF encontrada!');

    const cdp = await page.target().createCDPSession();

    await cdp.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: DOWNLOAD_FOLDER
    });

    console.log('🧹 Limpando PDFs antigos...');

    const antigos = fs.readdirSync(DOWNLOAD_FOLDER);

    for (const arquivo of antigos) {
        fs.unlinkSync(path.join(DOWNLOAD_FOLDER, arquivo));
    }

    console.log('⏳ Esperando PDF estabilizar...');
    await esperar(8000);

    console.log('⬇️ Tentando clicar em download...');

    const clicou = await page.evaluate(() => {
        const elementos = [
            ...document.querySelectorAll('button, div, span')
        ];

        for (const el of elementos) {
            const texto =
                el.innerText?.trim()?.toLowerCase() || '';

            const aria =
                el.getAttribute('aria-label')?.toLowerCase() || '';

            if (
                texto.includes('baixar') ||
                texto.includes('download') ||
                aria.includes('baixar') ||
                aria.includes('download')
            ) {
                el.click();
                return true;
            }
        }

        return false;
    });

    console.log('Botão clicado?', clicou);

    if (!clicou) {
        console.log('⚠️ Não achou texto, tentando primeiro botão...');

        const botoes = await page.$$('button');

        if (botoes.length) {
            await botoes[0].click();
        }
    }

    console.log('⏳ Esperando download...');
    await esperar(15000);

    const arquivos = fs
        .readdirSync(DOWNLOAD_FOLDER)
        .filter(f => f.toLowerCase().endsWith('.pdf'));

    console.log('📁 PDFs encontrados:', arquivos);

    if (!arquivos.length) {
        throw new Error('Nenhum PDF foi baixado.');
    }

    const caminhoPdf = path.join(
        DOWNLOAD_FOLDER,
        arquivos[0]
    );

    console.log('✅ PDF baixado:', caminhoPdf);

    return caminhoPdf;
}

async function enviarRelatorio() {
    try {
        console.log('\n============================');
        console.log('🚀 NOVO ENVIO');
        console.log('============================');

        console.log('🔎 Procurando grupo...');

        const chats = await client.getChats();

        const grupo = chats.find(
            c => c.isGroup && c.name === GROUP_NAME
        );

        if (!grupo) {
            throw new Error(
                `Grupo "${GROUP_NAME}" não encontrado`
            );
        }

        console.log('✅ Grupo encontrado!');

        const pdfPath = await baixarPDF();

        console.log('📤 Enviando PDF...');

        const media = MessageMedia.fromFilePath(pdfPath);

        await grupo.sendMessage(media, {
            caption: '📄 Relatório automático'
        });

        console.log('✅ PDF enviado!');
        console.log('⏰ Próximo envio em 1 hora');

    } catch (err) {
        console.error('❌ ERRO:');
        console.error(err);
    }
}

let iniciou = false;

client.on('authenticated', async () => {
    console.log('✅ Autenticado!');

    if (iniciou) return;
    iniciou = true;

    await esperar(5000);

    await enviarRelatorio();

    setInterval(async () => {
        await enviarRelatorio();
    }, 60 * 60 * 1000);
});

client.on('loading_screen', (percent, message) => {
    console.log(`⏳ ${percent}% - ${message}`);
});

client.on('qr', () => {
    console.log('📱 Escaneie o QR');
});

client.initialize();