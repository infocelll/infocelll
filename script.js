/* Delegated handlers migration: attach safely to common controls and set button type where appropriate */
function attachDelegatedHandlers() {
  try {
    const mappings = [
      {selector:'.theme-toggle-btn', fn: (el)=>{ if (typeof toggleDarkMode==='function') toggleDarkMode(); }},
      {selector:'.hamburger', fn: (el)=>{ if (typeof abrirMobileNav==='function') abrirMobileNav(); }},
      {selector:'.mobile-nav-close', fn: (el)=>{ if (typeof fecharMobileNav==='function') fecharMobileNav(); }},
      {selector:'.modal-close', fn: (el)=>{ if (typeof fecharModal==='function') fecharModal(); }},
      {selector:'.service-option', fn: (el)=>{ if (typeof selectService==='function') selectService(el); }},
      {selector:'.coupon-copy-btn', fn: (el)=>{ try { var card = el.closest('.coupon-card'); var code = card ? (card.dataset.coupon || (card.querySelector('.coupon-code') && card.querySelector('.coupon-code').textContent.trim())) : null; if(!code) code = el.getAttribute('data-coupon') || (el.previousElementSibling && el.previousElementSibling.textContent.trim()); if (typeof copiarCupom==='function') copiarCupom(code||'', el); } catch(e){console.warn(e);} }},
      {selector:'.fid-reward-btn', fn: (el)=>{ try{ var parent = el.closest('.fid-reward'); var cost = parent ? (parent.dataset.cost || parent.getAttribute('data-cost')) : el.getAttribute('data-cost'); var title = parent ? (parent.querySelector('h4') && parent.querySelector('h4').textContent) : el.getAttribute('data-title') || ''; if (typeof redeemReward==='function') redeemReward(el, title || '', parseInt(cost)||0); }catch(e){console.warn(e);} }},
      {selector:'.filter-btn', fn: (el)=>{ try{ var val = el.getAttribute('data-filter') || el.dataset.filter || el.getAttribute('data-value'); if (typeof setFilter==='function') setFilter(el, val==='all'? 'all' : val); }catch(e){console.warn(e);} }},
      {selector:'.category-tab', fn: (el)=>{ try{ var cat = el.getAttribute('data-cat') || el.dataset.cat || (el.textContent && el.textContent.trim().toLowerCase()); if (typeof filtrarArtigos==='function') filtrarArtigos(cat, el); }catch(e){console.warn(e);} }},
      {selector:'.carousel-btn', fn: (el)=>{ try{ var dir = el.getAttribute('data-dir'); if(!dir) dir = el.querySelector('.ph.ph-caret-left') ? -1 : (el.querySelector('.ph.ph-caret-right')? 1 : 1); if (typeof moveCarousel==='function') moveCarousel(parseInt(dir)); }catch(e){console.warn(e);} }},
      {selector:'.carousel-dot', fn: (el)=>{ try{ var parent = el.parentNode; var idx = Array.prototype.indexOf.call(parent.children, el); if (typeof goToSlide==='function') goToSlide(idx); }catch(e){console.warn(e);} }},
      {selector:'.review-helpful', fn: (el)=>{ try{ var id = parseInt(el.getAttribute('data-id')||el.dataset.id); if (typeof toggleHelpful==='function') toggleHelpful(el, id); }catch(e){console.warn(e);} }},
      {selector:'.btn-wizard-next', fn: (el)=>{ try{ var step = el.getAttribute('data-step') || el.id && el.id.split('-').pop(); if(!step) step = 3; if (typeof goToStep==='function') goToStep(Number(step)); }catch(e){console.warn(e);} }},
      {selector:'.btn-wizard-back', fn: (el)=>{ try{ var step = el.getAttribute('data-step-back') || 1; if (typeof goToStep==='function') goToStep(Number(step)); }catch(e){console.warn(e);} }}
    ];

    // set button[type=button] for controls to avoid accidental submits
    mappings.forEach(function(m){
      document.querySelectorAll(m.selector).forEach(function(btn){
        try { if (btn.tagName.toLowerCase()==='button' && !btn.hasAttribute('type')) btn.type = 'button'; }catch(e){}
      });
    });

    // single delegated click listener
    document.addEventListener('click', function(e){
      try{
        for(var i=0;i<mappings.length;i++){
          var m = mappings[i];
          var el = e.target.closest(m.selector);
          if(el){ m.fn(el); e.stopPropagation(); e.preventDefault(); return; }
        }

        // modal overlay generic behavior: close modal if overlay clicked
        var overlay = e.target.closest('.modal-overlay');
        if(overlay && overlay === document.getElementById('article-modal')){
          if (e.target === overlay){ if (typeof fecharModal==='function') fecharModal(); }
        }

      }catch(err){ console.warn('delegate error', err); }
    }, true);

    // attach escape to close modals if not already
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { try{ if(typeof fecharModal==='function') fecharModal(); }catch(_){} } });

  } catch(e) { console.warn('attachDelegatedHandlers error', e); }
}

document.addEventListener('DOMContentLoaded', function(){
  try{ if (typeof initCookieConsent === 'function') initCookieConsent(); }catch(e){}
  attachDelegatedHandlers();
});
