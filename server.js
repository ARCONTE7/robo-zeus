process.env.TZ = 'America/Sao_Paulo';

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const cors = require('cors');

moment.locale('pt-br');

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// CONFIGURAÇÕES
// =========================

// META / WHATSAPP CLOUD API
const TOKEN = "SEU_TOKEN_META_AQUI";
const PHONE_ID = "905733172633398";
const VERIFY_TOKEN = "zeus_webhook_2026";
const PORT = process.env.PORT || 3000;
const META_API_URL = `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`;

// PAINEL ZEUS
const PANEL_URL = "https://netuno.painelr.top";
const USERNAME = "Noname123";
const PASSWORD = "topnet123!";
const MEMBER_ID = "163207";

// CIABRA
const API_BASE_CIABRA = "https://api.az.center";
const CIABRA_PUBLIC_KEY = "";
const CIABRA_SECRET_KEY = "";
const CIABRA_AUTH = "Basic " + Buffer.from(`${CIABRA_PUBLIC_KEY}:${CIABRA_SECRET_KEY}`).toString('base64');
const CLIENTE_FIXO_CIABRA = "";

// URLS / APPS
const DNS_PLAYER = "http://plusstre.xyz";
const DNS_IPHONE = "http://esma26.top";
const LINK_APP_PROPRIO = "https://download.ottrun.com/downloads/525713/GrupoZeus-6.0-v801.apk";
const PROPRIO_NTDOWN = "22277";
const PROPRIO_DOWNLOADER = "277193";
const LINK_P2P_DIRETO = "https://dl.ntdev.in/38334";
const P2P_NTDOWN = "38334";
const P2P_DOWNLOADER = "178686";
const LINK_PC_WEB_1 = "http://webdosdeuses.top";
const LINK_PC_WEB_2 = "http://webtv-new.iptvsmarters.com/";
const LINK_PC_APP_1 = "http://bit.ly/smarterspro2024br";
const LINK_PC_APP_2 = "http://linktv.site/streamplayerpc";

// ARQUIVOS
const TESTES_FILE = './banco_testes.json';
const TRAVA_FILE = './trava_saudacao.json';
const CLIENTES_FILE = './clientes_planos.json';
const HISTORICO_FILE = './historico_conversas.json';

// GARANTIR ARQUIVOS E PASTA
if (!fs.existsSync('./midias')) {
    fs.mkdirSync('./midias', { recursive: true });
}

for (const arquivo of [TESTES_FILE, TRAVA_FILE, CLIENTES_FILE, HISTORICO_FILE]) {
    if (!fs.existsSync(arquivo)) {
        fs.writeFileSync(arquivo, JSON.stringify({}));
    }
}

// ESTADO
const userState = {};
const PLANOS_IDS = {
    'Mensal': '1',
    'Bimestral': '9',
    'Trimestral': '2',
    'Semestral': '3',
    'Anual': '4'
};

// =========================
// UTILITÁRIOS
// =========================

function lerJSON(caminho) {
    try {
        if (!fs.existsSync(caminho)) {
            fs.writeFileSync(caminho, JSON.stringify({}));
            return {};
        }
        const conteudo = fs.readFileSync(caminho, 'utf8');
        return (conteudo && conteudo.trim() !== "") ? JSON.parse(conteudo) : {};
    } catch (e) {
        return {};
    }
}

function salvarJSON(caminho, dados) {
    try {
        fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    } catch (e) {}
}

function logConversa(telefone, nome, de, texto) {
    const db = lerJSON(HISTORICO_FILE);

    if (!db[telefone]) {
        db[telefone] = {
            nome: nome || telefone,
            mensagens: [],
            lastUpdate: Date.now()
        };
    }

    if (nome) db[telefone].nome = nome;

    db[telefone].mensagens.push({
        de,
        texto,
        hora: moment().format('HH:mm')
    });

    if (db[telefone].mensagens.length > 50) {
        db[telefone].mensagens = db[telefone].mensagens.slice(-50);
    }

    db[telefone].lastUpdate = Date.now();
    salvarJSON(HISTORICO_FILE, db);
}

// =========================
// META / WHATSAPP CLOUD API
// =========================

