param(
    [string]$Path = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path $Path).Path
$faltando = New-Object System.Collections.Generic.List[string]
$pass = 0
$fail = 0

function LogOK([string]$msg) { Write-Host "[OK]   $msg" -ForegroundColor Green }
function LogFail([string]$msg) { Write-Host "[FALTA] $msg" -ForegroundColor Red }

Write-Host "===== CHECK DEPLOY - Infocelll =====" -ForegroundColor Cyan
Write-Host "Raiz: $root" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------------
# 1. Arquivos principais do site
# ---------------------------------------------------------------
Write-Host "--- 1. Arquivos principais ---" -ForegroundColor Yellow
$core = @('index.html','style.min.css','script.min.js','marketing.min.js','sw.js','manifest.json','robots.txt','sitemap.xml','favicon.svg','logo.png','logo.webp')
foreach ($f in $core) {
    if (Test-Path (Join-Path $root $f)) { $pass++; LogOK $f } else { $fail++; $faltando.Add($f); LogFail $f }
}

# ---------------------------------------------------------------
# 2. Fontes usadas (devem estar no repo, senao da 404 no console)
# ---------------------------------------------------------------
Write-Host ""
Write-Host "--- 2. Fontes (404 se ausentes) ---" -ForegroundColor Yellow
$fonts = @('inter-latin.woff2','inter-latin-ext.woff2','spacegrotesk-latin.woff2','spacegrotesk-latin-ext.woff2','Phosphor.woff2','Phosphor-Fill.woff2')
foreach ($f in $fonts) {
    $p = Join-Path $root ("fonts\" + $f)
    if (Test-Path $p) {
        $tam = (Get-Item $p).Length
        if ($tam -gt 1000) { $pass++; LogOK "fonts/$f ($tam bytes)" } else { $fail++; $faltando.Add("fonts/$f"); LogFail "fonts/$f (arquivo suspeito: $tam bytes)" }
    } else { $fail++; $faltando.Add("fonts/$f"); LogFail "fonts/$f (NAO EXISTE)" }
}

# ---------------------------------------------------------------
# 3. Referencias locais nos HTML (src/href) existem?
# ---------------------------------------------------------------
Write-Host ""
Write-Host "--- 3. Referencias nos HTML ---" -ForegroundColor Yellow
$referenciados = @{}
Get-ChildItem $root -Filter *.html -File | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)
    [regex]::Matches($c, '(?:src|href)="([^"#:][^"]*?\.(?:json|woff2|png|svg|webp|css|js|ico|jpg|jpeg|gif|xml|txt|pdf|map))[^"]*"') | ForEach-Object {
        $p = $_.Groups[1].Value.TrimStart('/') -replace '\?.*$', ''
        $p = $p -replace '^\./', ''
        if ($p -notmatch '^(https?|data|mailto|tel|wa|maps|//)') { $referenciados[$p] = $true }
    }
}
foreach ($r in ($referenciados.Keys | Sort-Object)) {
    if (Test-Path (Join-Path $root $r)) { $pass++; LogOK $r } else { $fail++; $faltando.Add($r); LogFail "$r (referenciado, porem ausente)" }
}

# ---------------------------------------------------------------
# 4. Itens do service worker (sw.js ASSETS_TO_CACHE) existem?
# ---------------------------------------------------------------
Write-Host ""
Write-Host "--- 4. Cache do service worker (sw.js) ---" -ForegroundColor Yellow
$swPath = Join-Path $root 'sw.js'
if (Test-Path $swPath) {
    $sw = [System.IO.File]::ReadAllText($swPath)
    $m = [regex]::Match($sw, 'var ASSETS_TO_CACHE\s*=\s*\[(.*?)\];', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($m.Success) {
        $itens = [regex]::Matches($m.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value.TrimStart('/') -replace '^\./', '' }
        foreach ($i in ($itens | Sort-Object -Unique)) {
            if ($i -eq '') { continue }
            if (Test-Path (Join-Path $root $i)) { $pass++; LogOK $i } else { $fail++; $faltando.Add($i); LogFail "$i (no sw.js mas ausente)" }
        }
    } else { LogFail 'ASSETS_TO_CACHE nao encontrado no sw.js' }
} else { LogFail 'sw.js ausente' }

# ---------------------------------------------------------------
# 5. Paginas do sitemap.xml existem?
# ---------------------------------------------------------------
Write-Host ""
Write-Host "--- 5. Sitemap ---" -ForegroundColor Yellow
$sitemap = Join-Path $root 'sitemap.xml'
if (Test-Path $sitemap) {
    $sm = [System.IO.File]::ReadAllText($sitemap)
    $locs = [regex]::Matches($sm, '<loc>([^<]+)</loc>') | ForEach-Object { $_.Groups[1].Value -replace '^https?://[^/]+/?', '' }
    foreach ($l in ($locs | Sort-Object -Unique)) {
        if ($l -eq '') { continue }
        $lp = $l -replace '/$', ''
        if ($lp -eq '') { $lp = 'index.html' }
        if ($lp -notmatch '\.html$') { $lp = $lp + '.html' }
        if (Test-Path (Join-Path $root $lp)) { $pass++; LogOK $lp } else { $fail++; $faltando.Add($lp); LogFail "$lp (no sitemap mas ausente)" }
    }
} else { LogFail 'sitemap.xml ausente' }

# ---------------------------------------------------------------
# 6. Integridade basica dos HTML
# ---------------------------------------------------------------
Write-Host ""
Write-Host "--- 6. Integridade dos HTML ---" -ForegroundColor Yellow
Get-ChildItem $root -Filter *.html -File | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)
    $ok = $c.TrimEnd().EndsWith('</html>')
    if ($ok) { $pass++; LogOK $_.Name } else { $fail++; $faltando.Add($_.Name); LogFail "$($_.Name) (nao termina com </html>)" }
}

# ---------------------------------------------------------------
# Resumo
# ---------------------------------------------------------------
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "TOTAL: $pass OK / $fail PROBLEMAS" -ForegroundColor Cyan
if ($fail -eq 0) {
    Write-Host "RESULTADO: OK - pode fazer o deploy." -ForegroundColor Green
    exit 0
} else {
    Write-Host "RESULTADO: NAO faca deploy ate resolver:" -ForegroundColor Red
    $faltando | Sort-Object -Unique | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}