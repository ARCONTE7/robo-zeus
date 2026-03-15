process.env.TZ = 'America/Sao_Paulo';
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const readline = require('readline');
const cors = require('cors');

moment.locale('pt-br');
const app = express();

app.use(cors());
app.use(express.json());

/* ═══════════════════════════════════════════════════════════════════════════════
 * 🔱 ROBÔ ZEUS PRO v11.0 - CORRIGIDO 🔱
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ⚙️ CONFIGURAÇÕES META API
const TOKEN = "EAAUuGpEfQx4BQtYLc0drrtpUy3OeckAKEF7fqfjkkA0nTeypoNEiVo6ZCDihIsnnGZAwaZC4ueqZAlcoJS8DqjVHfARonfzKFf17SPWURuPE9CYkeOajgtk5Bnp61ognewIZCHeFebsV8Tdo8wEDtMWyZBlZCSZBXwlJ2JZBbJ8pUGohsKtOouZBn7jxWBWrdFIQZDZD";
const PHONE_ID = "905733172633398";
const VERIFY_TOKEN = "zeus_webhook_2026";
const PORT = process.env.PORT || 3000;
const META_API_URL = `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`;

// ⚙️ CONFIGURAÇÃO CIABRA
const API_BASE_CIABRA = "https://api.az.center";
const CIABRA_PUBLIC_KEY = "";
const CIABRA_SECRET_KEY = "";
const CIABRA_AUTH = "Basic " + Buffer.from(`${CIABRA_PUBLIC_KEY}:${CIABRA_SECRET_KEY}`).toString('base64');
const CLIENTE_FIXO_CIABRA = "";

// ⚙️ CONFIGURAÇÕES DO PAINEL ZEUS
const PANEL_URL = "https://netuno.painelr.top";
const USERNAME = "Noname123";
const PASSWORD = "topnet123!";
const MEMBER_ID = "163207";

// 👨‍💻 SUPORTE HUMANO
const SUPORTE_HUMANO_NUMERO = "5511966685017";
const MSG_SUPORTE_HUMANO = `👨‍💻 *ATENDIMENTO HUMANO*

Para ativação, renovação ou pagamento, fale agora com nosso suporte humano.

📲 Clique aqui: wa.me/${SUPORTE_HUMANO_NUMERO}

Número: ${SUPORTE_HUMANO_NUMERO}`;

// ⚙️ URLS E CÓDIGOS DE INSTALAÇÃO
const DNS_PLAYER = "http://plusstre.xyz";
const DNS_IPHONE = "http://esma26.top";
const LINK_APP_PROPRIO = "https://download.ottrun.com/downloads/525713/GrupoZeus-6.0-v801.apk";
const PROPRIO_NTDOWN = "22277";
const PROPRIO_DOWNLOADER = "277193";
const LINK_P2P_DIRETO = "https://dl.ntdev.in/38334";
const P2P_NTDOWN = "38334";
const P2P_DOWNLOADER = "178686";
const LINK_XCIPTV_PLAY = "https://play.google.com/store/apps/details?id=com.nathnetwork.xciptv";
const LINK_VU_IPTV = "https://apps.apple.com/br/app/vu-iptv-player/id6526480705";

// OPÇÕES COMPUTADOR
const LINK_PC_WEB_1 = "http://webdosdeuses.top";
const LINK_PC_WEB_2 = "http://webtv-new.iptvsmarters.com/";
const LINK_PC_APP_1 = "http://bit.ly/smarterspro2024br";
const LINK_PC_APP_2 = "http://linktv.site/streamplayerpc";

// 📁 ARQUIVOS DE DADOS
const TESTES_FILE = './banco_testes.json';
const TRAVA_FILE = './trava_saudacao.json';
const SUPORTE_FILE = './suporte_aguardando.json';
const CLIENTES_FILE = './clientes_planos.json';
const HISTORICO_FILE = './historico_conversas.json';

const botStartTime = Math.floor(Date.now() / 1000);
const userState = {};
let msgStats = { porMinuto: [], porHora: [], total: 0 };

// 🛠️ FUNÇÕES UTILITÁRIAS
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

// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 FUNÇÃO DE RENOVAÇÃO NO PAINEL 🔱
// ═══════════════════════════════════════════════════════════════════════════════

async function executarRenovacao(usuario, planoId, nomePlano) {
    try {
        const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

        const loginPage = await axios.get(PANEL_URL + '/login', { headers: { 'User-Agent': agent } });
        const cookies = loginPage.headers['set-cookie'] ? loginPage.headers['set-cookie'].map(c => c.split(';')[0]) : [];
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

        const res = await axios.get(PANEL_URL + '/api/lines?username=' + usuario + '&member_id=' + MEMBER_ID, {
            headers: { 'Cookie': cookies.join('; '), 'X-Requested-With': 'XMLHttpRequest' }
        });

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
            headers: { 'Cookie': cookies.join('; '), 'X-Requested-With': 'XMLHttpRequest' }
        });

        console.log('Renovacao executada com sucesso para usuario: ' + usuario + ' (Plano: ' + nomePlano + ')');
        return true;

    } catch (e) {
        console.error("❌ Erro na renovacao:", e.message);
        return false;
    }
}

const PLANOS_IDS = {
    'Mensal': '1',
    'Bimestral': '9',
    'Trimestral': '2',
    'Semestral': '3',
    'Anual': '4'
};

// 📝 TABELA DE PREÇOS ATUALIZADA
const TABELA_PRECOS = `📊 *PLANOS PROMOCIONAIS* 🔥

━━━━━━━━━━━━━━━━━━━━
💎 *Mensal:*    R$ 25,00
   (R$ 5 de desconto)
━━━━━━━━━━━━━━━━━━━━
💎 *Bimestral:*   R$ 45,00
   (R$ 15 de desconto)
━━━━━━━━━━━━━━━━━━━━
💎 *Trimestral:*  R$ 70,00
   (R$ 20 de desconto)
━━━━━━━━━━━━━━━━━━━━
💎 *Semestral:*   R$ 135,00
   (R$ 45 de desconto)
━━━━━━━━━━━━━━━━━━━━
💎 *Anual:*       R$ 250,00
   (R$ 120 de desconto)
━━━━━━━━━━━━━━━━━━━━

✅ Mais de 20.000 canais
✅ Filmes e séries em HD/4K
✅ Sem travamentos
✅ Suporte 24h

👉 Para contratar, fale com nosso *suporte humano*!`;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 FUNÇÕES DE DETECÇÃO AUTOMÁTICA DE PAGAMENTO 🔱
// ═══════════════════════════════════════════════════════════════════════════════

async function buscarPixQRCode(installmentId, tentativas = 5) {
    for (let i = 0; i < tentativas; i++) {
        try {
            const urlPayment = API_BASE_CIABRA + '/payments/applications/installments/' + installmentId;
            console.log('[' + (i + 1) + '/' + tentativas + '] Buscando PIX para installment: ' + installmentId);
            const response = await axios.get(urlPayment, { headers: { 'Authorization': CIABRA_AUTH, 'Content-Type': 'application/json' } });
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
            const response = await axios.get(urlInstallment, { headers: { 'Authorization': CIABRA_AUTH } });
            const data = response.data;
            if (data.pix && data.pix.status) {
                return data.pix.status;
            }
        }
        const urlInvoice = API_BASE_CIABRA + '/invoices/applications/invoices/' + invoiceId;
        const response = await axios.get(urlInvoice, { headers: { 'Authorization': CIABRA_AUTH } });
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

function logConversa(telefone, nome, de, texto, isSupportRequest = false) {
    const db = lerJSON(HISTORICO_FILE);
    if (!db[telefone]) {
        db[telefone] = { nome: nome || telefone, mensagens: [], emSuporte: false, lastUpdate: Date.now() };
    }
    if (nome) db[telefone].nome = nome;

    if (isSupportRequest) db[telefone].emSuporte = true;
    if (texto === 'SAIU_DO_SUPORTE') db[telefone].emSuporte = false;

    if (texto !== 'SAIU_DO_SUPORTE') {
        db[telefone].mensagens.push({ de: de, texto: texto, hora: moment().format('HH:mm') });
    }

    if (db[telefone].mensagens.length > 50) db[telefone].mensagens = db[telefone].mensagens.slice(-50);

    db[telefone].lastUpdate = Date.now();
    salvarJSON(HISTORICO_FILE, db);
}

// 📤 MOTOR DE ENVIO META API
async function enviarTexto(para, texto, isAtendente = false) {
    try {
        await axios.post(META_API_URL, {
            messaging_product: "whatsapp",
            to: para,
            type: "text",
            text: { body: texto }
        }, {
            headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
        });
        registrarMensagem();
        logConversa(para, null, isAtendente ? 'atendente' : 'bot', texto);
    } catch (e) {
        console.error("Erro texto:", e.response?.data || e.message);
    }
}

async function enviarBotoes(para, texto, botoes) {
    try {
        const buttons = botoes.map(b => ({ type: "reply", reply: { id: b.id, title: b.title } }));
        await axios.post(META_API_URL, {
            messaging_product: "whatsapp",
            to: para,
            type: "interactive",
            interactive: { type: "button", body: { text: texto }, action: { buttons: buttons } }
        }, {
            headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
        });
        registrarMensagem();
        logConversa(para, null, 'bot', `[BOTÕES]: ${texto}`);
    } catch (e) {
        console.error("Erro botões:", e.response?.data || e.message);
    }
}

async function enviarLista(para, texto, tituloBtn, secoes) {
    try {
        await axios.post(META_API_URL, {
            messaging_product: "whatsapp",
            to: para,
            type: "interactive",
            interactive: { type: "list", body: { text: texto }, action: { button: tituloBtn, sections: secoes } }
        }, {
            headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
        });
        registrarMensagem();
        logConversa(para, null, 'bot', `[LISTA]: ${texto}`);
    } catch (e) {
        console.error("Erro lista:", e.response?.data || e.message);
    }
}

function registrarMensagem() {
    const agora = Date.now();
    msgStats.porMinuto.push(agora);
    msgStats.porHora.push(agora);
    msgStats.total++;
}

// 🔄 SISTEMA DE VENCIMENTO (CORRIGIDO)
async function verificarVencimentos() {
    const clientes = lerJSON(CLIENTES_FILE);
    const agora = moment().utcOffset("-03:00");

    for (const telefone in clientes) {
        const cliente = clientes[telefone];
        if (!cliente.dataVencimento) continue;

        const vencimento = moment(cliente.dataVencimento).utcOffset("-03:00");
        const horasParaVencer = vencimento.diff(agora, 'hours');
        const minutosParaVencer = vencimento.diff(agora, 'minutes');

        if (minutosParaVencer <= 60 && minutosParaVencer > 55 && !cliente.aviso1h) {
            await enviarAvisoVencimento(telefone, cliente, '1 hora');
            cliente.aviso1h = true;
            salvarJSON(CLIENTES_FILE, clientes);
        }
        if (horasParaVencer <= 24 && horasParaVencer > 23 && !cliente.aviso24h) {
            await enviarAvisoVencimento(telefone, cliente, '24 horas');
            cliente.aviso24h = true;
            salvarJSON(CLIENTES_FILE, clientes);
        }
        if (horasParaVencer <= 0 && !cliente.avisoVencido) {
            await enviarAvisoVencido(telefone, cliente);
            cliente.avisoVencido = true;
            salvarJSON(CLIENTES_FILE, clientes);
        }
    }
}

async function enviarAvisoVencimento(telefone, cliente, tempo) {
    const msg = `Olá ${cliente.nome || 'Cliente'}! 👋

⏰ Passando para lembrar que seu plano *${cliente.plano || 'Premium'}* vence em *${tempo}*.

🔥 Renove agora com nosso suporte humano:

📲 wa.me/${SUPORTE_HUMANO_NUMERO}

Não fique sem seu entretenimento! 📺

Equipe HelpTV 🔱`;
    await enviarTexto(telefone, msg);
}

async function enviarAvisoVencido(telefone, cliente) {
    const msg = `Olá ${cliente.nome || 'Cliente'}! 👋

⚠️ Seu plano *${cliente.plano || 'Premium'}* venceu hoje.

😢 Sentimos sua falta! Renove agora com nosso suporte humano:

📲 wa.me/${SUPORTE_HUMANO_NUMERO}

Equipe HelpTV 🔱`;
    await enviarTexto(telefone, msg);
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
        const response = await axios.post(API_BASE_CIABRA + '/invoices/applications/invoices', payload, {
            headers: { 'Authorization': CIABRA_AUTH, 'Content-Type': 'application/json' }
        });
        const invoiceData = response.data;
        console.log('Invoice criado:', invoiceData.id);

        if (invoiceData.installments && invoiceData.installments[0]) {
            const installmentId = invoiceData.installments[0].id;
            console.log('Buscando installment ID:', installmentId);
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

setInterval(verificarVencimentos, 5 * 60 * 1000);
verificarVencimentos();

// MONITORAR EXPIRAÇÃO DOS TESTES (6 HORAS)
async function monitorarExpiracaoTestes() {
    const db_testes = lerJSON(TESTES_FILE);
    const agora = moment();

    for (const telefone in db_testes) {
        const teste = db_testes[telefone];
        if (!teste.expiracao) continue;

        const minutosParaExpirar = moment(teste.expiracao).diff(agora, 'minutes');

        if (minutosParaExpirar <= 60 && minutosParaExpirar > 55 && !teste.avisoEnviado) {
            await enviarTexto(telefone, `⏰ *AVISO:* Seu teste expira em *1 hora*!

👤 *Usuário:* ${teste.user}

🔥 Gostou da qualidade? Garanta seu plano agora com nosso suporte humano:

📲 wa.me/${SUPORTE_HUMANO_NUMERO}`);
            db_testes[telefone].avisoEnviado = true;
            salvarJSON(TESTES_FILE, db_testes);
        }
    }
}

setInterval(monitorarExpiracaoTestes, 60000);
monitorarExpiracaoTestes();

// 🔐 INTEGRAÇÃO PAINEL ZEUS - CORRIGIDA
async function obterSessao() {
    try {
        const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        const getLogin = await axios.get(`${PANEL_URL}/login`, { 
            headers: { 'User-Agent': agent },
            timeout: 10000
        });
        
        const cookies = getLogin.headers['set-cookie'] ? getLogin.headers['set-cookie'].map(c => c.split(';')[0]) : [];
        const csrfToken = getLogin.data.match(/name=['"]csrf['"] value=['"](.*?)['"]/)?.[1] || '';
        
        const form = new URLSearchParams({ 
            csrf: csrfToken, 
            username: USERNAME, 
            password: PASSWORD, 
            save: '1' 
        });
        
        await axios.post(`${PANEL_URL}/login`, form, {
            headers: { 
                'Cookie': cookies.join('; '), 
                'User-Agent': agent,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            maxRedirects: 0,
            validateStatus: s => s < 400,
            timeout: 10000
        });
        
        return cookies.join('; ');
    } catch (e) {
        console.error('Erro ao obter sessão:', e.message);
        return null;
    }
}

async function gerarTeste(para, appId = null) {
    const db = lerJSON(TESTES_FILE);
    
    // Verifica se já tem teste recente
    if (db[para]) {
        const expirado = moment().isAfter(moment(db[para].expiracao));
        if (!expirado) {
            // Teste ainda ativo
            const exp = moment(db[para].expiracao).format('DD/MM/YYYY HH:mm:ss');
            await enviarTexto(para, `✅ Você já possui um teste ativo!

👤 *Usuário:* ${db[para].user}
🔑 *Senha:* ${db[para].pass || '(Apenas usuário)'}
⏳ *Válido até:* ${exp}

Continue usando ou contrate um plano com nosso suporte!`);
            return null;
        }
        
        // Teste expirado, verifica se já passaram 14 dias
        const proximaData = moment(db[para].expiracao).add(14, 'days');
        if (moment().isBefore(proximaData)) {
            await enviarTexto(para, `Calma, calma amigão! kk 😂 Você já usou seu teste recentemente.

Infelizmente fornecemos apenas *um teste gratuito* por pessoa a cada 14 dias.

🚀 Se quiser continuar, contrate um plano com nosso suporte:
📲 wa.me/${SUPORTE_HUMANO_NUMERO}`);
            return null;
        }
    }

    const sessao = await obterSessao();
    if (!sessao) {
        await enviarTexto(para, "⚠️ Servidor temporariamente indisponível. Tente novamente em alguns minutos.");
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
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 15000
        });

        if (resCriar.data && resCriar.data.ajax && resCriar.data.ajax[0]) {
            const resDados = await axios.get(resCriar.data.ajax[0].action, {
                headers: { 
                    'Cookie': sessao, 
                    'X-Requested-With': 'XMLHttpRequest' 
                },
                timeout: 10000
            });
            
            const cleanText = resDados.data.html['#myModal']
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                .trim();

            let user = (cleanText.match(/usu[aá]rio:\s*([^\s\n]+)/i)?.[1] || '').replace(/\*/g, '').trim();
            let pass = (cleanText.match(/senha:\s*([^\s\n]+)/i)?.[1] || '').replace(/\*/g, '').trim();

            if (!user) {
                const lines = cleanText.split('\n');
                const userLine = lines.find(l => l.toLowerCase().includes('usu') || l.toLowerCase().includes('ário'));
                if (userLine) user = userLine.split(':')[1]?.replace(/\*/g, '').trim() || '';
            }

            if (!user) {
                throw new Error('Não foi possível extrair usuário');
            }

            const criacao = moment().utcOffset("-03:00").format();
            const exp = moment().utcOffset("-03:00").add(6, 'hours').format();
            
            db[para] = { 
                user, 
                pass: pass || user, // Usa o usuário como senha se não tiver senha
                expiracao: exp, 
                criacao: criacao 
            };
            salvarJSON(TESTES_FILE, db);
            
            return { user, pass: pass || user, exp, criacao };
        } else {
            throw new Error('Resposta inválida do painel');
        }
    } catch (e) {
        console.error('Erro ao gerar teste:', e.message);
        await enviarTexto(para, "⚠️ Erro ao gerar teste. Tente novamente em alguns minutos.");
        return null;
    }
}

