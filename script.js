/* ===== COOKIE CONSENT — safer DOM-based implementation (overrides previous functions) ===== */
function initCookieConsentSafe() {
    try {
        if (localStorage.getItem('cookies-aceitos') === 'true') return;
        if (localStorage.getItem('cookies-recusados') === 'true') return;
        if (document.getElementById('cookie-consent')) return;

        var banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.id = 'cookie-consent';

        var inner = document.createElement('div'); inner.className = 'cookie-inner';
        var text = document.createElement('div'); text.className = 'cookie-text';

        var icon = document.createElement('i'); icon.className = 'ph ph-cookie-fill'; icon.style.cssText = 'font-size:24px;color:var(--teal);margin-right:8px;vertical-align:middle;';
        var info = document.createElement('div');
        var strong = document.createElement('strong'); strong.style.display = 'block'; strong.style.marginBottom = '4px'; strong.textContent = 'Este site utiliza cookies';
        var span = document.createElement('span'); span.style.fontSize = '12px'; span.style.opacity = '0.8';
        span.innerHTML = 'Cookies são usados para melhorar sua experiência, analisar tráfego e personalizar conteúdo. Consulte nossa <a href="politica-privacidade.html" style="color:var(--cyan);text-decoration:underline;">Política de Privacidade</a> para mais detalhes conforme a LGPD.';

        info.appendChild(strong); info.appendChild(span);
        text.appendChild(icon); text.appendChild(info);

        var actions = document.createElement('div'); actions.className = 'cookie-actions';

        var btnDecline = document.createElement('button'); btnDecline.className = 'cookie-btn cookie-btn-decline'; btnDecline.type = 'button'; btnDecline.textContent = 'Recusar';
        btnDecline.addEventListener('click', function(){ recusarCookies(); });

        var btnConfig = document.createElement('button'); btnConfig.className = 'cookie-btn cookie-btn-config'; btnConfig.type = 'button'; btnConfig.textContent = 'Configurar';
        btnConfig.addEventListener('click', function(){ abrirConfigCookies(); });

        var btnAccept = document.createElement('button'); btnAccept.className = 'cookie-btn cookie-btn-accept'; btnAccept.type = 'button'; btnAccept.textContent = 'Aceitar Todos';
        btnAccept.addEventListener('click', function(){ aceitarCookies(); });

        actions.appendChild(btnDecline); actions.appendChild(btnConfig); actions.appendChild(btnAccept);

        inner.appendChild(text); inner.appendChild(actions);
        banner.appendChild(inner);
        document.body.appendChild(banner);
        setTimeout(function(){ banner.classList.add('show'); }, 1500);
    } catch(e) { console.warn('initCookieConsentSafe error', e); }
}

