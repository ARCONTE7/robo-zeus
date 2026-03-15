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
const USERNAME = "acessonetcast";
const PASSWORD = "flamengo92!";
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
        } else if (buttonId === 'm_planos') {
            // Mostra tabela de preços e redireciona para suporte
            await enviarTexto(from, TABELA_PRECOS);
            await enviarTexto(from, MSG_SUPORTE_HUMANO);
        } else if (buttonId === 'm_suporte') {
            estado.step = 'AGUARDANDO_SUPORTE';
            logConversa(from, nome, 'cliente', 'Solicitou Suporte', true);
            await enviarTexto(from, MSG_SUPORTE_HUMANO);
        }
        return res.sendStatus(200);
    }

    if (listId) {
        if (listId === 'd_android') await menuAndroidSub(from);
        else if (listId === 'd_tvbox') await menuTvBoxSub(from);
        else if (listId === 'd_iphone') {
            const d = await gerarTeste(from);
            if (d) {
                const exp = moment(d.exp).format('DD/MM/YYYY HH:mm:ss');
                const instrIphone = `🎉 PARABÉNS! SEU TESTE IPHONE/IPAD FOI GERADO!

⏳ Duração: 6 horas (Válido até: ${exp})

📥 App Sugerido: VU IPTV PLAYER (Baixe na App Store)

📋 COMO CONFIGURAR:
Ao abrir o aplicativo, selecione "Add User" e preencha exatamente assim:

✨ Name: Helptv
🌐 URL: ${DNS_IPHONE}
👤 Username: ${d.user}
🔑 Password: ${d.pass}

━━━━━━━━━━━━━━━━━━━━
👉 Digite MENU para voltar.`;
                await enviarTexto(from, instrIphone);
            }
        } else if (listId === 'd_pc') {
            const d = await gerarTeste(from);
            if (d) {
                const exp = moment(d.exp).format('DD/MM/YYYY HH:mm:ss');
                const instrPC = `🎉 PARABÉNS! SEU TESTE PARA COMPUTADOR FOI GERADO!

⏳ Duração: 6 horas (Válido até: ${exp})

✨ OPÇÕES WEBPLAYER (Assista no navegador):
1º Opção: ${LINK_PC_WEB_1}
2º Opção: ${LINK_PC_WEB_2}

✨ APLICATIVOS PC/WINDOWS:
💻 SMARTERS PRO: ${LINK_PC_APP_1}
💻 STREAM PLAYER: ${LINK_PC_APP_2}

📋 DADOS DE LOGIN:
🌐 URL/DNS: ${DNS_PLAYER}
👤 Usuário: ${d.user}
🔑 Senha: ${d.pass}

💡 Dica: Use os mesmos dados acima para entrar em qualquer uma das opções citadas!

━━━━━━━━━━━━━━━━━━━━
👉 Digite MENU para voltar.`;
                await enviarTexto(from, instrPC);
            }
        } else if (listId === 'd_smarttv') {
            await menuSmartTvMarcas(from);
        }

        if (listId.startsWith('sub_a_') || listId.startsWith('sub_tv_')) {
            const isTV = listId.startsWith('sub_tv_');
            const type = listId.split('_')[2];
            const appId = type === 'p2p' ? '114' : null;
            const d = await gerarTeste(from, appId);

            if (d) {
                const exp = moment(d.exp).format('DD/MM/YYYY HH:mm:ss');
                let info = "";

                if (type === 'proprio') {
                    if (isTV) {
                        info = `📺 *PASSO A PASSO APP PRÓPRIO TV:*

1️⃣ Abra o aplicativo *Downloader* ou *NTDown* na sua TV.
2️⃣ Digite o código: *${PROPRIO_DOWNLOADER}* (Downloader) ou *${PROPRIO_NTDOWN}* (NTDown).
3️⃣ Baixe, instale e abra o aplicativo.

👤 *Usuário:* ${d.user}
🔑 *Senha:* ${d.pass}`;
                    } else {
                        info = `📥 *DOWNLOAD APP PRÓPRIO:* ${LINK_APP_PROPRIO}
📦 *Código Downloader:* ${PROPRIO_DOWNLOADER}

👤 *Usuário:* ${d.user}
🔑 *Senha:* ${d.pass}`;
                    }
                } else if (type === 'p2p') {
                    if (isTV) {
                        info = `🚀 *PASSO A PASSO P2P AMERICANO TV:*

1️⃣ Abra o aplicativo *Downloader* ou *NTDown* na sua TV.
2️⃣ Digite o código: *${P2P_DOWNLOADER}* (Downloader) ou *${P2P_NTDOWN}* (NTDown).
3️⃣ Instale e abra o aplicativo.

👤 *Usuário:* ${d.user}
💡 *Este app não precisa de senha, basta inserir apenas o usuário!*`;
                    } else {
                        info = `🚀 *P2P AMERICANO MOBILE*
📥 *Download:* ${LINK_P2P_DIRETO}
📦 *Código Downloader:* ${P2P_DOWNLOADER}

👤 *Usuário:* ${d.user}
💡 *Este app não precisa de senha.*`;
                    }
                } else if (type === 'xciptv') {
                    info = `🌐 *XCIPTV CONFIGURAÇÃO:*

1️⃣ Instale o *XCIPTV PLAYER* direto na loja oficial do seu aparelho (Play Store).
2️⃣ Abra o aplicativo e insira os dados abaixo:

🌐 *Server URL:* ${DNS_PLAYER}
👤 *Usuário:* ${d.user}
🔑 *Senha:* ${d.pass}`;
                }

                await enviarTexto(from, `🎉 PARABÉNS! TESTE GERADO COM SUCESSO!

⏳ Duração: 6 horas (Válido até: ${exp})

${info}

━━━━━━━━━━━━━━━━━━━━
👉 Digite MENU para voltar.`);
            }
        }

        if (listId.startsWith('brand_')) {
            const brand = listId.split('_')[1];
            if (brand === 'tvandroid') {
                await menuTvBoxSub(from);
            } else if (brand === 'others') {
                const d = await gerarTeste(from);
                if (d) {
                    const expFormat = moment(d.exp).format('DD/MM/YYYY HH:mm:ss');
                    const criacaoFormat = moment(d.criacao).format('DD/MM/YYYY HH:mm:ss');
                    const completao = `✨ *Bem vindo a Streaming Plus* ✨

*VALIDADE*
*Data de validade:* ${expFormat}
*Data de criação:* ${criacaoFormat}
-----------------------------------------------------------
✨ *Lista1:*
http://assistz.top/get.php?username=${d.user}&password=${d.pass}&type=m3u_plus&output=ts

✨ *Lista2:*
${DNS_PLAYER}/get.php?username=${d.user}&password=${d.pass}&type=m3u_plus&output=hls

✨ *Lista3:*
http://techsuporte.xyz/get.php?username=${d.user}&password=${d.pass}&type=m3u_plus&output=ts

✨ *Link SSIPTV:* https://streaming.appm.live/s/${d.user}/${d.pass}/download_m3u/
-----------------------------------------------------------
✨*3 APLICATIVOS PARCEIROS*

✨ APLICATIVO XCLOUDTV
Disponível: LG, Samsung e ROKU
✨ *Provedor:* zeus10
✨ Usuário: ${d.user}
✨ Senha: ${d.pass}
-----------------------------------------------------------
✨ APLICATIVO EASY PLAYER
Disponível: LG, Samsung e ROKU
✨ URL PARA ATIVAÇÃO
✨ http://appez.top
✨ Usuário: ${d.user}
✨ Senha: ${d.pass}
-----------------------------------------------------------
✨ APLICATIVO HD PLAYER
Disponível: LG, Samsung e ROKU
✨ Código: 654
✨ Usuário: ${d.user}
✨ Senha: ${d.pass}
-----------------------------------------------------------
✨ APLICATIVOS PARA SISTEMAS ANDROID

✨ STREAMING PLUS IPTV
Link direto: https://dl.ntdev.in/69313
Código NTDOWN: 69313
Código DOWNLOADER: 112138
-----------------------------------------------------------
✨ *Android App Zeus* ${LINK_APP_PROPRIO}
*NTDOWN* (${PROPRIO_NTDOWN})
*DONWLOADER* (${PROPRIO_DOWNLOADER})
-----------------------------------------------------------
✨ *WebPlayer*
_1º Opção:_ ${LINK_PC_WEB_1}
_2º Opção:_ ${LINK_PC_WEB_2}

✨ APLICATIVOS PC/WINDOWS
✨ SMARTERS PRO: ${LINK_PC_APP_1}
✨ STREAM PLAYER: ${LINK_PC_APP_2}
-----------------------------------------------------------
✨ *XCIPTV*
✨ ${DNS_PLAYER}
✨ Usuário: ${d.user}
✨ Senha: ${d.pass}
-----------------------------------------------------------
✨ *_IPTV Smarters Player_*
Primeira opção Seu nome
✨ Usuário: ${d.user}
✨ Senha: ${d.pass}
✨ ${DNS_IPHONE}
-----------------------------------------------------------
*DNS*
SMART UP e SMART STB
PRINCIPAL: 45.140.193.116
ALTERNATIVAS:
» DNS 1: 209.14.2.198
» DNS 2: 51.222.156.94
-----------------------------------------------------------`;
                    await enviarTexto(from, completao);
                }
            } else {
                const d = await gerarTeste(from);
                if (d) {
                    const exp = moment(d.exp).format('DD/MM/YYYY HH:mm:ss');
                    const msgUnificada = `🎉 TESTE SMART TV GERADO!

⏳ Duração: 6 horas (Válido até: ${exp})

✨ APLICATIVO XCLOUDTV
Disponível: LG, Samsung e ROKU
👉 Provider: zeus10
👤 Usuário: ${d.user}
🔑 Senha: ${d.pass}
--------------------------
✨ APLICATIVO EASY PLAYER
Disponível: LG, Samsung e ROKU
👉 URL PARA ATIVAÇÃO: http://appez.top
👤 Usuário: ${d.user}
🔑 Senha: ${d.pass}
--------------------------
✨ APLICATIVO HD PLAYER
Disponível: LG, Samsung e ROKU
👉 Código: 654
👤 Usuário: ${d.user}
🔑 Senha: ${d.pass}
--------------------------
🌟 DICA DE OURO: Esse mesmo usuário e senha funciona em todos os aplicativos citados acima. O que muda é apenas o campo de entrada no aplicativo escolhido!

━━━━━━━━━━━━━━━━━━━━
👉 Digite MENU para voltar.`;
                    await enviarTexto(from, msgUnificada);
                }
            }
        }

        // Qualquer fluxo de plano - mostra tabela e redireciona
        if (listId.startsWith('plano_')) {
            await enviarTexto(from, TABELA_PRECOS);
            await enviarTexto(from, MSG_SUPORTE_HUMANO);
            return res.sendStatus(200);
        }

        return res.sendStatus(200);
    }

    if (texto === 'menu' || estado.step === 'INICIO') {
        estado.step = 'MENU';
        await menuPrincipal(from, nome);
    }
    res.sendStatus(200);
});

