# Guia de Configuração - Marketing Digital Infocelll

## 📋 IDs Necessários

Para ativar todas as integrações de marketing, você precisa configurar os seguintes IDs no arquivo `marketing.js`:

### 1. Google Analytics 4 (GA4)
- **Onde obter:** [analytics.google.com](https://analytics.google.com)
- **Como:** Criar propriedade → Admin → Fluxos de dados → Web → Copiar ID de medição
- **Formato:** `G-XXXXXXXXXX`
- **Status:** ⚠️ Pendente

### 2. Google Tag Manager (GTM)
- **Onde obter:** [tagmanager.google.com](https://tagmanager.google.com)
- **Como:** Criar container → Copiar ID do container
- **Formato:** `GTM-XXXXXXX`
- **Status:** ⚠️ Pendente

### 3. Google Search Console
- **Onde obter:** [search.google.com/search-console](https://search.google.com/search-console)
- **Como:** Adicionar propriedade → Verificação HTML → Copiar código
- **Formato:** Código alfanumérico
- **Status:** ⚠️ Pendente

### 4. Google Ads
- **Onde obter:** [ads.google.com](https://ads.google.com)
- **Como:** Ferramentas → Configuração → Contas vinculadas → Copiar ID de conversão
- **Formato:** `AW-XXXXXXXXX` + Label de conversão
- **Status:** ⚠️ Pendente

### 5. Meta Pixel (Facebook Ads)
- **Onde obter:** [business.facebook.com](https://business.facebook.com)
- **Como:** Gerenciador de Eventos → Dados → Criar Pixel → Copiar ID
- **Formato:** `000000000000000` (15 dígitos)
- **Status:** ⚠️ Pendente

### 6. Google Merchant Center
- **Onde obter:** [merchants.google.com](https://merchants.google.com)
- **Como:** Criar conta → Configurar → Copiar ID da loja
- **Formato:** `0000000000`
- **Status:** ⚠️ Pendente

### 7. Google Business Profile
- **Onde obter:** [business.google.com](https://business.google.com)
- **Como:** Já deve estar configurado (listagem local)
- **Link para avaliações:** `https://g.page/r/infocelll/review`
- **Status:** ⚠️ Verificar

---

## 🔧 Como Configurar

### Passo 1: Editar o arquivo marketing.js

Abra o arquivo `marketing.js` e localize a seção `CONFIG`:

```javascript
var CONFIG = {
    GA4_ID: 'G-XXXXXXXXXX',           // ← Substitua pelo seu ID GA4
    GTM_ID: 'GTM-XXXXXXX',            // ← Substitua pelo seu ID GTM
    SEARCH_CONSOLE_VERIFICATION: 'xxxxxxxxxx', // ← Substitua pelo código
    GOOGLE_ADS_ID: 'AW-XXXXXXXXX',    // ← Substitua pelo seu ID
    GOOGLE_ADS_CONVERSION_LABEL: 'XXXXXXXXXXXXXXXX', // ← Substitua
    META_PIXEL_ID: '000000000000000',  // ← Substitua pelo seu Pixel ID
    MERCHANT_CENTER_ID: '0000000000',  // ← Substitua pelo seu ID
    MERCHANT_CENTER_FEED: 'https://infocelll.com.br/feed-produtos.xml'
};
```

### Passo 2: Submeter o feed ao Merchant Center

1. Acesse [merchants.google.com](https://merchants.google.com)
2. Vá em **Produtos** → **Feeds**
3. Adicione o feed: `https://infocelll.com.br/feed-produtos.xml`
4. Configure a atualização automática (diária)

### Passo 3: Verificar no Google Search Console

1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione a propriedade `infocelll.com.br`
3. Use a verificação HTML (o código já está no marketing.js)
4. Envie o sitemap: `https://infocelll.com.br/sitemap.xml`

### Passo 4: Configurar o Google Business Profile

1. Acesse [business.google.com](https://business.google.com)
2. Verifique ou reclame a listagem da Infocelll
3. Adicione fotos, horários, serviços e descrição
4. Responda avaliações regularmente

---

## 📊 O que está Integrado

| Ferramenta | Função | Status |
|------------|--------|--------|
| GA4 | Rastreamento de tráfego | ⚠️ Configurar ID |
| GTM | Gerenciamento de tags | ⚠️ Configurar ID |
| Search Console | Monitoramento SEO | ⚠️ Configurar verificação |
| Google Ads | Anúncios pagos | ⚠️ Configurar ID |
| Meta Pixel | Facebook/Instagram Ads | ⚠️ Configurar ID |
| Merchant Center | Listagem de produtos | ⚠️ Configurar ID |
| Google Reviews | Widget de avaliações | ✅ Configurado |
| Google Maps | Mapa interativo | ✅ Configurado |

---

## 🎯 Eventos Rastreados Automaticamente

O sistema rastreia automaticamente:

1. **Cliques em WhatsApp** → Conversão de contato
2. **Cliques em telefone** → Ligação telefônica
3. **Scroll depth** → Engajamento (25%, 50%, 75%, 100%)
4. **Envios de formulário** → Leads qualificados
5. **Visualização de conteúdo** → Interesse em serviços

---

## 📱 Próximos Passos Recomendados

1. **Configurar IDs** no arquivo `marketing.js`
2. **Criar conta no Google Business Profile** (se ainda não tiver)
3. **Configurar Google Analytics 4** com propriedade para infocelll.com.br
4. **Ativar Google Ads** para anúncios locais
5. **Configurar Meta Pixel** para Facebook/Instagram Ads
6. **Submeter feed** ao Merchant Center
7. **Monitorar resultados** no Search Console e GA4

---

## 🆪 Suporte

Para dúvidas sobre configuração:
- Google Analytics: [support.google.com/analytics](https://support.google.com/analytics)
- Google Ads: [support.google.com/google-ads](https://support.google.com/google-ads)
- Meta Business: [business.facebook.com/help](https://business.facebook.com/help)

---

*Documento gerado em: 15/07/2026*
*Projeto: Infocelll - Assistência Técnica em Olinda*
