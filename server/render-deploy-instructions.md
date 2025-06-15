# 📋 Instruções Rápidas - Deploy Render.com

## 🚀 Deploy em 5 Passos

### 1. Preparar GitHub
```bash
git add .
git commit -m "Deploy para Render.com"
git push origin main
```

### 2. Acessar Render.com
- Vá para [render.com](https://render.com)
- Faça login com GitHub

### 3. Criar Web Service
- **New +** → **Web Service**
- **Connect Repository** → Selecione seu repo
- **Root Directory:** `server`

### 4. Configurar Serviço
```
Name: roku-streaming-server
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 5. Deploy!
- Clique **"Create Web Service"**
- Aguarde o deploy (2-5 minutos)

## 🎯 Resultado

Você receberá uma URL como:
```
https://roku-streaming-server-abc123.onrender.com
```

## 🔧 Configurar no Roku

Edite `MainScene.brs`:
```brightscript
streamingUrl = "https://SUA_URL.onrender.com/streaming"
```

## ✅ Testar

1. **Navegador:** Acesse `/streaming`
2. **API:** Acesse `/health`
3. **Roku:** Teste o canal

---

**🎉 Pronto! Seu servidor está no ar!**