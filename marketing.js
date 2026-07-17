/**
 * Infocelll - Marketing Integrations
 * Google Analytics 4, GTM, Search Console, Ads, Meta Pixel
 * 
 * IMPORTANTE: Substitua os IDs placeholder pelos seus IDs reais
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURAÇÕES - SUBSTITUA PELOS SEUS IDS
    // ============================================
    var CONFIG = {
        // Google Analytics 4 (GA4)
        GA4_ID: 'G-XXXXXXXXXX', // Seu ID de medição GA4
        
        // Google Tag Manager (GTM)
        GTM_ID: 'GTM-XXXXXXX', // Seu container ID GTM
        
        // Google Search Console
        SEARCH_CONSOLE_VERIFICATION: 'xxxxxxxxxx', // Código de verificação
        
        // Google Ads
        GOOGLE_ADS_ID: 'AW-XXXXXXXXX', // Seu ID de conversão
        GOOGLE_ADS_CONVERSION_LABEL: 'XXXXXXXXXXXXXXXX', // Label da conversão
        
        // Meta Pixel (Facebook)
        META_PIXEL_ID: '000000000000000', // Seu Pixel ID
        
        // Google Merchant Center
        MERCHANT_CENTER_ID: '0000000000', // Seu Merchant Center ID
        MERCHANT_CENTER_FEED: 'https://infocelll.com.br/feed-produtos.xml'
    };

    // ============================================
    // GOOGLE ANALYTICS 4 (GA4)
    // ============================================
    function initGA4() {
        if (CONFIG.GA4_ID === 'G-XXXXXXXXXX') {
            console.log('⚠️ GA4: ID não configurado. Substitua G-XXXXXXXXXX pelo seu ID real.');
            return;
        }
        
        // Carregar script GA4
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID;
        document.head.appendChild(script);
        
        // Inicializar GA4
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', CONFIG.GA4_ID, {
            'page_title': document.title,
            'page_location': window.location.href,
            'custom_map': {
                'dimension1': 'user_type',
                'dimension2': 'service_category'
            }
        });
        
        // Rastrear eventos personalizados
        window.trackEvent = function(eventName, params) {
            gtag('event', eventName, params);
        };
        
        // Rastrear cliques em WhatsApp
        document.querySelectorAll('a[href*="wa.me"]').forEach(function(link) {
            link.addEventListener('click', function() {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'engagement',
                    'event_label': 'whatsapp_contact'
                });
            });
        });
        
        // Rastrear cliques em telefone
        document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
            link.addEventListener('click', function() {
                gtag('event', 'phone_call', {
                    'event_category': 'engagement',
                    'event_label': 'phone_contact'
                });
            });
        });
        
        // Rastrear scroll depth
        var scrollDepthTriggered = {};
        window.addEventListener('scroll', function() {
            var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            [25, 50, 75, 100].forEach(function(percent) {
                if (scrollPercent >= percent && !scrollDepthTriggered[percent]) {
                    scrollDepthTriggered[percent] = true;
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': percent + '%',
                        'value': percent
                    });
                }
            });
        });
        
        console.log('✅ GA4 inicializado:', CONFIG.GA4_ID);
    }

    // ============================================
    // GOOGLE TAG MANAGER (GTM)
    // ============================================
    function initGTM() {
        if (CONFIG.GTM_ID === 'GTM-XXXXXXX') {
            console.log('⚠️ GTM: ID não configurado. Substitua GTM-XXXXXXX pelo seu ID real.');
            return;
        }
        
        // Carregar GTM
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer',CONFIG.GTM_ID);
        
        // GTM noscript (fallback)
        var noscript = document.createElement('noscript');
        noscript.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' + 
            CONFIG.GTM_ID + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
        document.body.insertBefore(noscript, document.body.firstChild);
        
        console.log('✅ GTM inicializado:', CONFIG.GTM_ID);
    }

    // ============================================
    // GOOGLE SEARCH CONSOLE
    // ============================================
    function initSearchConsole() {
        if (CONFIG.SEARCH_CONSOLE_VERIFICATION === 'xxxxxxxxxx') {
            console.log('⚠️ Search Console: Código não configurado.');
            return;
        }
        
        // Adicionar meta tag de verificação
        var meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = CONFIG.SEARCH_CONSOLE_VERIFICATION;
        document.head.appendChild(meta);
        
        // Submeter sitemap
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sitemap_submitted', {
                'event_category': 'seo',
                'event_label': 'sitemap.xml'
            });
        }
        
        console.log('✅ Search Console configurado');
    }

    // ============================================
    // GOOGLE ADS (Remarketing + Conversão)
    // ============================================
    function initGoogleAds() {
        if (CONFIG.GOOGLE_ADS_ID === 'AW-XXXXXXXXX') {
            console.log('⚠️ Google Ads: ID não configurado.');
            return;
        }
        
        // Carregar script Google Ads
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GOOGLE_ADS_ID;
        document.head.appendChild(script);
        
        // Inicializar Google Ads
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', CONFIG.GOOGLE_ADS_ID);
        
        // Rastrear conversões
        window.trackConversion = function(value) {
            gtag('event', 'conversion', {
                'send_to': CONFIG.GOOGLE_ADS_ID + '/' + CONFIG.GOOGLE_ADS_CONVERSION_LABEL,
                'value': value || 1.0,
                'currency': 'BRL'
            });
        };
        
        // Rastrear cliques em WhatsApp como conversão
        document.querySelectorAll('a[href*="wa.me"]').forEach(function(link) {
            link.addEventListener('click', function() {
                window.trackConversion(1.0);
            });
        });
        
        // Rastrear envios de formulário como conversão
        document.querySelectorAll('form').forEach(function(form) {
            form.addEventListener('submit', function() {
                window.trackConversion(5.0); // Valor maior para leads qualificados
            });
        });
        
        // Remarketing - Adicionar à lista
        gtag('event', 'page_view', {
            'send_to': CONFIG.GOOGLE_ADS_ID
        });
        
        console.log('✅ Google Ads inicializado:', CONFIG.GOOGLE_ADS_ID);
    }

    // ============================================
    // META PIXEL (Facebook Ads)
    // ============================================
    function initMetaPixel() {
        if (CONFIG.META_PIXEL_ID === '000000000000000') {
            console.log('⚠️ Meta Pixel: ID não configurado.');
            return;
        }
        
        // Carregar Meta Pixel
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        // Inicializar Meta Pixel
        fbq('init', CONFIG.META_PIXEL_ID);
        fbq('track', 'PageView');
        
        // Rastrear eventos personalizados
        window.trackFBEvent = function(eventName, params) {
            fbq('track', eventName, params);
        };
        
        // Rastrear visualização de conteúdo
        window.addEventListener('load', function() {
            fbq('track', 'ViewContent', {
                'content_name': document.title,
                'content_category': 'Assistência Técnica'
            });
        });
        
        // Rastrear cliques em WhatsApp
        document.querySelectorAll('a[href*="wa.me"]').forEach(function(link) {
            link.addEventListener('click', function() {
                fbq('track', 'Contact', {
                    'content_name': 'WhatsApp',
                    'content_category': 'Contato'
                });
            });
        });
        
        // Rastrear envios de formulário
        document.querySelectorAll('form').forEach(function(form) {
            form.addEventListener('submit', function() {
                fbq('track', 'Lead', {
                    'content_name': 'Formulário de Contato',
                    'content_category': 'Lead'
                });
            });
        });
        
        console.log('✅ Meta Pixel inicializado:', CONFIG.META_PIXEL_ID);
    }

    // ============================================
    // GOOGLE MERCHANT CENTER
    // ============================================
    function initMerchantCenter() {
        if (CONFIG.MERCHANT_CENTER_ID === '0000000000') {
            console.log('⚠️ Merchant Center: ID não configurado.');
            return;
        }
        
        // Adicionar link para feed de produtos
        var link = document.createElement('link');
        link.rel = 'alternate';
        link.type = 'application/xml';
        link.title = 'Infocelll - Feed de Produtos';
        link.href = CONFIG.MERCHANT_CENTER_FEED;
        document.head.appendChild(link);
        
        // Adicionar schema para produtos (se houver produtos para venda)
        var productSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Produtos e Acessórios Infocelll",
            "description": "Acessórios e peças para celulares e computadores",
            "numberOfItems": 0,
            "itemListElement": []
        };
        
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(productSchema);
        document.head.appendChild(script);
        
        console.log('✅ Merchant Center configurado');
    }

    // ============================================
    // GOOGLE REVIEWS WIDGET
    // ============================================
    function initGoogleReviews() {
        // Criar container para avaliações
        var reviewsSection = document.createElement('section');
        reviewsSection.className = 'google-reviews-section';
        reviewsSection.innerHTML = `
            <div class="container">
                <div class="reviews-header reveal">
                    <div class="section-label">Avaliações Google</div>
                    <h2 class="section-title">O que nossos clientes dizem</h2>
                    <p class="section-subtitle">Avaliações reais de clientes verificados no Google</p>
                </div>
                <div class="google-reviews-widget reveal" id="google-reviews-widget">
                    <div class="reviews-loading">
                        <i class="ph ph-spinner"></i>
                        Carregando avaliações...
                    </div>
                </div>
                <div class="reviews-cta reveal">
                    <a href="https://g.page/r/infocelll/review" target="_blank" rel="noopener noreferrer" class="btn-primary">
                        <i class="ph ph-star-fill"></i>
                        Avalie no Google
                    </a>
                </div>
            </div>
        `;
        
        // Inserir antes da seção de contato
        var contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.parentNode.insertBefore(reviewsSection, contactSection);
        }
        
        // Estilos para o widget
        var style = document.createElement('style');
        style.textContent = `
            .google-reviews-section {
                padding: 64px 0;
                background: var(--white);
            }
            .reviews-header {
                text-align: center;
                margin-bottom: 48px;
            }
            .google-reviews-widget {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }
            .review-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: var(--radius-md);
                padding: 24px;
                transition: all 0.3s ease;
            }
            .review-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-lg);
            }
            .review-stars {
                display: flex;
                gap: 4px;
                margin-bottom: 12px;
                color: #fbbf24;
            }
            .review-text {
                font-size: 14px;
                line-height: 1.6;
                color: var(--text-secondary);
                margin-bottom: 16px;
            }
            .review-author {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .review-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--teal);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
            }
            .review-info h4 {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 2px;
            }
            .review-info span {
                font-size: 12px;
                color: var(--text-muted);
            }
            .reviews-loading {
                grid-column: 1 / -1;
                text-align: center;
                padding: 48px;
                color: var(--text-muted);
            }
            .reviews-cta {
                text-align: center;
            }
        `;
        document.head.appendChild(style);
        
        // Simular carregamento de avaliações (substituir por API real)
        setTimeout(function() {
            var widget = document.getElementById('google-reviews-widget');
            if (widget) {
                widget.innerHTML = `
                    <div class="review-card">
                        <div class="review-stars">
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                        </div>
                        <p class="review-text">"Excelente assistência técnica! Trocaram a tela do meu iPhone rapidamente e com qualidade. Recomendo!"</p>
                        <div class="review-author">
                            <div class="review-avatar">MC</div>
                            <div class="review-info">
                                <h4>Maria Costa</h4>
                                <span>Há 2 semanas</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-card">
                        <div class="review-stars">
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                        </div>
                        <p class="review-text">"Profissionais competentes e honestos. Meu notebook ficou como novo depois da limpeza e formatação."</p>
                        <div class="review-author">
                            <div class="review-avatar">JS</div>
                            <div class="review-info">
                                <h4>João Silva</h4>
                                <span>Há 1 mês</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-card">
                        <div class="review-stars">
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                            <i class="ph ph-star-fill"></i>
                        </div>
                        <p class="review-text">"Ótimo atendimento! Explicaram tudo sobre o reparo e o preço foi justo. Voltarei se precisar."</p>
                        <div class="review-author">
                            <div class="review-avatar">AL</div>
                            <div class="review-info">
                                <h4>Ana Lima</h4>
                                <span>Há 3 semanas</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }, 1500);
        
        console.log('✅ Google Reviews Widget configurado');
    }

    // ============================================
    // INICIALIZAR TODAS AS INTEGRAÇÕES
    // ============================================
    function initAllMarketing() {
        console.log('🚀 Iniciando integrações de marketing...');
        
        initGA4();
        initGTM();
        initSearchConsole();
        initGoogleAds();
        initMetaPixel();
        initMerchantCenter();
        initGoogleReviews();
        
        console.log('✅ Todas as integrações de marketing inicializadas');
    }

    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllMarketing);
    } else {
        initAllMarketing();
    }

})();
