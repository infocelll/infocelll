function stopCamera(stream) {
  if (!stream) return;
  try {
    var tracks = typeof stream.getTracks === 'function' ? stream.getTracks() : (stream.getVideoTracks ? stream.getVideoTracks() : []);
    tracks.forEach(function(t){ try{ t.stop(); }catch(e){} });
  } catch (e) { console.warn('stopCamera error', e && e.message); }
}

// Replace risky innerHTML usage in previewPhotos
function previewPhotos(input) {
    var previewContainer = document.getElementById('photo-preview');
    if (!previewContainer) return;
    previewContainer.textContent = '';
    var files = input.files;
    for (var i = 0; i < files.length && i < 8; i++) {
        if (files[i].size > 5 * 1024 * 1024) continue;
        (function(index) {
            var img = document.createElement('img');
            img.src = URL.createObjectURL(files[index]);
            img.alt = 'Foto ' + (index+1);
            previewContainer.appendChild(img);
        })(i);
    }
}

// Safer renderizarArtigos variant (avoid innerHTML where possible)
function renderizarArtigosSafe(filtro) {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;
    grid.textContent = '';
    const filtrados = filtro === 'todos' ? artigos : artigos.filter(a => a.categoria === filtro);
    filtrados.forEach((art, i) => {
        const idx = artigos.indexOf(art);
        const card = document.createElement('article');
        card.className = 'article-card';
        card.setAttribute('data-categoria', art.categoria);

        const thumb = document.createElement('div');
        thumb.className = 'article-thumb';
        thumb.style.background = art.gradiente || '';
        const icon = document.createElement('i'); icon.className = 'ph ' + art.icone;
        thumb.appendChild(icon);

        const body = document.createElement('div'); body.className = 'article-body';
        const tag = document.createElement('span'); tag.className = 'article-tag ' + art.tagClass; tag.textContent = art.tagLabel;
        const h = document.createElement('h3'); h.textContent = art.titulo;
        const p = document.createElement('p'); p.className = 'excerpt'; p.textContent = art.resumo;

        const footer = document.createElement('div'); footer.className = 'article-footer';
        const meta = document.createElement('div'); meta.className = 'article-footer-meta';
        const spanDate = document.createElement('span'); spanDate.innerHTML = '<i class="ph ph-calendar"></i> ' + art.data; // small HTML for icon
        const spanTime = document.createElement('span'); spanTime.innerHTML = '<i class="ph ph-clock"></i> ' + art.tempo + ' de leitura';
        meta.appendChild(spanDate); meta.appendChild(spanTime);

        const link = document.createElement('a'); link.className = 'article-link'; link.href = '#'; link.setAttribute('role','button');
        link.addEventListener('click', function(e){ e.preventDefault(); abrirModal(idx); });
        link.textContent = 'Ler mais ';
        const ic = document.createElement('i'); ic.className = 'ph ph-arrow-right'; link.appendChild(ic);

        footer.appendChild(meta);
        footer.appendChild(link);

        body.appendChild(tag); body.appendChild(h); body.appendChild(p); body.appendChild(footer);
        card.appendChild(thumb); card.appendChild(body);
        grid.appendChild(card);
    });
}

// Safer abrirModal that avoids unsanitized innerHTML for content
function abrirModalSafe(idx) {
    const art = artigos[idx];
    const modal = document.getElementById('article-modal');
    document.getElementById('modal-thumb').style.background = art.gradiente;
    document.getElementById('modal-thumb').textContent = '';
    var icon = document.createElement('i'); icon.className = 'ph ' + art.icone; document.getElementById('modal-thumb').appendChild(icon);
    var modalTag = document.getElementById('modal-tag'); modalTag.className = 'article-tag ' + art.tagClass; modalTag.textContent = art.tagLabel;
    document.getElementById('modal-title').textContent = art.titulo;
    document.getElementById('modal-date').textContent = ' ' + art.data;
    document.getElementById('modal-readtime').textContent = ' ' + art.tempo + ' de leitura';
    // For modal text we may need rich content; sanitize or insert as text if not required HTML
    var modalText = document.getElementById('modal-text');
    modalText.textContent = art.conteudoCompleto.replace(/<[^>]*>?/gm, ''); // naive strip tags
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

