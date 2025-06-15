# 🚀 Roku Streaming Server v2.0

Servidor Express.js otimizado para streaming com suporte a M3U8, YouTube e rádios online, incluindo sistema de autenticação por API Key.

## 📋 Funcionalidades

- ✅ **75+ canais** incluindo M3U8, YouTube e rádios
- ✅ **API RESTful** com autenticação por chave
- ✅ **Filtros por tipo** (video, youtube, audio)
- ✅ **Paginação** para grandes listas
- ✅ **Documentação automática** da API
- ✅ **Health check** e monitoramento
- ✅ **Deploy otimizado** para Render.com

## 🔑 Autenticação

A API utiliza chave de autenticação que pode ser enviada de duas formas:

### Header (Recomendado)
```bash
curl -H "x-api-key: roku-streaming-2024-secure-key" \
     https://seu-dominio.com/api/channels
```

### Query Parameter
```bash
curl "https://seu-dominio.com/api/channels?api_key=roku-streaming-2024-secure-key"
```

### Configurar API Key Personalizada
```bash
# Via variável de ambiente
export API_KEY="sua-chave-super-secreta"

# Ou no arquivo .env
API_KEY=sua-chave-super-secreta
```

## 📺 Endpoints da API

### 🎬 Todos os Canais
```http
GET /api/channels
```

**Parâmetros opcionais:**
- `type`: Filtrar por tipo (`video`, `youtube`, `audio`)
- `limit`: Limitar resultados (padrão: todos)
- `offset`: Pular resultados (paginação)

**Exemplo:**
```bash
curl -H "x-api-key: sua-chave" \
     "https://seu-dominio.com/api/channels?type=video&limit=10&offset=0"
```

### 📹 Apenas Vídeos
```http
GET /api/videos
```
Retorna canais M3U8 e YouTube com thumbnails.

### 📻 Apenas Rádios
```http
GET /api/audio
```
Retorna estações de rádio online.

### 🎯 Canal Específico
```http
GET /api/channels/:id
```

**Exemplo:**
```bash
curl -H "x-api-key: sua-chave" \
     https://seu-dominio.com/api/channels/1
```

### 📖 Documentação
```http
GET /api/docs
```
Documentação completa da API com estatísticas.

## 🗂️ Estrutura dos Dados

### Canal de Vídeo M3U8
```json
{
  "id": 1,
  "number": 1,
  "name": "TV Cultura",
  "url": "https://exemplo.com/playlist.m3u8",
  "type": "video"
}
```

### Canal YouTube
```json
{
  "id": 27,
  "number": 30,
  "name": "Euro News",
  "url": "https://www.youtube.com/watch?v=XuZAl-ZPEcA",
  "type": "youtube",
  "thumbnail": "https://img.youtube.com/vi/XuZAl-ZPEcA/maxresdefault.jpg"
}
```

### Estação de Rádio
```json
{
  "id": 67,
  "number": 70,
  "name": "Rádio Olivença FM",
  "url": "https://server12.srvsh.com.br:8074/stream",
  "type": "audio"
}
```

## 🌐 Deploy no Render.com

### 1. Configuração Automática
O arquivo `render.yaml` já está configurado. Apenas:

1. Conecte seu repositório no [Render.com](https://render.com)
2. O deploy será automático
3. A API estará disponível em: `https://seu-app.onrender.com`

### 2. Variáveis de Ambiente
Configure no dashboard do Render:
```
API_KEY=sua-chave-personalizada
NODE_ENV=production
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 📊 Estatísticas dos Canais

- **Total:** 75 canais
- **Vídeo M3U8:** 60 canais
- **YouTube:** 9 canais
- **Rádio:** 6 estações

### Categorias Incluídas:
- 📺 **TV Aberta:** Cultura, Brasil, Câmara, Senado
- ⛪ **Religiosos:** Aparecida, Universal, Novo Tempo, Pai Eterno
- 🏃 **Esportes:** Fox Sports, CBS Sports, Real Madrid TV
- 📰 **Notícias:** CNN Brasil, Record News, Euro News
- 📻 **Rádios:** FM, Web Rádios de várias regiões

## 🛠️ Integração com Roku

### BrightScript Example
```brightscript
sub loadChannels()
    request = CreateObject("roUrlTransfer")
    request.SetUrl("https://seu-app.onrender.com/api/videos")
    request.AddHeader("x-api-key", "sua-chave-api")
    
    response = request.GetToString()
    channels = ParseJson(response)
    
    if channels.success then
        for each video in channels.videos
            print "Canal: " + video.title + " - " + video.url
        end for
    end if
end sub
```

### JavaScript Example
```javascript
const API_BASE = 'https://seu-app.onrender.com/api';
const API_KEY = 'sua-chave-api';

async function getChannels(type = null) {
    const url = type ? `${API_BASE}/channels?type=${type}` : `${API_BASE}/channels`;
    
    const response = await fetch(url, {
        headers: {
            'x-api-key': API_KEY
        }
    });
    
    const data = await response.json();
    return data.channels;
}

// Usar
const videoChannels = await getChannels('video');
const audioStations = await getChannels('audio');
```

## 🔒 Segurança

### Produção
- ✅ HTTPS automático (Render.com)
- ✅ CORS configurado
- ✅ API Key obrigatória
- ✅ Rate limiting (recomendado adicionar)
- ✅ Logs de acesso

### Recomendações
1. **Mude a API Key padrão** em produção
2. **Use HTTPS** sempre
3. **Monitore uso** da API
4. **Implemente rate limiting** se necessário

## 📈 Monitoramento

### Health Check
```bash
curl https://seu-app.onrender.com/health
```

### Logs
- Dashboard do Render.com
- Métricas automáticas
- Alertas de uptime

## 🆘 Troubleshooting

### API retorna 401
- Verifique se a API key está correta
- Confirme o header `x-api-key` ou query `api_key`

### Canal não carrega
- Teste a URL diretamente no navegador
- Verifique se é M3U8 válido
- Confirme conectividade do servidor

### Deploy falha
- Verifique `package.json`
- Confirme dependências
- Analise logs no Render

---

**🎯 URL de Produção:** `https://roku-streaming-server.onrender.com`  
**🔑 API Key Padrão:** `roku-streaming-2024-secure-key`  
**📖 Documentação:** `https://roku-streaming-server.onrender.com/api/docs`