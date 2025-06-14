# 🚀 Roku Streaming Server

Servidor Express.js otimizado para streaming de vídeo em aplicações Roku TV.

## 📋 Funcionalidades

- ✅ Servidor Express com CORS configurado
- ✅ Endpoint `/streaming` para página HTML otimizada para Roku
- ✅ Health check endpoint `/health`
- ✅ API de vídeos `/api/videos`
- ✅ Configuração para deploy no Render.com

## 🌐 Deploy no Render.com

### Método 1: Via GitHub (Recomendado)

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "Configuração para deploy no Render"
   git push origin main
   ```

2. **Configurar no Render:**
   - Acesse [render.com](https://render.com)
   - Conecte sua conta GitHub
   - Clique em "New Web Service"
   - Selecione seu repositório
   - Configure:
     - **Name:** `roku-streaming-server`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Root Directory:** `server`

3. **Deploy automático:**
   - O Render detectará o `render.yaml` automaticamente
   - Deploy será executado automaticamente

### Método 2: Via render.yaml

O arquivo `render.yaml` já está configurado com:
- Build automático
- Health check em `/health`
- Variáveis de ambiente
- Deploy automático do branch `main`

## 🔧 Configuração Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 📺 Endpoints Disponíveis

- **`/`** - Página inicial com instruções
- **`/streaming`** - Página HTML para Roku TV
- **`/health`** - Health check do servidor
- **`/api/videos`** - API com lista de vídeos

## 🎯 URL de Produção

Após o deploy, sua aplicação estará disponível em:
```
https://roku-streaming-server.onrender.com
```

Configure esta URL no seu canal Roku:
```brightscript
streamingUrl = "https://roku-streaming-server.onrender.com/streaming"
```

## 🛠️ Troubleshooting

### Deploy falha
- Verifique se o `package.json` está correto
- Confirme que todas as dependências estão listadas
- Verifique logs no dashboard do Render

### Aplicação não inicia
- Confirme que a porta está configurada via `process.env.PORT`
- Verifique health check endpoint
- Analise logs de erro

### CORS Issues
- O CORS já está configurado para aceitar todas as origens
- Para produção, considere restringir origens específicas

## 📊 Monitoramento

- Health check: `GET /health`
- Logs disponíveis no dashboard do Render
- Métricas de performance automáticas

## 🔒 Segurança

Para produção, considere:
- Rate limiting
- Autenticação (se necessário)
- HTTPS (automático no Render)
- Logs de acesso

---

**🎬 Teste a aplicação:** [https://roku-streaming-server.onrender.com/streaming](https://roku-streaming-server.onrender.com/streaming)