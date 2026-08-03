/* Safer admin render: build DOM instead of innerHTML concatenation */
function renderAdminConversas(todasConversas) {
    var container = document.getElementById('conversas-list');
    if (!container) return;

    var ids = Object.keys(todasConversas || {});
    ids.sort(function(a, b) {
        return new Date(todasConversas[b].ultimaAtividade || todasConversas[b].inicio) -
               new Date(todasConversas[a].ultimaAtividade || todasConversas[a].inicio);
    });

    if (ids.length === 0) {
        container.textContent = '';
        var empty = document.createElement('div');
        empty.className = 'empty-state';
        var ic = document.createElement('i'); ic.className = 'ph ph-chat-circle-dots';
        var p = document.createElement('p'); p.textContent = 'Nenhuma conversa registrada ainda.';
        empty.appendChild(ic); empty.appendChild(p);
        container.appendChild(empty);
        return;
    }

    container.textContent = '';
    ids.forEach(function(id) {
        var c = todasConversas[id];
        var ultimaMsg = c.mensagens.length > 0 ? (c.mensagens[c.mensagens.length - 1].msg || '').substring(0, 80) : 'Sem mensagens';
        var data = new Date(c.ultimaAtividade || c.inicio);
        var statusClass = c.status || 'nova';
        var statusLabel = statusClass === 'nova' ? 'Nova' : statusClass === 'lida' ? 'Lida' : 'Arquivada';
        var origemIcon = c.origem === 'contato' ? 'ph-envelope-fill' : 'ph-chat-circle-fill';

        var card = document.createElement('div'); card.className = 'conversa-card';

        var header = document.createElement('div'); header.className = 'conversa-header';
        header.addEventListener('click', function(){ toggleDetalhes(id); });

        var meta = document.createElement('div'); meta.className = 'conversa-meta';
        var iconWrap = document.createElement('div'); iconWrap.className = 'conversa-icon';
        var iEl = document.createElement('i'); iEl.className = 'ph ' + origemIcon; iconWrap.appendChild(iEl);

        var info = document.createElement('div'); info.className = 'conversa-info';
        var h3 = document.createElement('h3'); h3.textContent = (c.origem === 'contato' ? 'Formulario de Contato' : 'Chatbot') + ' - ' + id.substring(5,15);
        var span = document.createElement('span'); span.textContent = data.toLocaleString('pt-BR') + ' · ' + (c.mensagens.length || 0) + ' msgs';
        info.appendChild(h3); info.appendChild(span);

        meta.appendChild(iconWrap); meta.appendChild(info);

        var status = document.createElement('span'); status.className = 'conversa-status ' + statusClass; status.textContent = statusLabel;

        header.appendChild(meta); header.appendChild(status);

        var detalhes = document.createElement('div'); detalhes.className = 'conversa-detalhes'; detalhes.id = 'detalhes-' + id;
        var msgs = document.createElement('div'); msgs.className = 'conversa-mensagens'; msgs.id = 'msgs-' + id;

        c.mensagens.forEach(function(m){
            var div = document.createElement('div'); div.className = 'msg-item ' + (m.tipo || '');
            var time = m.hora ? new Date(m.hora).toLocaleTimeString('pt-BR') : '';
            var textNode = document.createElement('div'); textNode.textContent = m.msg || '';
            var timeNode = document.createElement('div'); timeNode.className = 'msg-time'; timeNode.textContent = time;
            div.appendChild(textNode); div.appendChild(timeNode);
            msgs.appendChild(div);
        });

        var actions = document.createElement('div'); actions.className = 'conversa-actions';
        var btnRead = document.createElement('button'); btnRead.className = 'mark-read'; btnRead.textContent = 'Marcar como Lida'; btnRead.addEventListener('click', function(e){ e.stopPropagation(); marcarLida(id); });
        var btnArch = document.createElement('button'); btnArch.textContent = 'Arquivar'; btnArch.addEventListener('click', function(e){ e.stopPropagation(); arquivar(id); });
        var btnDel = document.createElement('button'); btnDel.className = 'delete'; btnDel.textContent = 'Excluir'; btnDel.addEventListener('click', function(e){ e.stopPropagation(); excluir(id); });
        actions.appendChild(btnRead); actions.appendChild(btnArch); actions.appendChild(btnDel);

        detalhes.appendChild(msgs); detalhes.appendChild(actions);
        card.appendChild(header); card.appendChild(detalhes);
        container.appendChild(card);
    });
}