function obterMensagemInicial(para, nome) {
    const trava = lerJSON(TRAVA_FILE);
    const agora = moment().utcOffset("-03:00");
    if (trava[para] && agora.diff(moment(trava[para]), 'days') < 14) {
        return "Olá! Selecione uma opção no menu:";
    }

    const saudacoes = [
        `Olá *${nome}*! Bem-vindo à Helptv. 😊`,
        `Oi *${nome}*! Tudo bem? Que bom ter você por aqui!`,
        `Fala *${nome}*! Como posso facilitar seu entretenimento hoje? 🚀`,
        `E aí *${nome}*! Preparado para o melhor do streaming?`
    ];

    trava[para] = agora.toISOString();
    salvarJSON(TRAVA_FILE, trava);
    return saudacoes[Math.floor(Math.random() * saudacoes.length)];
}

async function menuPrincipal(to, nome) {
    const textoTopo = obterMensagemInicial(to, nome);
    await enviarBotoes(to, `${textoTopo}\n\nEscolha uma das opções abaixo:`, [
        { id: "m_teste", title: "🎁 Teste Grátis" },
        { id: "m_planos", title: "💎 Ver Planos" },
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

async function menuAndroidSub(to) {
    await enviarLista(to, "OPÇÕES CELULAR ANDROID\n\nSelecione o aplicativo desejado:", "Escolher Aplicativo", [{
        title: "Aplicativos Android",
        rows: [
            { id: "sub_a_proprio", title: "App Próprio", description: "Recomendado para Celular" },
            { id: "sub_a_p2p", title: "P2P Americano", description: "Grade completa sem travas" },
            { id: "sub_a_xciptv", title: "XCIPTV", description: "Interface profissional" }
        ]
    }]);
}

async function menuTvBoxSub(to) {
    await enviarLista(to, "OPÇÕES TV BOX / TV ANDROID\n\nSelecione o método de instalação:", "Escolher Método", [{
        title: "Instalação na TV",
        rows: [
            { id: "sub_tv_proprio", title: "App Próprio", description: "Via Downloader ou NTDown" },
            { id: "sub_tv_p2p", title: "P2P Americano", description: "Ideal para conexões instáveis" },
            { id: "sub_tv_xciptv", title: "XCIPTV", description: "Download direto na Play Store" }
        ]
    }]);
}

async function menuSmartTvMarcas(to) {
    await enviarLista(to, "QUAL A MARCA DA SUA TV?\n\nSelecione para receber a instrução correta:", "Selecionar Marca", [{
        title: "Marcas Disponíveis",
        rows: [
            { id: "brand_samsung", title: "Samsung", description: "TVs Tizen" },
            { id: "brand_lg", title: "LG", description: "TVs WebOS" },
            { id: "brand_roku", title: "Roku", description: "Aparelhos ou TVs Roku" },
            { id: "brand_tvandroid", title: "TV Android", description: "TCL, Philips, Semp, Sony" },
            { id: "brand_others", title: "Outros", description: "Qualquer outro modelo" }
        ]
    }]);
}

// 🔄 WEBHOOK
app.post('/webhook', async (req, res) => {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    if (!changes || !changes.messages) return res.sendStatus(200);

    const msg = changes.messages[0];
    const from = msg.from;
    const nome = changes.contacts?.[0]?.profile?.name || "Cliente";
    let texto = (msg.text?.body || "").toLowerCase().trim();

    if (msg.type === 'image' && msg.image?.id) {
        try {
            const mediaUrl = await axios.get(`https://graph.facebook.com/v18.0/${msg.image.id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            });

            const imgResponse = await axios.get(mediaUrl.data.url, {
                headers: { Authorization: `Bearer ${TOKEN}` },
                responseType: 'arraybuffer'
            });

            const nomeArquivo = `${Date.now()}.jpg`;
            if (!fs.existsSync('./midias')) fs.mkdirSync('./midias');
            fs.writeFileSync(`./midias/${nomeArquivo}`, imgResponse.data);
            texto = `[IMAGEM:/midias/${nomeArquivo}]`;
        } catch (e) {
            console.log('Erro ao baixar imagem:', e.message);
            texto = '[IMAGEM não carregada]';
        }
    }

    const buttonId = msg.interactive?.button_reply?.id;
    const listId = msg.interactive?.list_reply?.id;

    const dbHist = lerJSON(HISTORICO_FILE);
    const estaEmSuporte = dbHist[from]?.emSuporte || false;
    logConversa(from, nome, 'cliente', texto || buttonId || listId || "[Mídia/Outro]", estaEmSuporte);

    if (!userState[from]) userState[from] = { step: 'INICIO' };
    const estado = userState[from];

    if (texto === '/reset') {
        const dbT = lerJSON(TESTES_FILE);
        delete dbT[from];
        salvarJSON(TESTES_FILE, dbT);

        const dbTr = lerJSON(TRAVA_FILE);
        delete dbTr[from];
        salvarJSON(TRAVA_FILE, dbTr);

        userState[from] = { step: 'INICIO' };
        logConversa(from, nome, 'sistema', 'SAIU_DO_SUPORTE');
        await enviarTexto(from, "🔄 SISTEMA REINICIADO!");
        return res.sendStatus(200);
    }

    // Renovação - redireciona para suporte humano
    if (texto === 'renovar' || buttonId === 'renovar_agora') {
        await enviarTexto(from, MSG_SUPORTE_HUMANO);
        return res.sendStatus(200);
    }

    if (estaEmSuporte) {
        if (texto === 'menu') {
            estado.step = 'MENU';
            logConversa(from, nome, 'sistema', 'SAIU_DO_SUPORTE');
            await menuPrincipal(from, nome);
            return res.sendStatus(200);
        }
        return res.sendStatus(200);
    }

    if (buttonId) {
        if (buttonId === 'm_teste') {
            await menuDispositivos(from);
        } else if (buttonId