// ══════════════════════════════════════════════════════════════════════════════
// 🎨 PAINEL DE MONITORAMENTO
// ══════════════════════════════════════════════════════════════════════════════

const PAINEL_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zeus Web</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        ::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        ::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.2); }
        ::-webkit-scrollbar-track { background: hsla(0,0%,100%,0.1); }

        :root {
            --zap-bg: #d1d7db;
            --zap-header: #f0f2f5;
            --zap-sidebar: #ffffff;
            --zap-chat-bg: #efeae2;
            --zap-primary: #00a884;
            --zap-incoming: #ffffff;
            --zap-outgoing: #d9fdd3;
            --zap-border: #e9edef;
            --zap-text-main: #111b21;
            --zap-text-sec: #8696a0;
        }

        body { background-color: var(--zap-bg); height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }

        .app-container {
            width: 100%; height: 100%;
            max-width: 1600px;
            background-color: var(--zap-sidebar);
            display: flex;
            box-shadow: 0 17px 50px 0 rgba(0,0,0,.19), 0 12px 15px 0 rgba(0,0,0,.24);
            overflow: hidden;
        }
        @media (min-width: 1441px) { .app-container { height: 95vh; width: 97%; top: 19px; border-radius: 3px; } }

        .sidebar {
            width: 400px;
            max-width: 450px;
            display: flex; flex-direction: column;
            border-right: 1px solid var(--zap-border);
            background: var(--zap-sidebar);
        }

        .header {
            height: 59px; background: var(--zap-header); padding: 10px 16px;
            display: flex; align-items: center; justify-content: space-between;
            border-bottom: 1px solid var(--zap-border);
        }

        .user-nav { display: flex; align-items: center; gap: 15px; }
        .my-avatar { width: 40px; height: 40px; border-radius: 50%; background-color: var(--zap-primary); display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; }

        .filters {
            display: flex; gap: 10px; padding: 8px 12px; background: var(--zap-sidebar); border-bottom: 1px solid var(--zap-border);
        }
        .filter-btn {
            flex: 1; padding: 6px; border: none; background: var(--zap-header); border-radius: 24px;
            font-size: 13px; color: var(--zap-text-sec); cursor: pointer; transition: 0.2s;
        }
        .filter-btn:hover { background: #e9edef; }
        .filter-btn.active { background: #e7f8f5; color: var(--zap-primary); font-weight: 600; }

        .contact-list { flex: 1; overflow-y: auto; background: var(--zap-sidebar); }

        .contact-item {
            height: 72px; display: flex; align-items: center; padding: 0 15px; cursor: pointer;
            border-bottom: 1px solid var(--zap-border); transition: background .2s;
        }
        .contact-item:hover { background-color: #f5f6f6; }
        .contact-item.active { background-color: #f0f2f5; }

        .avatar-wrapper { position: relative; margin-right: 15px; }
        .c-avatar { width: 49px; height: 49px; border-radius: 50%; background: #dfe5e7; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; }
        .c-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }

        .c-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
        .c-name { font-size: 17px; color: var(--zap-text-main); font-weight: 400; }
        .c-time { font-size: 12px; color: var(--zap-text-sec); }

        .c-preview { font-size: 14px; color: var(--zap-text-sec); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; }
        .status-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 5px; font-weight: bold; }

        .chat-area {
            flex: 1; display: flex; flex-direction: column; background-color: var(--zap-chat-bg); position: relative;
        }
        .chat-area::before {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
            opacity: 0.4; pointer-events: none;
        }

        .chat-header {
            height: 59px; background: var(--zap-header); padding: 0 16px;
            display: flex; align-items: center; border-bottom: 1px solid var(--zap-border); z-index: 10;
        }
        .chat-header-info { display: flex; flex-direction: column; margin-left: 15px; cursor: pointer; }
        .chat-title { font-size: 16px; color: var(--zap-text-main); font-weight: 500; }
        .chat-status { font-size: 13px; color: var(--zap-text-sec); }

        .messages-container {
            flex: 1; padding: 20px 60px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; z-index: 1;
        }

        .msg {
            max-width: 65%; padding: 6px 7px 8px 9px; border-radius: 7.5px;
            font-size: 14.2px; line-height: 19px; position: relative;
            box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); word-wrap: break-word;
        }

        .msg-in {
            align-self: flex-start; background: var(--zap-incoming);
            border-top-left-radius: 0;
        }
        .msg-in::before {
            content: ""; position: absolute; top: 0; left: -8px; width: 0; height: 0;
            border: 8px solid transparent; border-top-color: var(--zap-incoming); border-right-color: var(--zap-incoming);
        }

        .msg-out {
            align-self: flex-end; background: var(--zap-outgoing);
            border-top-right-radius: 0;
        }
        .msg-out::before {
            content: ""; position: absolute; top: 0; right: -8px; width: 0; height: 0;
            border: 8px solid transparent; border-top-color: var(--zap-outgoing); border-left-color: var(--zap-outgoing);
        }

        .msg-log {
            align-self: center !important; background: #e9edef !important; box-shadow: none !important;
            font-size: 12px !important; color: #54656f !important; border-radius: 8px !important;
            max-width: 90% !important; text-align: center; padding: 5px 12px;
        }
        .msg-log::before { display: none !important; }

        .msg-meta { font-size: 11px; color: rgba(0,0,0,0.45); float: right; margin-top: 4px; margin-left: 10px; }

        .chat-footer {
            min-height: 62px; background: var(--zap-header); padding: 5px 16px;
            display: flex; align-items: center; gap: 10px; z-index: 10;
        }
        .input-box {
            flex: 1; background: white; border-radius: 8px; padding: 9px 12px;
            border: 1px solid white; display: flex; align-items: center;
        }
        .input-box input { width: 100%; border: none; outline: none; font-size: 15px; }
        .btn-send { background: none; border: none; font-size: 24px; color: var(--zap-text-sec); cursor: pointer; }
        .btn-send:hover { color: var(--zap-primary); }

        .welcome-screen {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 100%; background: var(--zap-header); border-bottom: 6px solid #25d366; z-index: 20;
        }
        .welcome-text h1 { color: #41525d; font-weight: 300; margin-top: 20px; }

        .btn-back { display: none; font-size: 20px; color: var(--zap-text-sec); margin-right: 15px; cursor: pointer; }
        @media (max-width: 900px) {
            .sidebar { width: 100%; max-width: none; }
            .chat-area { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 100; }
            .chat-area.active { display: flex; }
            .btn-back { display: block; }
            .messages-container { padding: 20px 5%; }
        }

        .pulse-red { animation: pulse 1.5s infinite; color: #ea0038; margin-left: 5px; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    </style>
</head>
<body>

<div class="app-container">
    <div class="sidebar">
        <div class="header">
            <div class="user-nav">
                <div class="my-avatar"><i class="fa-solid fa-robot"></i></div>
                <h3 style="color: #54656f; font-size: 16px;">Zeus Command</h3>
            </div>
            <div style="font-size: 12px; color: #54656f; text-align: right;">
                <div id="sys-status" style="color: #00a884; font-weight: bold;">● Online</div>
                <div id="last-update" style="font-size: 10px;">...</div>
            </div>
        </div>

        <div class="filters">
            <button class="filter-btn active" onclick="filtrar('todos', this)">Todas</button>
            <button class="filter-btn" onclick="filtrar('suporte', this)">⚠️ Suporte</button>
        </div>

        <div class="contact-list" id="listaContatos"></div>
    </div>

    <div class="chat-area" id="areaChat">
        <div class="welcome-screen" id="welcome">
            <i class="fa-brands fa-whatsapp" style="font-size: 80px; color: #d1d7db;"></i>
            <div class="welcome-text">
                <h1>Zeus Web</h1>
                <p style="color: #667781; margin-top: 15px; text-align: center;">Envie e receba mensagens sem desconectar seu robô.<br>Use o painel para monitorar em tempo real.</p>
            </div>
        </div>

        <div style="display:none; flex-direction:column; height:100%;" id="chatReal">
            <div class="chat-header">
                <i class="fa-solid fa-arrow-left btn-back" onclick="fecharChat()"></i>
                <div class="c-avatar" style="width: 40px; height: 40px; margin-right: 15px;"><i class="fa-solid fa-user"></i></div>
                <div class="chat-header-info">
                    <div class="chat-title" id="chatNome">Nome do Cliente</div>
                    <div class="chat-status" id="chatTel">...</div>
                </div>
            </div>

            <div class="messages-container" id="msgsContainer"></div>

            <div class="chat-footer">
                <div class="input-box">
                    <input type="text" id="inputMsg" placeholder="Digite uma mensagem..." onkeypress="if(event.key==='Enter') enviar()">
                </div>
                <button class="btn-send" onclick="enviar()"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
</div>

<script>
    let db = {};
    let chatAtual = null;
    let filtroAtual = 'todos';

    async function atualizar() {
        try {
            const res = await fetch('/api/tudo');
            const data = await res.json();

            if (JSON.stringify(db) !== JSON.stringify(data.conversas)) {
                db = data.conversas;
                document.getElementById('last-update').innerText = 'Sync: ' + data.status;
                renderizarLista();
                if (chatAtual && db[chatAtual]) renderizarMsgs(chatAtual);
            }
        } catch (e) { console.log(e); }
    }

    function renderizarLista() {
        const lista = document.getElementById('listaContatos');
        const ordenados = Object.keys(db).sort((a, b) => db[b].lastUpdate - db[a].lastUpdate);

        let html = '';
        ordenados.forEach(tel => {
            const c = db[tel];
            if (filtroAtual === 'suporte' && !c.emSuporte) return;

            const ult = c.mensagens[c.mensagens.length - 1] || { texto: '', hora: '' };
            const active = chatAtual === tel ? 'active' : '';

            let prevText = ult.texto;
            if (prevText.includes('[LISTA]') || prevText.includes('[BOTÕES]')) prevText = "🤖 Interação do Robô";
            if (prevText.length > 35) prevText = prevText.substring(0, 35) + '...';

            const suporteBadge = c.emSuporte ? '<i class="fa-solid fa-circle-exclamation pulse-red"></i>' : '';

            html += \`
                <div class="contact-item \${active}" onclick="abrir('\${tel}')">
                    <div class="avatar-wrapper">
                        <div class="c-avatar"><i class="fa-solid fa-user"></i></div>
                    </div>
                    <div class="c-info">
                        <div class="c-top">
                            <span class="c-name">\${c.nome} \${suporteBadge}</span>
                            <span class="c-time">\${ult.hora}</span>
                        </div>
                        <div class="c-preview">
                            \${ult.de === 'atendente' ? '<i class="fa-solid fa-check" style="color:#53bdeb; margin-right:4px;"></i>' : ''}
                            \${prevText}
                        </div>
                    </div>
                </div>
            \`;
        });

        lista.innerHTML = html;
    }

    function abrir(tel) {
        chatAtual = tel;
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('chatReal').style.display = 'flex';
        document.getElementById('areaChat').classList.add('active');

        const c = db[tel];
        document.getElementById('chatNome').innerText = c.nome;
        document.getElementById('chatTel').innerText = c.emSuporte ? '⚠️ Aguardando Suporte' : 'Online no Robô';
        document.getElementById('chatTel').style.color = c.emSuporte ? '#ea0038' : '#8696a0';

        renderizarMsgs(tel);
        renderizarLista();
    }

    function fecharChat() {
        chatAtual = null;
        document.getElementById('areaChat').classList.remove('active');
        document.getElementById('chatReal').style.display = 'none';
        document.getElementById('welcome').style.display = 'flex';
        renderizarLista();
    }

    function renderizarMsgs(tel) {
        const div = document.getElementById('msgsContainer');
        const msgs = db[tel].mensagens || [];

        let html = '';
        msgs.forEach(m => {
            let classe = 'msg-in';
            if (m.de === 'atendente') classe = 'msg-out';

            if (m.de === 'bot' && (m.texto.includes('[LISTA]') || m.texto.includes('[BOTÕES]'))) {
                html += \`
                    <div class="msg msg-log">
                        🤖 Enviou Menu/Botões para o cliente
                        <span class="msg-meta">\${m.hora}</span>
                    </div>
                \`;
            } else {
                if (m.de === 'bot') classe = 'msg-out';
                let style = (m.de === 'bot') ? 'font-style: italic; opacity: 0.9;' : '';

                html += \`
                    <div class="msg \${classe}" style="\${style}">
                        \${m.texto.replace(/\\n/g, '<br>')}
                        <span class="msg-meta">\${m.hora}</span>
                    </div>
                \`;
            }
        });

        if (div.innerHTML.length !== html.length) {
            div.innerHTML = html;
            div.scrollTop = div.scrollHeight;
        }
    }

    async function enviar() {
        const inp = document.getElementById('inputMsg');
        const txt = inp.value.trim();
        if (!txt || !chatAtual) return;

        inp.value = '';
        db[chatAtual].mensagens.push({ de: 'atendente', texto: txt, hora: '..' });
        renderizarMsgs(chatAtual);

        await fetch('/api/responder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: chatAtual, msg: txt })
        });
    }

    function filtrar(tipo, btn) {
        filtroAtual = tipo;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderizarLista();
    }

    setInterval(atualizar, 2000);
    atualizar();
</script>
</body>
</html>`;

// ROTA DO PAINEL
app.get('/suporte', (req, res) => {
    res.send(PAINEL_HTML);
});

// Cria pasta midias se não existir
if (!fs.existsSync('./midias')) fs.mkdirSync('./midias');

app.use('/midias', express.static(__dirname + '/midias'));

app.get('/monitor', (req, res) => {
    res.sendFile(__dirname + '/monitor.html');
});

// APIs
app.get('/api/tudo', (req, res) => {
    const conversas = lerJSON(HISTORICO_FILE);
    const lastActivity = moment().format('HH:mm:ss');
    res.json({ status: lastActivity, conversas: conversas });
});

app.post('/api/responder', async (req, res) => {
    const { to, msg } = req.body;
    await enviarTexto(to, `*Suporte:* ${msg}`, true);
    res.sendStatus(200);
});

// Outras Rotas
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

app.get('/manifest.json', (req, res) => {
    res.json({ name: "Zeus Monitor", display: "standalone" });
});

app.listen(PORT, () => console.log(`\n🔱 ZEUS PRO v11.0 - ONLINE NA PORTA ${PORT} 🛡️`));
