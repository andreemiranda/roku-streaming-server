# 🚀 Deploy no Render.com - Guia Completo

## 📋 Pré-requisitos

1. **Conta no GitHub** com repositório do projeto
2. **Conta no Render.com** (gratuita)
3. **Arquivo `render.yaml`** configurado (✅ já criado)

## 🔧 Configuração Inicial

### 1. Preparar Repositório GitHub

```bash
# 1. Inicializar repositório (se ainda não foi feito)
git init

# 2. Adicionar arquivos
git add .
git commit -m "Configuração inicial do servidor Roku"

# 3. Conectar com GitHub
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 2. Estrutura de Arquivos para Deploy
```
projeto/
├── server/
│   ├── render.yaml          ✅ Configuração do Render
│   ├── .renderignore        ✅ Arquivos ignorados
│   ├── package.json         ✅ Dependências
│   ├── index.js            ✅ Servidor principal
│   ├── streaming.html      ✅ Página de streaming
│   └── DEPLOY.md           ✅ Este guia
└── roku-app/               (não será deployado)
```

## 🌐 Deploy no Render.com

### Método 1: Deploy Automático via GitHub

1. **Acesse [render.com](https://render.com)**
2. **Faça login** com GitHub
3. **Clique em "New +"** → **"Web Service"**
4. **Conecte seu repositório** GitHub
5. **Configure o serviço:**

```yaml
Name: roku-streaming-server
Environment: Node
Region: Oregon (ou mais próximo)
Branch: main
Root Directory: server
Build Command: npm install
Start Command: npm start
```

6. **Clique em "Create Web Service"**

### Método 2: Deploy via render.yaml (Recomendado)

1. **Acesse [render.com](https://render.com)**
2. **Clique em "New +"** → **"Blueprint"**
3. **Conecte seu repositório** GitHub
4. **Render detectará automaticamente** o arquivo `render.yaml`
5. **Clique em "Apply"**

## ⚙️ Configurações Automáticas

O arquivo `render.yaml` já configura automaticamente:

### ✅ Variáveis de Ambiente
- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT` (automático do Render)

### ✅ Configurações de Saúde
- Health check em `/health`
- Monitoramento automático
- Restart automático em caso de falha

### ✅ Configurações de Build
- Instalação automática de dependências
- Ignorar arquivos desnecessários
- Build otimizado para produção

## 🔗 URLs Geradas

Após o deploy, o Render gerará URLs como:
```
https://roku-streaming-server-abc123.onrender.com
```

### Endpoints Disponíveis:
- **Streaming:** `https://seu-app.onrender.com/streaming`
- **Health:** `https://seu-app.onrender.com/health`
- **API:** `https://seu-app.onrender.com/api/videos`

## 🎯 Configurar no Canal Roku

Após o deploy bem-sucedido, edite `roku-app/components/MainScene.brs`:

```brightscript
sub loadStreamingPage()
    ' URL do Render.com (substitua pela sua URL real)
    streamingUrl = "https://roku-streaming-server-abc123.onrender.com/streaming"
    
    print "Carregando streaming de: " + streamingUrl
    m.webView.url = streamingUrl
end sub
```

## 📊 Monitoramento

### Dashboard do Render
- **Logs em tempo real**
- **Métricas de performance**
- **Status de saúde**
- **Histórico de deploys**

### Comandos de Monitoramento
```bash
# Ver logs (via Render CLI)
render logs -s roku-streaming-server

# Status do serviço
curl https://seu-app.onrender.com/health
```

## 🔄 Deploy Automático

### Configuração de Auto-Deploy
O `render.yaml` já configura deploy automático:
- ✅ **Push na branch `main`** → Deploy automático
- ✅ **Detecção de mudanças** na pasta `server/`
- ✅ **Ignorar mudanças** na pasta `roku-app/`

### Workflow de Desenvolvimento
```bash
# 1. Fazer mudanças no código
# 2. Commit e push
git add .
git commit -m "Atualização do servidor"
git push origin main

# 3. Deploy automático será iniciado
# 4. Verificar no dashboard do Render
```

## 🛠️ Troubleshooting

### Deploy Falhou
1. **Verificar logs** no dashboard do Render
2. **Verificar `package.json`** - dependências corretas
3. **Verificar `render.yaml`** - configuração correta
4. **Testar localmente** antes do deploy

### Serviço Não Responde
1. **Verificar health check:** `/health`
2. **Verificar logs** de runtime
3. **Verificar variáveis** de ambiente
4. **Restart manual** se necessário

### CORS Issues
O servidor já está configurado com CORS permissivo:
```javascript
app.use(cors({ origin: '*' }));
```

## 💰 Planos do Render

### Plano Gratuito (Configurado)
- ✅ **750 horas/mês** de runtime
- ✅ **Domínio gratuito** (.onrender.com)
- ✅ **SSL automático**
- ✅ **Deploy automático**
- ⚠️ **Sleep após inatividade** (30 min)

### Plano Pago (Opcional)
- ✅ **Sem sleep**
- ✅ **Domínio customizado**
- ✅ **Mais recursos**
- ✅ **Suporte prioritário**

## 🔒 Segurança

### Configurações Automáticas
- ✅ **HTTPS obrigatório**
- ✅ **Headers de segurança**
- ✅ **Isolamento de ambiente**
- ✅ **Logs seguros**

### Recomendações Adicionais
- 🔐 **Não commitar** arquivos `.env`
- 🔐 **Usar secrets** para dados sensíveis
- 🔐 **Monitorar logs** regularmente
- 🔐 **Atualizar dependências**

## 📈 Próximos Passos

1. **Deploy realizado** ✅
2. **URL configurada no Roku** ⏳
3. **Testes completos** ⏳
4. **Domínio customizado** (opcional) ⏳
5. **Monitoramento configurado** ⏳

---

**🎯 URL Final para o Roku:**
`https://SEU_APP.onrender.com/streaming`

**💡 Dica:** O primeiro acesso pode demorar alguns segundos devido ao "cold start" do plano gratuito. Para produção, considere o plano pago para eliminar o sleep.