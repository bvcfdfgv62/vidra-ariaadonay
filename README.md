# Vidraçaria Adonay

Landing page em index.html, styles.css e script.js, com HTML, CSS e JavaScript nativos e sem dependências de build.

## Executar localmente

Na pasta do projeto, rode:

```powershell
python -m http.server 4173
```

Abra `http://localhost:4173` no navegador. O servidor deve ser executado na pasta raiz do projeto para servir os arquivos e imagens.

## Sequência de frames

Coloque a pasta frames na raiz do projeto, no mesmo nível de index.html, com os arquivos frame-0001.jpg até frame-0040.jpg. A página pré-carrega a sequência e ativa o canvas fixo após todos os quadros carregarem. Até lá, exibe a fotografia real do hero como fallback.

## Contato e publicação

- **WhatsApp:** configurado no objeto business em script.js.
- **Imagens da galeria:** as três fotografias recebidas foram usadas sem atribuir nome de cliente ou projeto. Confirme que representam obras executadas pela Adonay antes de publicar a galeria como portfólio.
- **Processo de orçamento:** os três passos descrevem o que o visitante pode enviar para iniciar a conversa; confirme com a empresa antes de tratar isso como seu processo operacional oficial.
- **Domínio:** não foi informado. Configure domínio, URL canônica e `sitemap.xml` antes de publicar; a página já inclui título, descrição, Open Graph, favicon, dados locais verificados e `robots.txt`.
- **Instagram:** o perfil e o nome de usuário foram fornecidos na captura do cliente. O link está configurado, mas a consulta pública direta foi limitada pelo Instagram durante esta implementação.

## Inventário de imagens

| Arquivo original | Dimensões | Conteúdo visível |
| --- | ---: | --- |
| `assets/images/portfolio/originals/ambiente-01.png` | 530 × 825 | Espelho oval iluminado sobre uma bancada de banheiro |
| `assets/images/portfolio/originals/ambiente-02.png` | 530 × 703 | Bancada com cuba, espelho e box de vidro |
| `assets/images/portfolio/originals/ambiente-03.png` | 527 × 705 | Banheira e espelho circular em banheiro |
| `assets/reference/instagram-profile.png` | 1192 × 305 | Captura do perfil e referência do logotipo |

Os três arquivos PNG originais foram preservados. As cópias WebP usadas pela página ficam em `images/portfolio/optimized/`. O pequeno arquivo `images/brand/adonay-mark.webp` é um recorte otimizado do logotipo que aparece na captura fornecida.
