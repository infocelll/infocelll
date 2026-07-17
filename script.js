/* ============================================
   INFOCELLL — Script Premium 2026 (Otimizado)
   ============================================ */
(function() {
    'use strict';

    /* ===== CONSTANTS ===== */
    var WHATSAPP_PHONE = '5581987332162';
    var WHATSAPP_BASE = 'https://wa.me/' + WHATSAPP_PHONE + '?text=';

    /* ===== DOM CACHE ===== */
    var dom = {};
    function cacheDom() {
        dom.header = document.querySelector('.header');
        dom.chatPanel = document.getElementById('chatbot-panel');
        dom.chatMessages = document.getElementById('chat-messages');
        dom.chatInput = document.getElementById('chat-input');
        dom.mobileNav = document.getElementById('mobile-nav');
        dom.cookieConsent = document.getElementById('cookie-consent');
        dom.orcBrand = document.getElementById('orc-brand');
        dom.orcService = document.getElementById('orc-service');
        dom.orcModel = document.getElementById('orc-model');
        dom.orcResult = document.getElementById('orcamento-result');
        dom.modelList = document.getElementById('model-list');
        dom.photoPreview = document.getElementById('photo-preview');
        dom.themeBtns = document.querySelectorAll('.theme-toggle-btn');
    }

    /* ===== DARK MODE ===== */
    function toggleDarkMode() {
        var isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        atualizarIconesDarkMode(isDark);
    }

    function aplicarTemaInicial() {
        var savedTheme = localStorage.getItem('theme');
        var isDark = savedTheme === 'dark';
        if (savedTheme === null) {
            isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        document.body.classList.toggle('dark-mode', isDark);
        atualizarIconesDarkMode(isDark);
    }

    function atualizarIconesDarkMode(isDark) {
        var btns = dom.themeBtns || document.querySelectorAll('.theme-toggle-btn');
        var sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        var moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        btns.forEach(function(btn) {
            btn.innerHTML = isDark ? sunSvg : moonSvg;
        });
    }

    /* ===== SIMULADOR DE ORCAMENTO ===== */
    var databaseModelos = {
        Samsung: ["Galaxy S24 Ultra", "Galaxy S23", "Galaxy A55", "Galaxy M34", "Galaxy Note 20", "Galaxy S21 FE", "Galaxy A34"],
        Apple: ["iPhone 15 Pro Max", "iPhone 14 Pro", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone XR", "iPhone 8 Plus"],
        Xiaomi: ["Redmi Note 13", "Poco X6 Pro", "Xiaomi 14", "Redmi 12C", "Poco F5", "Redmi Note 12"],
        Motorola: ["Moto G84", "Edge 40", "Moto G54", "Moto G34", "Moto G73", "Moto G24"],
        LG: ["K52", "K62", "Velvet", "K41S"],
        Outra: ["Outro Aparelho"]
    };

    var databasePrecos = {
        "Troca de Tela": { min: 250, max: 1200, tempo: "1 a 2 horas" },
        "Troca de Bateria": { min: 120, max: 450, tempo: "1 hora" },
        "Diagnóstico": { min: 0, max: 0, tempo: "30 minutos a 2 horas" },
        "Limpeza de Câmera": { min: 80, max: 180, tempo: "1 hora" },
        "Formatação": { min: 70, max: 150, tempo: "1 hora" },
        "Outro": { min: 100, max: 500, tempo: "Sob consulta" }
    };

    function atualizarModelos() {
        if (!dom.orcBrand || !dom.modelList) return;
        var brand = dom.orcBrand.value;
        dom.modelList.innerHTML = '';
        if (brand && databaseModelos[brand]) {
            var frag = document.createDocumentFragment();
            databaseModelos[brand].forEach(function(modelo) {
                var opt = document.createElement('option');
                opt.value = modelo;
                frag.appendChild(opt);
            });
            dom.modelList.appendChild(frag);
        }
        calcularEstimativa();
    }

    function calcularEstimativa() {
        if (!dom.orcService || !dom.orcResult) return;
        var service = dom.orcService.value;
        if (service && databasePrecos[service]) {
            var info = databasePrecos[service];
            var priceText = info.min === 0 ? "Grátis (Diagnóstico sem custo)" : "R$ " + info.min + " a R$ " + info.max;
            dom.orcResult.innerHTML =
                '<div class="orcamento-result-title">Estimativa do Serviço</div>' +
                '<div class="orcamento-result-price">' + priceText + '</div>' +
                '<div class="orcamento-result-time">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                    'Tempo médio: ' + info.tempo +
                '</div>';
            dom.orcResult.style.display = 'block';
        } else {
            dom.orcResult.style.display = 'none';
        }
    }

    /* ===== HEADER SCROLL ===== */
    function initHeaderScroll() {
        if (!dom.header) return;
        window.addEventListener('scroll', function() {
            dom.header.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    function initMagneticCursor() {
        var btns = document.querySelectorAll('.btn-primary, .nav-cta');
        btns.forEach(function(btn) {
            btn.addEventListener('mousemove', function(e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });
            btn.addEventListener('mouseleave', function() {
                btn.style.transform = '';
            });
        });
    }

    /* ===== MOBILE NAV ===== */
    function abrirMobileNav() {
        if (dom.mobileNav) dom.mobileNav.classList.add('aberto');
        document.body.style.overflow = 'hidden';
    }

    function fecharMobileNav() {
        if (dom.mobileNav) dom.mobileNav.classList.remove('aberto');
        document.body.style.overflow = '';
    }

    /* ===== WHATSAPP HELPER ===== */
    function abrirWhatsApp(textoMsg) {
        window.open(WHATSAPP_BASE + encodeURIComponent(textoMsg), '_blank');
    }

    /* ===== CHATBOT INTELIGENTE ===== */
    var chatAberto = false;
    var chatHistorico = [];
    var salvarTimer = null;

    function toggleChat() {
        chatAberto = !chatAberto;
        if (!dom.chatPanel) return;
        if (chatAberto) {
            dom.chatPanel.classList.add('aberto');
            if (chatHistorico.length === 0) {
                setTimeout(function() {
                    addChatMsg('Olá! Sou o assistente da Infocelll. Em que posso ajudar?', 'bot');
                    addSugestoes([
                        '📱 Problema no celular',
                        '💻 Manutenção PC/Notebook',
                        '💰 Quanto custa?',
                        '📍 Onde fica?',
                        '⏰ Horário de funcionamento',
                        '📞 Falar no WhatsApp'
                    ]);
                }, 400);
            }
        } else {
            dom.chatPanel.classList.remove('aberto');
        }
    }

    function scrollChatToBottom() {
        requestAnimationFrame(function() {
            if (dom.chatMessages) dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
        });
    }

    function addChatMsg(text, type, isHTML) {
        if (!dom.chatMessages) return;
        var div = document.createElement('div');
        div.className = 'chat-msg ' + type;
        if (isHTML) {
            div.innerHTML = text;
        } else {
            div.textContent = text;
        }
        dom.chatMessages.appendChild(div);
        scrollChatToBottom();
    }

    function addSugestoes(opcoes) {
        if (!dom.chatMessages) return;
        var wrap = document.createElement('div');
        wrap.className = 'chat-sugestoes';
        opcoes.forEach(function(txt) {
            var btn = document.createElement('button');
            btn.className = 'chat-sugestao-btn';
            btn.textContent = txt;
            btn.addEventListener('click', function() {
                wrap.remove();
                enviarMensagem(txt);
            }, { once: true });
            wrap.appendChild(btn);
        });
        dom.chatMessages.appendChild(wrap);
        scrollChatToBottom();
    }

    function addBotaoWhatsApp(textoMsg) {
        if (!dom.chatMessages) return;
        var wrap = document.createElement('div');
        wrap.className = 'chat-whatsapp-btn-wrap';
        var url = WHATSAPP_BASE + encodeURIComponent(textoMsg);
        wrap.innerHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="chat-whatsapp-direct">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.856L0 24l6.336-1.65A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.92 0-3.72-.516-5.276-1.412l-.376-.224-3.908 1.02 1.044-3.81-.246-.39A9.79 9.79 0 012.18 12c0-5.418 4.402-9.82 9.82-9.82S21.82 6.582 21.82 12s-4.402 9.82-9.82 9.82z"/></svg>' +
            'Falar no WhatsApp</a>';
        dom.chatMessages.appendChild(wrap);
        scrollChatToBottom();
    }

    function mostrarDigitando() {
        if (!dom.chatMessages) return;
        var div = document.createElement('div');
        div.className = 'chat-msg bot typing';
        div.id = 'chat-typing-indicator';
        div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        dom.chatMessages.appendChild(div);
        scrollChatToBottom();
    }

    function removerDigitando() {
        var indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();
    }

    function enviarMensagem(msg) {
        if (!msg) return;
        addChatMsg(msg, 'user');
        chatHistorico.push({ tipo: 'user', msg: msg, hora: new Date().toISOString() });
        processarMensagem(msg);
    }

    function enviarMsg() {
        if (!dom.chatInput) return;
        var msg = dom.chatInput.value.trim();
        if (!msg) return;
        dom.chatInput.value = '';
        enviarMensagem(msg);
    }

    function processarMensagem(msg) {
        mostrarDigitando();
        var delay = 600 + Math.random() * 800;
        setTimeout(function() {
            removerDigitando();
            var resp = getBotResponse(msg);
            addChatMsg(resp.texto, 'bot', true);
            chatHistorico.push({ tipo: 'bot', msg: resp.texto, hora: new Date().toISOString() });

            if (resp.sugestoes) {
                setTimeout(function() { addSugestoes(resp.sugestoes); }, 300);
            }
            if (resp.whatsapp) {
                setTimeout(function() { addBotaoWhatsApp(resp.whatsapp); }, 400);
            }
            agendarSalvarConversa();
        }, delay);
    }

    /* ===== SALVAR CONVERSAS (DEBOUNCED) ===== */
    function agendarSalvarConversa() {
        if (salvarTimer) return;
        salvarTimer = setTimeout(function() {
            salvarTimer = null;
            salvarConversa('chatbot');
        }, 3000);
    }

    function salvarConversa(origem) {
        var sessaoId = sessionStorage.getItem('chat-session-id');
        if (!sessaoId) {
            sessaoId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
            sessionStorage.setItem('chat-session-id', sessaoId);
        }
        try {
            var conversas = JSON.parse(localStorage.getItem('infocelll_conversas') || '{}');
            if (!conversas[sessaoId]) {
                conversas[sessaoId] = {
                    id: sessaoId,
                    origem: origem,
                    inicio: new Date().toISOString(),
                    mensagens: [],
                    status: 'nova'
                };
            }
            conversas[sessaoId].mensagens = chatHistorico;
            conversas[sessaoId].ultimaAtividade = new Date().toISOString();
            var chaves = Object.keys(conversas);
            if (chaves.length > 50) {
                chaves.sort(function(a, b) {
                    return (conversas[a].ultimaAtividade || '').localeCompare(conversas[b].ultimaAtividade || '');
                });
                for (var i = 0; i < chaves.length - 50; i++) {
                    delete conversas[chaves[i]];
                }
            }
            localStorage.setItem('infocelll_conversas', JSON.stringify(conversas));
        } catch(e) {
            console.warn('Falha ao salvar conversa:', e);
        }
        notificarInteracao(origem);
    }

    /* ===== NOTIFICACOES DO NAVEGADOR ===== */
    var notificacaoHabilitada = false;
    var notifListenerAdded = false;

    function pedirPermissaoNotificacao() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            notificacaoHabilitada = true;
            return;
        }
        if (Notification.permission === 'denied') return;
        if (notifListenerAdded) return;
        notifListenerAdded = true;
        document.addEventListener('click', function notifClick() {
            if (sessionStorage.getItem('notif-pedido') === 'true') {
                document.removeEventListener('click', notifClick);
                return;
            }
            if (Notification.permission !== 'default') {
                document.removeEventListener('click', notifClick);
                return;
            }
            sessionStorage.setItem('notif-pedido', 'true');
            Notification.requestPermission().then(function(p) {
                notificacaoHabilitada = (p === 'granted');
            });
            document.removeEventListener('click', notifClick);
        }, { once: false });
    }

    function notificarInteracao(origem) {
        if (!notificacaoHabilitada) return;
        var titulo = origem === 'contato' ? 'Nova mensagem de contato!' : 'Nova conversa no chatbot!';
        var body = origem === 'contato'
            ? 'Um cliente enviou mensagem pelo formulário de contato.'
            : 'Um cliente está conversando com o chatbot.';
        try {
            new Notification(titulo, { body: body, icon: 'logo.png', tag: 'infocelll-' + origem });
        } catch(e) {}
    }

    /* ===== IA PATTERN MATCHING ===== */
    var padroesIA = [
        { keywords: ['caiu', 'drop', 'qued', 'batida', 'bater'], diagnostico: 'Dano Físico por Queda/Batida', riscos: 'Tela interna, placa, câmera, bateria', solucao: 'Diagnóstico completo para verificar danos internos. Valor depende do componente afetado.' },
        { keywords: ['lent', 'trav', 'congel', 'freeze', 'engasg', 'gargal'], diagnostico: 'Lentidão / Travamento', riscos: 'Perda de dados, desgaste de hardware', solucao: 'Formatação com backup (R$ 70-150), limpeza de cache, ou upgrade de hardware.' },
        { keywords: ['tela', 'display', 'lcd', 'oled', 'amole'], diagnostico: 'Problema na Tela', riscos: 'Perda total de visibilidade, dano à placa se não tratar', solucao: 'Troca de tela original ou compatível. R$ 250 a R$ 1.200 dependendo do modelo.' },
        { keywords: ['bateria', 'battery', 'carga', 'carreg', 'energ'], diagnostico: 'Problema de Bateria/Carga', riscos: 'Desligamento imprevisível, risco de inchamento', solucao: 'Teste de bateria, troca se necessário. R$ 120 a R$ 450.' },
        { keywords: ['camera', 'foto', 'film', 'lente', 'blur'], diagnostico: 'Problema na Câmera', riscos: 'Perda de funcionalidade de registro', solucao: 'Limpeza (R$ 80-180) ou troca do módulo (depende do modelo).' },
        { keywords: ['agua', 'molh', 'submerso', 'liquido', 'ping'], diagnostico: 'Dano por Líquidos', riscos: 'Curto-circuito, oxidação, perda total do aparelho', solucao: 'URGENTE: desligar imediatamente e trazer em até 24h. Diagnóstico prioritário.' },
        { keywords: ['desbloq', 'senha', 'patron', 'bloque', 'esqueci'], diagnostico: 'Aparelho Bloqueado', riscos: 'Perda de acesso ao dispositivo', solucao: 'Infelizmente não realizamos desbloqueio. Recomendamos procurar a assistência autorizada da marca.' },
        { keywords: ['som', 'audio', 'microfone', 'altofalante', 'speaker'], diagnostico: 'Problema de Áudio', riscos: 'Impossibilidade de chamadas/reprodução', solucao: 'Limpeza ou troca de componente de áudio. Diagnóstico gratuito.' },
        { keywords: ['wifi', 'sinal', 'internet', 'conect', 'rede'], diagnostico: 'Problema de Conectividade', riscos: 'Perda de comunicação', solucao: 'Diagnóstico de antena/rede. Pode ser hardware ou software.' },
        { keywords: ['virus', 'malware', 'pop-up', 'anuncio', 'infect'], diagnostico: 'Infecção por Malware', riscos: 'Roubo de dados, lentidão, danos ao sistema', solucao: 'Limpeza completa + proteção. R$ 100-250.' },
        { keywords: ['touch', 'toc', 'respon', 'sensib'], diagnostico: 'Problema no Touchscreen', riscos: 'Impossibilidade de uso normal', solucao: 'Calibração ou troca da tela/touch. R$ 150 a R$ 800.' },
        { keywords: ['placa', 'solda', 'componente', 'chip', 'circuito'], diagnostico: 'Reparo em Placas', riscos: 'Reparo complexo, pode não ser viável', solucao: 'Técnico especializado em micro-solda. Orçamento sob consulta.' }
    ];

    var keywordMap = {};
    padroesIA.forEach(function(p) {
        p.keywords.forEach(function(kw) { keywordMap[kw] = p; });
    });

    function detectarDiagnostico(m) {
        for (var kw in keywordMap) {
            if (m.includes(kw)) return keywordMap[kw];
        }
        return null;
    }

    /* ===== FUNCAO PRINCIPAL DO BOT ===== */
    function getBotResponse(msg) {
        var m = msg.toLowerCase();

        var diag = detectarDiagnostico(m);
        if (diag) {
            return {
                texto: '*Pré-Diagnóstico IA:* ' + diag.diagnostico + '\n\n' +
                    '*Possíveis causas:* ' + diag.riscos + '\n\n' +
                    '*Solução:* ' + diag.solucao + '\n\n' +
                    'Fale conosco pelo WhatsApp!',
                sugestoes: ['📱 Problema no celular', '💻 PC/Notebook', '📞 WhatsApp'],
                whatsapp: 'Olá! Preciso de um diagnóstico: ' + diag.diagnostico + '. ' + diag.solucao
            };
        }

        if (m.includes('whatsapp') || m.includes('direto')) {
            return {
                texto: 'Clique no botão abaixo para falar direto com nosso time!',
                sugestoes: ['Voltar ao início'],
                whatsapp: 'Olá! Vim pelo site da Infocelll e preciso de atendimento.'
            };
        }

        if (m.includes('preco') || m.includes('valor') || m.includes('quanto') || m.includes('custa') || m.includes('orcamento')) {
            return {
                texto: '*Tabela de Estimativas:*\n\n' +
                    '📱 Troca de Tela: R$ 250 a R$ 1.200\n' +
                    '🔋 Troca de Bateria: R$ 120 a R$ 450\n' +
                    '💻 Formatação PC: R$ 70 a R$ 150\n' +
                    '🔍 Diagnóstico: GRATUITO\n' +
                    '📷 Câmera: R$ 80 a R$ 300\n\n' +
                    'Para valor exato, nos chame no WhatsApp!',
                sugestoes: ['📱 Problema no celular', '💻 PC/Notebook', '📞 WhatsApp'],
                whatsapp: 'Olá! Gostaria de um orçamento para meu aparelho.'
            };
        }

        if (m.includes('horario') || m.includes('hora') || m.includes('funciona') || m.includes('abre')) {
            return {
                texto: '*Horário de Funcionamento:*\n\n' +
                    'Seg a Sex: 9h às 18h\n' +
                    'Sábado: 9h às 14h\n' +
                    'Domingo: Fechado\n\n' +
                    'Estamos no Jardim Atlântico, Olinda-PE.',
                sugestoes: ['📍 Como chegar', '📱 Serviços', '📞 WhatsApp'],
                whatsapp: null
            };
        }

        if (m.includes('endere') || m.includes('local') || m.includes('onde') || m.includes('mapa') || m.includes('chegar')) {
            return {
                texto: '*Nossa Localização:*\n\n' +
                    'Av. Fagundes Varela, 380\n' +
                    'Loja 11, Jardim Atlântico\n' +
                    'Olinda-PE - CEP 53140-080\n\n' +
                    '📍 Ao lado do quiosque da Cacau Show\n\n' +
                    'Tem mapa interativo aqui no site!',
                sugestoes: ['⏰ Horário', '📱 Serviços', '📞 Contato'],
                whatsapp: null
            };
        }

        if (m.includes('servico') || m.includes('reparo') || m.includes('conserto') || m.includes('fazem')) {
            return {
                texto: '*Nossos Serviços:*\n\n' +
                    '📱 *Celular:*\n- Troca de tela, bateria, câmera\n- Reparo em placas e solda\n- Remoção de vírus\n\n' +
                    '💻 *Informática:*\n- Formatação Windows\n- Limpeza interna\n- Upgrade SSD/RAM\n- Instalação de CFTV\n\n' +
                    '🛍️ *Loja:*\n- Peças e acessórios\n- Capas, películas, cabos',
                sugestoes: ['💰 Preços', '📞 WhatsApp', '📍 Como chegar'],
                whatsapp: null
            };
        }

        if (m.includes('garantia')) {
            return {
                texto: '*90 DIAS de Garantia!*\n\nCobrimos:\n✅ Peças utilizadas\n✅ Mão de obra\n✅ Qualquer defeito do reparo\n\nBasta trazer o comprovante.',
                sugestoes: ['📱 Serviços', '📞 WhatsApp', '📍 Como chegar'],
                whatsapp: null
            };
        }

        if (m.includes('obrigad') || m.includes('valeu') || m.includes('thanks') || m.includes('brigad')) {
            return {
                texto: 'De nada! Fico feliz em ajudar! 😊\nQualquer coisa, é só chamar.',
                sugestoes: ['Voltar ao início'],
                whatsapp: null
            };
        }

        if (m.includes('voltar') || m.includes('inicio') || m.includes('menu')) {
            return {
                texto: 'Como posso te ajudar?',
                sugestoes: ['📱 Problema no celular', '💻 PC/Notebook', '💰 Preços', '📞 WhatsApp'],
                whatsapp: null
            };
        }

        if (m.includes('ola') || m.includes('oi') || m.includes('bom dia') || m.includes('boa tarde') || m.includes('boa noite') || m.includes('eai')) {
            return {
                texto: 'Olá! Bem-vindo à Infocelll! 😊\n\nSou o assistente virtual. Posso te ajudar com:\n- Diagnóstico de problemas\n- Orçamentos\n- Informações da loja\n\nComo posso ajudar?',
                sugestoes: ['📱 Problema no celular', '💻 Manutenção PC', '💰 Preços', '📞 WhatsApp'],
                whatsapp: null
            };
        }

        return {
            texto: 'Entendi! Para atendimento personalizado, fale com nosso time:',
            sugestoes: ['📱 Problema no celular', '💰 Preços', '📞 WhatsApp'],
            whatsapp: 'Olá! Preciso de atendimento. ' + msg
        };
    }

    /* ===== SCROLL REVEAL ===== */
    function initReveal() {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right, .reveal-blur, .reveal-stagger').forEach(function(el) {
            observer.observe(el);
        });
    }

    /* ===== COUNTER ANIMATION (requestAnimationFrame) ===== */
    function animateCounters() {
        var counters = document.querySelectorAll('.stat-num');
        if (!counters.length) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-target'), 10);
                    if (isNaN(target)) return;
                    var suffix = el.getAttribute('data-suffix') || '';
                    var start = performance.now();
                    var duration = 1500;

                    function step(now) {
                        var progress = Math.min((now - start) / duration, 1);
                        el.textContent = Math.floor(progress * target) + suffix;
                        if (progress < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(c) { observer.observe(c); });
    }

    /* ===== FORM SUBMISSION ===== */
    function enviarContato(e) {
        e.preventDefault();
        var form = e.target;
        var name = form.querySelector('#nome').value;
        var email = form.querySelector('#email').value;
        var phone = form.querySelector('#telefone').value;
        var subject = form.querySelector('#assunto').value;
        var msg = form.querySelector('#mensagem').value;

        var text = 'Olá! Gostaria de entrar em contato.\n\n' +
            '*Nome:* ' + name + '\n' +
            '*E-mail:* ' + email + '\n' +
            '*Telefone:* ' + (phone || 'Não informado') + '\n' +
            '*Assunto:* ' + (subject || 'Não informado') + '\n' +
            '*Mensagem:* ' + msg;

        abrirWhatsApp(text);
    }

    function enviarOrcamento(e) {
        e.preventDefault();
        var form = e.target;
        var name = form.querySelector('[name="name"]').value;
        var phone = form.querySelector('[name="phone"]').value;
        var brand = form.querySelector('[name="brand"]').value;
        var model = form.querySelector('[name="model"]').value;
        var service = form.querySelector('[name="service"]').value;
        var problem = form.querySelector('[name="problem"]').value;

        var text = 'Olá! Fiz uma estimativa no simulador do site e gostaria de agendar meu reparo.\n\n' +
            '*Nome:* ' + name + '\n' +
            '*Telefone:* ' + phone + '\n' +
            '*Marca:* ' + brand + '\n' +
            '*Modelo:* ' + model + '\n' +
            '*Serviço:* ' + service + '\n' +
            '*Problema:* ' + problem;

        if (databasePrecos[service]) {
            var info = databasePrecos[service];
            text += info.min > 0
                ? '\n*Estimativa do Site:* R$ ' + info.min + ' a R$ ' + info.max
                : '\n*Estimativa do Site:* Diagnóstico Sem Custo';
        }

        abrirWhatsApp(text);
    }

    function previewPhotos(input) {
        if (!dom.photoPreview) return;
        dom.photoPreview.innerHTML = '';
        var files = input.files;
        for (var i = 0; i < files.length && i < 8; i++) {
            if (files[i].size > 5 * 1024 * 1024) continue;
            (function(index) {
                var img = document.createElement('img');
                img.src = URL.createObjectURL(files[index]);
                dom.photoPreview.appendChild(img);
            })(i);
        }
    }

    /* ===== COOKIE CONSENT (LGPD) ===== */
    function configurarCookies(aceitos, tipos) {
        localStorage.setItem(aceitos ? 'cookies-aceitos' : 'cookies-recusados', 'true');
        localStorage.setItem('cookies-tipos', JSON.stringify(tipos));
        fecharCookieBanner();
    }

    function aceitarCookies() {
        configurarCookies(true, {necessarios:true,analiticos:true,marketing:true});
    }

    function recusarCookies() {
        configurarCookies(false, {necessarios:true,analiticos:false,marketing:false});
    }

    function fecharCookieBanner() {
        var b = document.getElementById('cookie-consent');
        if (b) b.classList.remove('show');
    }

    function initCookieConsent() {
        if (localStorage.getItem('cookies-aceitos') === 'true') return;
        if (localStorage.getItem('cookies-recusados') === 'true') return;
        if (document.getElementById('cookie-consent')) return;
        var banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.id = 'cookie-consent';
        banner.innerHTML = '<div class="cookie-inner">' +
            '<div class="cookie-text">' +
                '<i class="ph ph-cookie-fill" style="font-size:24px;color:var(--teal);margin-right:8px;vertical-align:middle;"></i>' +
                '<div>' +
                    '<strong style="display:block;margin-bottom:4px;">Este site utiliza cookies</strong>' +
                    '<span style="font-size:12px;opacity:0.8;">Cookies são usados para melhorar sua experiência, analisar tráfego e personalizar conteúdo. ' +
                    'Consulte nossa <a href="politica-privacidade.html" style="color:var(--cyan);text-decoration:underline;">Política de Privacidade</a> para mais detalhes conforme a LGPD.</span>' +
                '</div>' +
            '</div>' +
            '<div class="cookie-actions">' +
                '<button class="cookie-btn cookie-btn-decline" onclick="recusarCookies()">Recusar</button>' +
                '<button class="cookie-btn cookie-btn-config" onclick="abrirConfigCookies()">Configurar</button>' +
                '<button class="cookie-btn cookie-btn-accept" onclick="aceitarCookies()">Aceitar Todos</button>' +
            '</div>' +
        '</div>';
        document.body.appendChild(banner);
        setTimeout(function() { banner.classList.add('show'); }, 1500);
    }

    function abrirConfigCookies() {
        if (document.getElementById('cookie-modal')) return;
        fecharCookieBanner();
        var tipos = {necessarios:true,analiticos:false,marketing:false};
        try { tipos = JSON.parse(localStorage.getItem('cookies-tipos')) || tipos; } catch(e) {}
        var overlay = document.createElement('div');
        overlay.className = 'cookie-modal-overlay';
        overlay.id = 'cookie-modal';
        overlay.innerHTML = '<div class="cookie-modal">' +
            '<h3><i class="ph ph-gear-six-fill" style="color:var(--teal);margin-right:8px;"></i>Configuração de Cookies</h3>' +
            '<p>Escolha quais tipos de cookies você deseja aceitar. Cookies necessários são essenciais para o funcionamento do site e não podem ser desativados.</p>' +
            '<div class="cookie-option">' +
                '<div class="cookie-option-info"><h4><i class="ph ph-shield-check-fill" style="color:var(--teal);margin-right:6px;"></i>Necessários</h4><span>Funcionalidade básica do site</span></div>' +
                '<div class="toggle active disabled" title="Sempre ativo"></div>' +
            '</div>' +
            '<div class="cookie-option">' +
                '<div class="cookie-option-info"><h4><i class="ph ph-chart-line-up-fill" style="color:var(--accent-blue);margin-right:6px;"></i>Analíticos</h4><span>Ajuda a entender como o site é usado</span></div>' +
                '<div class="toggle' + (tipos.analiticos ? ' active' : '') + '" onclick="this.classList.toggle(\'active\')" data-tipo="analiticos"></div>' +
            '</div>' +
            '<div class="cookie-option">' +
                '<div class="cookie-option-info"><h4><i class="ph ph-megaphone-fill" style="color:var(--accent-orange);margin-right:6px;"></i>Marketing</h4><span>Publicidade personalizada</span></div>' +
                '<div class="toggle' + (tipos.marketing ? ' active' : '') + '" onclick="this.classList.toggle(\'active\')" data-tipo="marketing"></div>' +
            '</div>' +
            '<div class="cookie-modal-actions">' +
                '<button class="cookie-btn cookie-btn-decline" onclick="fecharConfigCookies()" style="flex:1;justify-content:center;">Cancelar</button>' +
                '<button class="btn-primary" onclick="salvarConfigCookies()" style="flex:1;justify-content:center;">Salvar Preferências</button>' +
            '</div>' +
        '</div>';
        overlay.addEventListener('click', function(e) { if (e.target === overlay) fecharConfigCookies(); });
        document.body.appendChild(overlay);
        setTimeout(function() { overlay.classList.add('show'); }, 50);
    }

    function fecharConfigCookies() {
        var m = document.getElementById('cookie-modal');
        if (m) { m.classList.remove('show'); setTimeout(function(){ m.remove(); }, 300); }
    }

    function salvarConfigCookies() {
        var toggles = document.querySelectorAll('#cookie-modal .toggle[data-tipo]');
        var tipos = {necessarios:true,analiticos:false,marketing:false};
        toggles.forEach(function(t) {
            tipos[t.dataset.tipo] = t.classList.contains('active');
        });
        configurarCookies(true, tipos);
    }

    /* ===== EVENT DELEGATION: SMOOTH SCROLL ===== */
    function initSmoothScroll() {
        document.addEventListener('click', function(e) {
            var a = e.target.closest('a[href^="#"]');
            if (!a) return;
            var href = a.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                fecharMobileNav();
            }
        });
    }

    /* ===== GLOBAL FUNCTIONS (for inline onclick) ===== */
    window.toggleDarkMode = toggleDarkMode;
    window.toggleChat = toggleChat;
    window.enviarMsg = enviarMsg;
    window.enviarContato = enviarContato;
    window.enviarOrcamento = enviarOrcamento;
    window.previewPhotos = previewPhotos;
    window.aceitarCookies = aceitarCookies;
    window.recusarCookies = recusarCookies;
    window.abrirConfigCookies = abrirConfigCookies;
    window.fecharConfigCookies = fecharConfigCookies;
    window.salvarConfigCookies = salvarConfigCookies;
    window.abrirMobileNav = abrirMobileNav;
    window.fecharMobileNav = fecharMobileNav;

    /* ===== HERO 3D TILT (Phone + Laptop + Box) ===== */
    function initHeroTilt() {
        var visual = document.querySelector('.hero-visual');
        if (!visual) return;
        var devices = visual.querySelectorAll('.hero-phone, .hero-laptop-svg, .hero-box-svg');
        if (!devices.length) return;

        var maxTilt = 12;
        var rafId = null;

        function handleTilt(cx, cy) {
            devices.forEach(function(el) {
                var rect = el.getBoundingClientRect();
                var x = (cx - rect.left) / rect.width - 0.5;
                var y = (cy - rect.top) / rect.height - 0.5;
                var tiltY = Math.max(-maxTilt, Math.min(maxTilt, x * maxTilt));
                var tiltX = Math.max(-maxTilt, Math.min(maxTilt, -y * maxTilt));
                el.classList.add('tilt-active');
                el.style.transform = 'perspective(800px) rotateY(' + tiltY + 'deg) rotateX(' + tiltX + 'deg) scale(1.03) translateZ(10px)';
            });
        }

        function resetTilt() {
            devices.forEach(function(el) {
                el.classList.remove('tilt-active');
                el.style.transform = '';
            });
        }

        visual.addEventListener('mousemove', function(e) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(function() { handleTilt(e.clientX, e.clientY); });
        });

        visual.addEventListener('mouseleave', function() {
            if (rafId) cancelAnimationFrame(rafId);
            resetTilt();
        });

        visual.addEventListener('touchmove', function(e) {
            if (rafId) cancelAnimationFrame(rafId);
            var t = e.touches[0];
            rafId = requestAnimationFrame(function() { handleTilt(t.clientX, t.clientY); });
        }, { passive: true });

        visual.addEventListener('touchend', function() {
            if (rafId) cancelAnimationFrame(rafId);
            resetTilt();
        });
    }

    /* ===== INIT ===== */
    document.addEventListener('DOMContentLoaded', function() {
        cacheDom();
        aplicarTemaInicial();
        initReveal();
        initMagneticCursor();
        animateCounters();

        /* Register Service Worker */
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js').catch(function() {});
            });
        }
        initCookieConsent();
        pedirPermissaoNotificacao();
        initSmoothScroll();
        initHeaderScroll();
        initHeroTilt();

        if (dom.orcBrand) dom.orcBrand.addEventListener('change', atualizarModelos);
        if (dom.orcService) dom.orcService.addEventListener('change', calcularEstimativa);
        if (dom.orcModel) dom.orcModel.addEventListener('input', calcularEstimativa);
        if (dom.chatInput) {
            dom.chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') enviarMsg();
            });
        }
    });
})();