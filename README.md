# accarprotecaoveicular.com.br — Landing page AC Car Proteção Veicular

Landing page de conversão (HTML/CSS/JS puro, sem build). Conteúdo e cores do site atual da AC Car; layout novo.

## Estrutura
1. Hero: headline, CTA de cotação + WhatsApp, frota de carros e cartão "Proteção ativa"
2. Simulador "E se acontecer com você amanhã?" (abas por situação: roubo, perda total, terceiros, pane, vidros, chave/pneu)
3. Vídeo do YouTube com contexto (carrega só no clique)
4. Coberturas completas (proteção do veículo + assistência 24h)
5. Como funciona (3 passos)
6. Confiança: história e 5 unidades (depoimentos prontos, ocultos até serem preenchidos)
7. Formulário de cotação → abre o WhatsApp do consultor com os dados
8. Dúvidas, CTA final, rodapé
- Barra fixa no celular: "Cotar grátis" + WhatsApp

## Rastreamento (dataLayer / gtag / Meta Pixel)
`accar_cta_click`, `accar_whatsapp_click`, `accar_instagram_click`, `accar_simulator_select`, `accar_video_play`, `accar_form_start`, `accar_form_submit`

## Pendências
- [ ] ID do vídeo do YouTube em `data-video-id` (index.html, seção VÍDEO)
- [ ] Depoimentos reais (seção CONFIANÇA: preencher e remover o atributo `hidden`)
- [ ] Texto oficial da Política de Privacidade
- [ ] Domínio na Vercel
