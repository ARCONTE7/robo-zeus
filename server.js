process.env.TZ = 'America/Sao_Paulo';
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const cors = require('cors');
const qs = require('querystring');

moment.locale('pt-br');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ═══════════════════════════════════════════════════════════════════════════════
 * 🔱 ROBÔ ZEUS PRO v12.0 - NOVO PAINEL 🔱
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ⚙️ CONFIGURAÇÕES META API
const TOKEN = "EAAUuGpEfQx4BQtYLc0drrtpUy3OeckAKEF7fqfjkkA0nTeypoNEiVo6ZCDihIsnnGZAwaZC4ueqZAlcoJS8DqjVHfARonfzKFf17SPWURuPE9CYkeOajgtk5Bnp61ognewIZCHeFebsV8Tdo8wEDtMWyZBlZCSZBXwlJ2JZBbJ8pUGohsKtOouZBn7jxWBWrdFIQZDZD";
const PHONE_ID = "905733172633398";
const VERIFY_TOKEN = "zeus_webhook_2026";
const PORT = process.env.PORT || 3000;
const META_API_URL = `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`;

// ⚙️ CONFIGURAÇÃO CIABRA (deixe vazio se não usar)
const API_BASE_CIABRA = "https://api.az.center";
const CIABRA_PUBLIC_KEY = "";
const CIABRA_SECRET_KEY = "";
const CIABRA_AUTH = CIABRA_PUBLIC_KEY && CIABRA_SECRET_KEY ? "Basic " + Buffer.from(`${CIABRA_PUBLIC_KEY}:${CIABRA_SECRET_KEY}`).toString('base64') : "";
const CLIENTE_FIXO_CIABRA = "";

// ⚙️ CONFIGURAÇÕES DO NOVO PAINEL
const PANEL_URL = "https://streaming.painelr.top";
const USERNAME = "netcaste";
const PASSWORD = "10203050";
const MEMBER_ID = ""; // Se precisar, preencha aqui

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
const SESSOES_FILE = './sessoes_painel.json';

const botStartTime = Math.floor(Date.now() / 1000);
const userState = {};
let msgStats = { porMinuto: [], porHora: [], total: 0 };

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

// 🛠️ FUNÇÕES UTILITÁRIAS
function lerJSON(caminho) {
    try {
        if (!fs.existsSync(caminho)) {
            fs.writeFileSync(caminho, JSON.stringify({}));
            return {};
        }
        const conteudo = fs.readFileSync(caminho, 'utf8');
        return conteudo && conteudo.trim() ? JSON.parse(conteudo) : {};
    } catch (e) {
        console.error(`Erro ao ler ${caminho}:`, e.message);
        return {};
    }
}

function salvarJSON(caminho, dados) {
    try {
        fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
    } catch (e) {
        console.error(`Erro ao salvar ${caminho}:`, e.message);
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
        db[telefone].mensagens.push({ de, texto, hora: moment().format('HH:mm') });
    }

    if (db[telefone].mensagens.length > 50) {
        db[telefone].mensagens = db[telefone].mensagens.slice(-50);
    }

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
        msgStats.total++;
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
            interactive: { type: "button", body: { text: texto }, action: { buttons } }
        }, {
            headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" }
        });
        msgStats.total++;
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
        msgStats.total++;
        logConversa(para, null, 'bot', `[LISTA]: ${texto}`);
    } catch (e) {
        console.error("Erro lista:", e.response?.data || e.message);
    }
}