async function enviarTexto(para, texto, origem = 'bot') {
    try {
        await axios.post(
            META_API_URL,
            {
                messaging_product: "whatsapp",
                to: para,
                type: "text",
                text: { body: texto }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        logConversa(para, null, origem, texto);
    } catch (e) {
        console.error("Erro enviarTexto:", e.response?.data || e.message);
    }
}

async function enviarBotoes(para, texto, botoes) {
    try {
        const buttons = botoes.map(b => ({
            type: "reply",
            reply: { id: b.id, title: b.title }
        }));

        await axios.post(
            META_API_URL,
            {
                messaging_product: "whatsapp",
                to: para,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: texto },
                    action: { buttons }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        logConversa(para, null, 'bot', `[BOTÕES]: ${texto}`);
    } catch (e) {
        console.error("Erro enviarBotoes:", e.response?.data || e.message);
    }
}

async function enviarLista(para, texto, tituloBtn, secoes) {
    try {
        await axios.post(
            META_API_URL,
            {
                messaging_product: "whatsapp",
                to: para,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: { text: texto },
                    action: { button: tituloBtn, sections: secoes }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        logConversa(para, null, 'bot', `[LISTA]: ${texto}`);
    } catch (e) {
        console.error("Erro enviarLista:", e.response?.data || e.message);
    }
}

// =========================
// PAINEL ZEUS
// =========================

async function obterSessao() {
    try {
        const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

        const getLogin = await axios.get(`${PANEL_URL}/login`, {
            headers: { 'User-Agent': agent }
        });

        const cookies = getLogin.headers['set-cookie']
            ? getLogin.headers['set-cookie'].map(c => c.split(';')[0])
            : [];

        const csrfToken =
            getLogin.data.match(/name=['"]csrf['"] value=['"](.*?)['"]/)?.[1] || '';

        const form = new URLSearchParams({
            csrf: csrfToken,
            username: USERNAME,
            password: PASSWORD,
            save: '1'
        });

        await axios.post(`${PANEL_URL}/login`, form, {
            headers: {
                'Cookie': cookies.join('; '),
                'User-Agent': agent
            },
            maxRedirects: 0,
            validateStatus: s => s < 400
        });

        return cookies.join('; ');
    } catch (e) {
        console.error('Erro obterSessao:', e.message);
        return null;
    }
}

async function gerarTeste(para, appId = null) {
    const db = lerJSON(TESTES_FILE);

    if (db[para]) {
        const proximaData = moment(db[para].expiracao)
            .subtract(6, 'hours')
            .add(14, 'days');

        if (moment().isBefore(proximaData)) {
            await enviarTexto(
                para,
                `Calma, calma amigão! kk 😂 Você já brilhou por aqui antes.

Infelizmente fornecemos apenas *um teste gratuito* por pessoa a cada 14 dias.

👤 *Usuário:* ${db[para].user}
🔑 *Senha:* ${db[para].pass || '(Apenas usuário)'}

🚀 Se quiser continuar, digite *MENU* e vá em *PLANOS*!`
            );
            return null;
        }
    }

    const sessao = await obterSessao();
    if (!sessao) {
        await enviarTexto(para, "⚠️ Servidor em manutenção. Tente novamente.");
        return null;
    }

    try {
        const payload = new URLSearchParams({
            key: 't-basic',
            quick: '1',
            method: 'post',
            action: `${PANEL_URL}/api/lines`
        });

        if (appId) payload.append('app_id', appId);

        const resCriar = await axios.post(`${PANEL_URL}/api/lines`, payload, {
            headers: {
                'Cookie': sessao,
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (resCriar.data && resCriar.data.ajax) {
            const resDados = await axios.get(resCriar.data.ajax[0].action, {
                headers: {
                    'Cookie': sessao,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const cleanText = resDados.data.html['#myModal']
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                .trim();

            let user = (cleanText.match(/usu[aá]rio:\s*([^\s\n]+)/i)?.[1] || '')
                .replace(/\*/g, '')
                .trim();

            let pass = (cleanText.match(/senha:\s*([^\s\n]+)/i)?.[1] || '')
                .replace(/\*/g, '')
                .trim();

            if (!user) {
                const lines = cleanText.split('\n');
                const userLine = lines.find(l => l.includes('ário:'));
                if (userLine) user = userLine.split(':')[1].replace(/\*/g, '').trim();
            }

            const criacao = moment().utcOffset("-03:00").format();
            const exp = moment().utcOffset("-03:00").add(6, 'hours').format();

            db[para] = { user, pass, expiracao: exp, criacao };
            salvarJSON(TESTES_FILE, db);

            return { user, pass, exp, criacao };
        }

        return null;
    } catch (e) {
        console.error("Erro gerarTeste:", e.message);
        return null;
    }
}

async function executarRenovacao(usuario, planoId, nomePlano) {
    try {
        const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

        const loginPage = await axios.get(PANEL_URL + '/login', {
            headers: { 'User-Agent': agent }
        });

        const cookies = loginPage.headers['set-cookie']
            ? loginPage.headers['set-cookie'].map(c => c.split(';')[0])
            : [];

        const csrf = loginPage.data.match(/name=['"]csrf['"] value=['"](.*?)['"]/)?.[1];

        const form = new URLSearchParams();
        form.append('csrf', csrf);
        form.append('username', USERNAME);
        form.append('password', PASSWORD);
        form.append('save', '1');

        await axios.post(PANEL_URL + '/login', form, {
            headers: { 'Cookie': cookies.join('; '), 'User-Agent': agent },
            maxRedirects: 0,
            validateStatus: (s) => s < 400
        });

        const res = await axios.get(
            PANEL_URL + '/api/lines?username=' + usuario + '&member_id=' + MEMBER_ID,
            {
                headers: {
                    'Cookie': cookies.join('; '),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );

        const dataString = JSON.stringify(res.data);
        const match = dataString.match(/["']?id["']?\s*[:=]\s*["']?(\d+)["']?/);

        if (!match || !match[1]) {
            console.log("⚠️ Resposta do Painel:", dataString.substring(0, 200));
            throw new Error("ID da linha não encontrado");
        }

        const lineId = match[1];
        console.log('ID da linha encontrado: ' + lineId);

        const payload = new URLSearchParams();
        payload.append('package_id', planoId);
        payload.append('remaining_months', '0');

        await axios.post(PANEL_URL + '/api/lines/' + lineId + '/renew', payload, {
            headers: {
                'Cookie': cookies.join('; '),
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        console.log('Renovacao executada com sucesso para usuario: ' + usuario + ' (Plano: ' + nomePlano + ')');
        return true;
    } catch (e) {
        console.error("❌ Erro na renovacao:", e.message);
        return false;
    }
}

// =========================
// CIABRA / PAGAMENTO
// =========================

async function buscarPixQRCode(installmentId, tentativas = 5) {
    for (let i = 0; i < tentativas; i++) {
        try {
            const urlPayment = API_BASE_CIABRA + '/payments/applications/installments/' + installmentId;
            console.log('[' + (i + 1) + '/' + tentativas + '] Buscando PIX para installment: ' + installmentId);

            const response = await axios.get(urlPayment, {
                headers: {
                    'Authorization': CIABRA_AUTH,
                    'Content-Type': 'application/json'
                }
            });

            const pixData = response.data;

            if (pixData.pix && pixData.pix.emv) {
                console.log('PIX gerado com sucesso!');
                return pixData;
            }

            if (pixData.pix && pixData.pix.status === 'GENERATING') {
                console.log('PIX ainda gerando, aguardando 3s...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                continue;
            }

            return pixData;
        } catch (error) {
            console.log('Erro tentativa ' + (i + 1) + ': ' + error.message);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return null;
}

async function checarStatusCiabra(invoiceId, installmentId) {
    try {
        if (installmentId) {
            const urlInstallment = API_BASE_CIABRA + '/payments/applications/installments/' + installmentId;
            const response = await axios.get(urlInstallment, {
                headers: { 'Authorization': CIABRA_AUTH }
            });
            const data = response.data;
            if (data.pix && data.pix.status) {
                return data.pix.status;
            }
        }

        const urlInvoice = API_BASE_CIABRA + '/invoices/applications/invoices/' + invoiceId;
        const response = await axios.get(urlInvoice, {
            headers: { 'Authorization': CIABRA_AUTH }
        });

        const invoice = response.data;
        if (invoice.installments && invoice.installments[0]) {
            return invoice.installments[0]._status || invoice.installments[0].status;
        }

        return invoice.status;
    } catch (error) {
        console.log('Erro ao checar status:', error.message);
        return null;
    }
}

async function renovarPlanoCliente(telefone, plano, valor, nomeCliente) {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const payload = {
            customerId: CLIENTE_FIXO_CIABRA,
            description: 'Renovacao ' + plano + ' - ' + nomeCliente,
            dueDate: tomorrow.toISOString(),
            installmentCount: 1,
            invoiceType: "SINGLE",
            items: [],
            price: valor,
            paymentTypes: ["PIX"],
            notifications: [],
            webhooks: []
        };

        console.log('Criando invoice renovacao...');
        const response = await axios.post(
            API_BASE_CIABRA + '/invoices/applications/invoices',
            payload,
            {
                headers: {
                    'Authorization': CIABRA_AUTH,
                    'Content-Type': 'application/json'
                }
            }
        );

        const invoiceData = response.data;
        console.log('Invoice criado:', invoiceData.id);

        if (invoiceData.installments && invoiceData.installments[0]) {
            const installmentId = invoiceData.installments[0].id;
            await new Promise(resolve => setTimeout(resolve, 2000));
            const pixData = await buscarPixQRCode(installmentId, 5);
            if (pixData) {
                invoiceData.pixData = pixData;
                invoiceData.installmentId = installmentId;
            }
        }

        return invoiceData;
    } catch (error) {
        console.error('Erro ao criar cobranca renovacao:', error.message);
        return null;
    }
}

// =========================
// MENUS
// =========================

async function menuPrincipal(to, nome) {
    await enviarBotoes(to, `Olá ${nome || 'Cliente'}!\n\nEscolha uma opção abaixo:`, [
        { id: "m_teste", title: "🎁 Teste Grátis" },
        { id: "m_planos", title: "💎 Planos" },
        { id: "m_suporte", title: "👨‍💻 Suporte" }
    ]);
}

async function menuDispositivos(to) {
    await enviarLista(to, "🎁 ESCOLHA SEU DISPOSITIVO\n\nOnde você vai assistir?", "Escolher", [{
        title: "Dispositivos Disponíveis",
        rows: [
            { id: "d_android", title: "Celular Android", description: "Smartphone ou Tablet" },
            { id: "d_iphone", title: "iPhone/iPad", description: "Aparelhos Apple" },
            { id: "d_pc", title: "Computador/Notebook", description: "PC ou Laptop" },
            { id: "d_tvbox", title: "TV Box / TV Android", description: "Mi Stick, Fire Stick, etc" },
            { id: "d_smarttv", title: "Smart TV", description: "Samsung, LG, Roku, etc" }
        ]
    }]);
}

// =========================
// HEALTHCHECK
// =========================

app.get('/', (req, res) => {
    res.send('Zeus online');
});

// =========================
// WEBHOOK META
// =========================

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        return res.send(req.query['hub.challenge']);
    }
    return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0]?.value;

        if (!changes || !changes.messages) {
            return res.sendStatus(200);
        }

        const msg = changes.messages[0];
        const from = msg.from;
        const nome = changes.contacts?.[0]?.profile?.name || "Cliente";
        const texto = (msg.text?.body || "").toLowerCase().trim();
        const buttonId = msg.interactive?.button_reply?.id;
        const listId = msg.interactive?.list_reply?.id;

        logConversa(from, nome, 'cliente', texto || buttonId || listId || "[Outro]");

        if (!userState[from]) userState[from] = { step: 'INICIO' };

        if (texto === 'menu') {
            await menuPrincipal(from, nome);
            return res.sendStatus(200);
        }

        if (buttonId === 'm_teste') {
            await menuDispositivos(from);
            return res.sendStatus(200);
        }

        if (buttonId === 'm_planos') {
            await enviarLista(from, "💎 PLANOS PREMIUM\n\nEscolha sua assinatura:", "Ver Planos", [{
                title: "Opções",
                rows: [
                    { id: "plano_a", title: "Plano Mensal", description: "R$ 25,00 - 30 dias" },
                    { id: "plano_b", title: "Plano Bimestral", description: "R$ 45,00 - 60 dias" },
                    { id: "plano_c", title: "Trimestral", description: "R$ 70,00 - 90 dias" },
                    { id: "plano_d", title: "Semestral", description: "R$ 120,00 - 180 dias" },
                    { id: "plano_e", title: "Anual", description: "R$ 230,00 - 365 dias" }
                ]
            }]);
            return res.sendStatus(200);
        }

        if (listId === 'd_iphone') {
            const d = await gerarTeste(from);
            if (d) {
                await enviarTexto(from, `🎉 TESTE GERADO!

⏳ Válido até: ${moment(d.exp).format('DD/MM/YYYY HH:mm:ss')}

🌐 URL: ${DNS_IPHONE}
👤 Usuário: ${d.user}
🔑 Senha: ${d.pass}`);
            }
            return res.sendStatus(200);
        }

        if (listId === 'd_pc') {
            const d = await gerarTeste(from);
            if (d) {
                await enviarTexto(from, `🎉 TESTE GERADO!

⏳ Válido até: ${moment(d.exp).format('DD/MM/YYYY HH:mm:ss')}

🌐 DNS: ${DNS_PLAYER}
👤 Usuário: ${d.user}
🔑 Senha: ${d.pass}

WEB 1: ${LINK_PC_WEB_1}
WEB 2: ${LINK_PC_WEB_2}

APP 1: ${LINK_PC_APP_1}
APP 2: ${LINK_PC_APP_2}`);
            }
            return res.sendStatus(200);
        }

        if (listId && listId.startsWith('plano_')) {
            const planos = {
                'plano_a': { nome: 'Mensal', valor: 25, dias: 30 },
                'plano_b': { nome: 'Bimestral', valor: 45, dias: 60 },
                'plano_c': { nome: 'Trimestral', valor: 70, dias: 90 },
                'plano_d': { nome: 'Semestral', valor: 120, dias: 180 },
                'plano_e': { nome: 'Anual', valor: 230, dias: 365 }
            };

            const planoEscolhido = planos[listId];
            if (!planoEscolhido) return res.sendStatus(200);

            await enviarTexto(from, "⏳ Gerando PIX...");
            const cobranca = await renovarPlanoCliente(from, planoEscolhido.nome, planoEscolhido.valor, nome);

            if (cobranca && cobranca.url) {
                const clientes = lerJSON(CLIENTES_FILE);
                clientes[from] = {
                    nome,
                    plano: planoEscolhido.nome,
                    valor: planoEscolhido.valor,
                    dias: planoEscolhido.dias,
                    dataCompra: moment().toISOString(),
                    dataVencimento: moment().add(planoEscolhido.dias, 'days').toISOString(),
                    invoiceId: cobranca.id,
                    installmentId: cobranca.installmentId,
                    statusPagamento: 'AGUARDANDO'
                };
                salvarJSON(CLIENTES_FILE, clientes);

                await enviarTexto(from, `✅ PAGAMENTO GERADO!

📦 Plano: ${planoEscolhido.nome}
💰 Valor: R$ ${planoEscolhido.valor},00

🔗 Link PIX:
${cobranca.url}`);

                const installmentId = cobranca.installmentId;

                let tentativas = 0;
                const intervaloMonitoramento = setInterval(async () => {
                    tentativas++;

                    if (tentativas > 60) {
                        clearInterval(intervaloMonitoramento);
                        return;
                    }

                    const status = await checarStatusCiabra(cobranca.id, installmentId);
                    const statusPago = ['PAID', 'paid', 'RECEIVED', 'CONFIRMED', 'SETTLED', 'CONFIRMADA', 'COMPLETED', 'APPROVED'];

                    if (statusPago.includes(status)) {
                        clearInterval(intervaloMonitoramento);

                        const testes = lerJSON(TESTES_FILE);
                        const usuario = testes[from]?.user;
                        const senha = testes[from]?.pass;
                        const planoId = PLANOS_IDS[planoEscolhido.nome] || '1';

                        if (usuario) {
                            const renovado = await executarRenovacao(usuario, planoId, planoEscolhido.nome);

                            if (renovado) {
                                await enviarTexto(from, `🎉 PAGAMENTO CONFIRMADO!

✅ Seu plano ${planoEscolhido.nome} foi ativado!

👤 Usuário: ${usuario}
🔑 Senha: ${senha}
📅 Vencimento: ${moment().add(planoEscolhido.dias, 'days').format('DD/MM/YYYY HH:mm')}`);
                            } else {
                                await enviarTexto(from, `🎉 PAGAMENTO CONFIRMADO!

⚠️ Houve erro na renovação automática.
Fale com o suporte.`);
                            }
                        } else {
                            await enviarTexto(from, `🎉 PAGAMENTO CONFIRMADO!

✅ Seu plano ${planoEscolhido.nome} foi confirmado.`);
                        }
                    }
                }, 10000);
            } else {
                await enviarTexto(from, "❌ Erro ao gerar pagamento.");
            }

            return res.sendStatus(200);
        }

        if (texto === 'oi' || texto === 'olá' || texto === 'ola' || userState[from].step === 'INICIO') {
            userState[from].step = 'MENU';
            await menuPrincipal(from, nome);
        }

        return res.sendStatus(200);
    } catch (e) {
        console.error("Erro no webhook:", e.message);
        return res.sendStatus(200);
    }
});

app.listen(PORT, () => console.log(`🔱 ZEUS PRO v10.0 OFICIAL - ONLINE NA PORTA ${PORT} 🛡️`));
