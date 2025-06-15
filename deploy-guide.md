# 🚀 Guia de Deploy - Roku Streaming Server

## 📋 Pré-requisitos
- Conta no serviço de hospedagem escolhido
- Git instalado (para alguns serviços)
- Arquivos do projeto prontos

## 🌐 Opções de Deploy

### 1. **Heroku** (Recomendado)
```bash
# 1. Instalar Heroku CLI
# 2. Login no Heroku
heroku login

# 3. Criar aplicação
heroku create seu-app-roku-streaming

# 4. Deploy
git add .
git commit -m "Deploy inicial"
git push heroku main

# 5. Abrir aplicação
heroku open
```

**URL final:** `https://seu-app-roku-streaming.herokuapp.com/streaming`

### 2. **Railway**
1. Acesse [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Deploy automático
4. Configure domínio personalizado (opcional)

**URL final:** `https://seu-app.railway.app/streaming`

### 3. **Render**
1. Acesse [render.com](https://render.com)
2. Conecte repositório GitHub
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Deploy automático

**URL final:** `https://seu-app.onrender.com/streaming`

### 4. **Vercel**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Seguir instruções
```

**URL final:** `https://seu-app.vercel.app/streaming`

## ⚙️ Configuração do Canal Roku

Após o deploy, edite `components/MainScene.brs`:

```brightscript
sub loadStreamingPage()
    ' Substitua pela URL do seu deploy
    streamingUrl = "https://SEU_APP.herokuapp.com/streaming"
    
    print "Carregando streaming de: " + streamingUrl
    m.webView.url = streamingUrl
end sub
```

## 🔧 Variáveis de Ambiente

Alguns serviços podem precisar de configurações:

```bash
# .env (se necessário)
PORT=3111
NODE_ENV=production
```

## 📱 Teste do Deploy

1. **Teste no navegador:**
   - Acesse `https://sua-url.com/streaming`
   - Verifique se o vídeo carrega
   - Teste os controles

2. **Teste no Roku:**
   - Configure a URL no canal
   - Faça sideload do canal
   - Teste funcionalidade completa

## 🛠️ Troubleshooting

### Erro de CORS
Adicione no `index.js`:
```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
```

### Vídeo não carrega
- Verifique URLs dos vídeos
- Teste conectividade
- Verifique logs do servidor

### Canal Roku não conecta
- Confirme URL no MainScene.brs
- Verifique se servidor está online
- Teste URL no navegador primeiro

## 📊 Monitoramento

### Logs do servidor:
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# Render
# Logs disponíveis no dashboard
```

### Health Check:
- Acesse `/health` para verificar status
- Configure monitoramento automático

## 🔒 Segurança

Para produção, considere:
- HTTPS obrigatório
- Rate limiting
- Autenticação (se necessário)
- Logs de acesso

## 📈 Próximos Passos

1. **Deploy realizado** ✅
2. **Canal Roku configurado** ⏳
3. **Testes completos** ⏳
4. **Publicação na Roku Store** ⏳

---

**🎯 URL para configurar no Roku:**
`https://SEU_DOMINIO.com/streaming`