// 🔐 INTEGRAÇÃO NOVO PAINEL - VERSÃO CORRIGIDA
async function obterSessao() {
    try {
        // Verifica se tem sessão válida salva
        const sessoes = lerJSON(SESSOES_FILE);
        if (sessoes.cookie && sessoes.expira > Date.now()) {
            console.log('✅ Usando sessão em cache');
            return sessoes.cookie;
        }

        console.log('🔄 Fazendo login no painel...');
        
        // Primeiro, pega a página de login para obter o token CSRF
        const loginPage = await axios.get(`${PANEL_URL}/login`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 15000
        });

        // Extrai cookies da página de login
        const cookies = loginPage.headers['set-cookie'] 
            ? loginPage.headers['set-cookie'].map(c => c.split(';')[0]).join('; ')
            : '';

        // Extrai o token CSRF do HTML
        const csrfMatch = loginPage.data.match(/<meta name="csrf-token" content="([^"]+)"/) || 
                         loginPage.data.match(/name="_token" value="([^"]+)"/) ||
                         loginPage.data.match(/csrf-token" content="([^"]+)"/);
        
        const csrfToken = csrfMatch ? csrfMatch[1] : '';

        console.log('🔑 CSRF Token obtido:', csrfToken ? 'Sim' : 'Não');

        // Prepara os dados do formulário
        const formData = new URLSearchParams();
        formData.append('_token', csrfToken);
        formData.append('username', USERNAME);
        formData.append('password', PASSWORD);
        formData.append('remember', 'on');

        // Faz a requisição de login
        const loginResponse = await axios.post(`${PANEL_URL}/login`, formData, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': PANEL_URL,
                'Referer': `${PANEL_URL}/login`,
                'Cookie': cookies
            },
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 400,
            timeout: 15000
        });

        // Extrai os cookies da sessão após o login
        let sessionCookies = '';
        if (loginResponse.headers['set-cookie']) {
            sessionCookies = loginResponse.headers['set-cookie']
                .map(c => c.split(';')[0])
                .join('; ');
        }

        if (!sessionCookies) {
            throw new Error('Não foi possível obter cookie de sessão');
        }

        console.log('✅ Login realizado com sucesso!');

        // Salva a sessão em cache por 1 hora
        sessoes.cookie = sessionCookies;
        sessoes.expira = Date.now() + (60 * 60 * 1000); // 1 hora
        salvarJSON(SESSOES_FILE, sessoes);

        return sessionCookies;

    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
        return null;
    }
}