function abrirConfigCookiesSafe() {
    try {
        if (document.getElementById('cookie-modal')) return;
        fecharCookieBanner();
        var tipos = {necessarios:true,analiticos:false,marketing:false};
        try { tipos = JSON.parse(localStorage.getItem('cookies-tipos')) || tipos; } catch(e) {}

        var overlay = document.createElement('div'); overlay.className = 'cookie-modal-overlay'; overlay.id = 'cookie-modal';
        var modal = document.createElement('div'); modal.className = 'cookie-modal';

        var h3 = document.createElement('h3');
        var h3icon = document.createElement('i'); h3icon.className = 'ph ph-gear-six-fill'; h3icon.style.color = 'var(--teal)'; h3icon.style.marginRight = '8px';
        h3.appendChild(h3icon); h3.appendChild(document.createTextNode('Configuração de Cookies'));

        var p = document.createElement('p'); p.textContent = 'Escolha quais tipos de cookies você deseja aceitar. Cookies necessários são essenciais para o funcionamento do site e não podem ser desativados.';

        modal.appendChild(h3); modal.appendChild(p);

        function makeOption(labelHtml, tipo, disabled) {
            var opt = document.createElement('div'); opt.className = 'cookie-option';
            var info = document.createElement('div'); info.className = 'cookie-option-info';
            var title = document.createElement('h4'); title.innerHTML = labelHtml;
            var desc = document.createElement('span'); desc.textContent = (tipo === 'necessarios') ? 'Funcionalidade básica do site' : (tipo === 'analiticos' ? 'Ajuda a entender como o site é usado' : 'Publicidade personalizada');
            info.appendChild(title); info.appendChild(desc);
            var toggle = document.createElement('div'); toggle.className = 'toggle' + (tipos[tipo] ? ' active' : '');
            toggle.dataset.tipo = tipo;
            if (disabled) { toggle.classList.add('disabled'); toggle.title = 'Sempre ativo'; }
            else {
                toggle.addEventListener('click', function(){ toggle.classList.toggle('active'); });
            }
            opt.appendChild(info); opt.appendChild(toggle);
            return opt;
        }

        modal.appendChild(makeOption('<i class="ph ph-shield-check-fill" style="color:var(--teal);margin-right:6px;"></i>Necessários','necessarios', true));
        modal.appendChild(makeOption('<i class="ph ph-chart-line-up-fill" style="color:var(--accent-blue);margin-right:6px;"></i>Analíticos','analiticos', false));
        modal.appendChild(makeOption('<i class="ph ph-megaphone-fill" style="color:var(--accent-orange);margin-right:6px;"></i>Marketing','marketing', false));

        var actions = document.createElement('div'); actions.className = 'cookie-modal-actions';
        var btnCancel = document.createElement('button'); btnCancel.className = 'cookie-btn cookie-btn-decline'; btnCancel.type = 'button'; btnCancel.style.flex = '1'; btnCancel.style.justifyContent = 'center'; btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', function(){ fecharConfigCookies(); });
        var btnSave = document.createElement('button'); btnSave.className = 'btn-primary'; btnSave.type = 'button'; btnSave.style.flex = '1'; btnSave.style.justifyContent = 'center'; btnSave.textContent = 'Salvar Preferências';
        btnSave.addEventListener('click', function(){
            // read toggles
            var toggles = modal.querySelectorAll('.toggle[data-tipo]');
            var tiposNew = {necessarios:true,analiticos:false,marketing:false};
            toggles.forEach(function(t){ tiposNew[t.dataset.tipo] = t.classList.contains('active'); });
            configurarCookies(true, tiposNew);
        });

        actions.appendChild(btnCancel); actions.appendChild(btnSave);
        modal.appendChild(actions);

        overlay.appendChild(modal);
        overlay.addEventListener('click', function(e){ if (e.target === overlay) fecharConfigCookies(); });
        document.body.appendChild(overlay);
        setTimeout(function(){ overlay.classList.add('show'); }, 50);
    } catch(e) { console.warn('abrirConfigCookiesSafe error', e); }
}

function fecharConfigCookiesSafe() {
    var m = document.getElementById('cookie-modal');
    if (m) { m.classList.remove('show'); setTimeout(function(){ m.remove(); }, 300); }
}

// Override older implementations by reassigning globals
window.initCookieConsent = initCookieConsentSafe;
window.abrirConfigCookies = abrirConfigCookiesSafe;
window.fecharConfigCookies = fecharConfigCookiesSafe;
window.aceitarCookies = function(){ configurarCookies(true, {necessarios:true,analiticos:true,marketing:true}); };
window.recusarCookies = function(){ configurarCookies(false, {necessarios:true,analiticos:false,marketing:false}); };
window.salvarConfigCookies = function(){
    // fallback: read toggles if modal open
    var toggles = document.querySelectorAll('#cookie-modal .toggle[data-tipo]');
    var tipos = {necessarios:true,analiticos:false,marketing:false};
    toggles.forEach(function(t){ tipos[t.dataset.tipo] = t.classList.contains('active'); });
    configurarCookies(true, tipos);
};