async function gerarTeste(para, appId = null) {
    const db = lerJSON(TESTES_FILE);
    
    // Verifica se já tem teste recente
    if (db[para]) {
        const expirado = moment().isAfter(moment(db[para].expiracao));
        if (!expirado) {
            const exp = moment(db[para].expiracao).format('DD/MM/YYYY HH:mm:ss');
            await enviarTexto(para, `✅ Você já possui um teste ativo!

👤 *Usuário:* ${db[para].user}
🔑 *Senha:* ${db[para].pass}
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
        console.log('🔄 Gerando teste para:', para);

        // Tenta criar o teste via API
        const createResponse = await axios.post(`${PANEL_URL}/api/lines`, 
            qs.stringify({
                key: 't-basic',
                quick: '1',
                method: 'post',
                action: `${PANEL_URL}/api/lines`
            }), {
            headers: {
                'Cookie': sessao,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });

        console.log('Resposta criação:', createResponse.data);

        if (createResponse.data && createResponse.data.ajax && createResponse.data.ajax[0]) {
            // Obtém os dados da linha criada
            const lineDataResponse = await axios.get(createResponse.data.ajax[0].action, {
                headers: {
                    'Cookie': sessao,
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });

            console.log('Resposta dados:', lineDataResponse.data);

            // Extrai usuário e senha do HTML
            let user = '';
            let pass = '';
            
            if (lineDataResponse.data.html && lineDataResponse.data.html['#myModal']) {
                const html = lineDataResponse.data.html['#myModal'];
                
                // Tenta extrair com regex
                const userMatch = html.match(/usu[áa]rio:?\s*<\/?[^>]*>\s*([^<\n]+)/i) || 
                                 html.match(/username:?\s*<\/?[^>]*>\s*([^<\n]+)/i) ||
                                 html.match(/Usu[áa]rio[:\s]*([^\s<]+)/i);
                
                const passMatch = html.match(/senha:?\s*<\/?[^>]*>\s*([^<\n]+)/i) ||
                                 html.match(/password:?\s*<\/?[^>]*>\s*([^<\n]+)/i) ||
                                 html.match(/Senha[:\s]*([^\s<]+)/i);

                user = userMatch ? userMatch[1].replace(/<[^>]*>/g, '').trim() : '';
                pass = passMatch ? passMatch[1].replace(/<[^>]*>/g, '').trim() : '';

                // Limpa o texto
                user = user.replace(/\*/g, '').trim();
                pass = pass.replace(/\*/g, '').trim();
            }

            if (!user) {
                throw new Error('Não foi possível extrair usuário da resposta');
            }

            const criacao = moment().utcOffset("-03:00").format();
            const exp = moment().utcOffset("-03:00").add(6, 'hours').format();
            
            db[para] = { 
                user, 
                pass: pass || user,
                expiracao: exp, 
                criacao 
            };
            salvarJSON(TESTES_FILE, db);
            
            console.log('✅ Teste gerado:', { user, pass: pass || user });
            return { user, pass: pass || user, exp, criacao };
        } else {
            throw new Error('Resposta inválida do painel');
        }
    } catch (error) {
        console.error('❌ Erro ao gerar teste:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        // Tenta um método alternativo
        try {
            console.log('🔄 Tentando método alternativo...');
            
            // Tenta criar via POST simples
            const altResponse = await axios.post(`${PANEL_URL}/api/lines`, {
                key: 't-basic',
                quick: '1',
                method: 'post',
                action: `${PANEL_URL}/api/lines`
            }, {
                headers: {
                    'Cookie': sessao,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 15000
            });

            if (altResponse.data && altResponse.data.id) {
                const user = `teste_${Date.now().toString().slice(-6)}`;
                const pass = user;
                const criacao = moment().utcOffset("-03:00").format();
                const exp = moment().utcOffset("-03:00").add(6, 'hours').format();
                
                db[para] = { user, pass, expiracao: exp, criacao };
                salvarJSON(TESTES_FILE, db);
                
                console.log('✅ Teste gerado (método alternativo):', { user, pass });
                return { user, pass, exp, criacao };
            }
        } catch (altError) {
            console.error('❌ Método alternativo também falhou:', altError.message);
        }
        
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

// 🔄 WEBHOOK PRINCIPAL
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0]?.value;
        if (!changes || !changes.messages) return res.sendStatus(200);

        const msg = changes.messages[0];
        const from = msg.from;
        const nome = changes.contacts?.[0]?.profile?.name || "Cliente";
        let texto = (msg.text?.body || "").toLowerCase().trim();

        // Processa imagem se houver
        if (msg.type === 'image' && msg.image?.id) {
            try {
                const mediaUrl = await axios.get(`https://graph.facebook.com/v18.0/${msg.image.id}`, {
                    headers: { Authorization: `Bearer ${TOKEN}` }
                });

                const imgResponse = await axios.get(mediaUrl.data.url, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                    responseType: 'arraybuffer'
                });

                if (!fs.existsSync('./midias')) fs.mkdirSync('./midias');
                const nomeArquivo = `${Date.now()}.jpg`;
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
        
        // Log da mensagem recebida
        logConversa(from, nome, 'cliente', texto || buttonId || listId || "[Mídia/Outro]", estaEmSuporte);

        if (!userState[from]) userState[from] = { step: 'INICIO' };
        const estado = userState[from];

        // Comando reset
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

        // Se estiver em modo suporte
        if (estaEmSuporte) {
            if (texto === 'menu') {
                estado.step = 'MENU';
                logConversa(from, nome, 'sistema', 'SAIU_DO_SUPORTE');
                await menuPrincipal(from, nome);
                return res.sendStatus(200);
            }
            return res.sendStatus(200);
        }

        // Processa botões
        if (buttonId) {
            if (buttonId === 'm_teste') {
                await menuDispositivos(from);
            } else if (buttonId === 'm_planos') {
                await enviarTexto(from, TABELA_PRECOS);
                await enviarTexto(from, MSG_SUPORTE_HUMANO);
            } else if (buttonId === 'm_suporte') {
                estado.step = 'AGUARDANDO_SUPORTE';
                logConversa(from, nome, 'cliente', 'Solicitou Suporte', true);
                await enviarTexto(from, MSG_SUPORTE_HUMANO);
            }
            return res.sendStatus(200);
        }

        // Processa listas
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

━━━━━━━━━━━━━━━━━━━━
👉 Digite MENU para voltar.`;
                    await enviarTexto(from, instrPC);
                }
            } else if (listId === 'd_smarttv') {
                await menuSmartTvMarcas(from);
            }

            // Processa sub-opções de Android/TV
            if (listId.startsWith('sub_a_') || listId.startsWith('sub_tv_')) {
                const isTV = listId.startsWith('sub_tv_');
                const type = listId.split('_')[2];
                const d = await gerarTeste(from);

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

                    await enviarTexto(from, `
