import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3111;

// API Key for authentication
const API_KEY = process.env.API_KEY || 'roku-streaming-2024-secure-key';

// Middleware
app.use(cors());
app.use(express.static('.'));
app.use(express.json());

// API Key validation middleware
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Valid API key required'
        });
    }
    
    next();
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Roku Streaming Server',
        version: '2.0.0'
    });
});

// Main streaming page for Roku
app.get('/streaming', (req, res) => {
    res.sendFile(path.join(__dirname, 'streaming.html'));
});

// Updated video/audio channels list
const channels = [
    { id: 1, number: 1, name: "TV Cultura", url: "https://5b33b873179a2.streamlock.net:1443/live/livestream/playlist.m3u8", type: "video" },
    { id: 2, number: 2, name: "TV Fundação", url: "https://cdn-fundacao-2110.ciclano.io:1443/fundacao-2110/fundacao-2110/chunklist_w175723033.m3u8", type: "video" },
    { id: 3, number: 5, name: "TV Câmara", url: "https://stream3.camara.gov.br/tv1/manifest.m3u8", type: "video" },
    { id: 4, number: 6, name: "TV Brasil", url: "https://tvbrasil-stream.ebc.com.br/index.m3u8", type: "video" },
    { id: 5, number: 7, name: "Cine Classic", url: "https://live20.bozztv.com/giatvplayout7/giatv-208272/tracks-v1a1/mono.ts.m3u8", type: "video" },
    { id: 6, number: 8, name: "TV Pai Eterno", url: "https://video09.logicahost.com.br/paieterno/paieterno/chunklist_w978992163.m3u8", type: "video" },
    { id: 7, number: 9, name: "TV Cidade Verde", url: "https://televisaocidadeverde.brasilstream.com.br/hls/televisaocidadeverde/index.m3u8", type: "video" },
    { id: 8, number: 10, name: "Record MT", url: "https://cdn.live.br1.jmvstream.com/w/LVW-10841/LVW10841_mT77z9o2cP/chunklist.m3u8", type: "video" },
    { id: 9, number: 11, name: "Rede Manchete", url: "https://stmv1.srvif.com/tvserie/tvserie/chunklist_w2147211548.m3u8", type: "video" },
    { id: 10, number: 12, name: "Rede TV TO", url: "https://ikki.hubcloud.tv.br/RedeTVTO/tracks-v1a1/mono.m3u8", type: "video" },
    { id: 11, number: 13, name: "TV Aparecida", url: "https://cdn.jmvstream.com/w/LVW-9716/LVW9716_HbtQtezcaw/playlist.m3u8", type: "video" },
    { id: 12, number: 14, name: "TV Universal", url: "https://644398c.ha.azioncdn.net/primary/tvuniversal_480p.sdp/chunklist_b946bba4-523a-4655-b6f5-5d73b6135593.m3u8", type: "video" },
    { id: 13, number: 15, name: "RIT TV", url: "https://acesso.ecast.site:3648/live/ritlive.m3u8", type: "video" },
    { id: 14, number: 16, name: "TV Mon", url: "https://srv1.zcast.com.br/tvmon/tvmon/playlist.m3u8", type: "video" },
    { id: 15, number: 17, name: "TV Rede Brasil", url: "https://video09.logicahost.com.br/redebrasiloficial/redebrasiloficial/chunklist_w408678569.m3u8", type: "video" },
    { id: 16, number: 18, name: "Rede Vida", url: "https://d12e4o88jd8gex.cloudfront.net/out/v1/cea3de0b76ac4e82ab8ee0fd3f17ce12/index_2.m3u8", type: "video" },
    { id: 17, number: 19, name: "Soul TV", url: "https://video01.soultv.com.br/soultv/soultv/playlist.m3u8", type: "video" },
    { id: 18, number: 20, name: "TV Rede Gospel", url: "https://cdn.live.br1.jmvstream.com/w/LVW-8719/LVW8719_AcLVAxWy5J/playlist.m3u8", type: "video" },
    { id: 19, number: 21, name: "TV Galega", url: "https://cdn.jmvstream.com/w/LVW-8538/LVW8538_KBtZ9UMIZn/chunklist.m3u8", type: "video" },
    { id: 20, number: 22, name: "TV Brusque", url: "https://5ad482a77183d.streamlock.net/rodrigotvbrusque.com.br/_definst_/5d880199c902eb4a1e8df00d/chunklist_w302981591.m3u8", type: "video" },
    { id: 21, number: 24, name: "TVR Sul", url: "https://5a57bda70564a.streamlock.net/tvrsul/tvrsul.sdp/chunklist_w1778416456.m3u8", type: "video" },
    { id: 22, number: 25, name: "TV Mais", url: "https://stmv1.paineltv.net/tvmaisbrasil/tvmaisbrasil/playlist.m3u8", type: "video" },
    { id: 23, number: 26, name: "Igreja Mundial - IMPD", url: "https://58a4464faef53.streamlock.net/impd/ngrp:impd_all/chunklist_w1976879677_b796000.m3u8", type: "video" },
    { id: 24, number: 27, name: "Rede Plenitude TV", url: "https://meupainel.top:1936/iaptd/iaptd/chunklist_w1718098717.m3u8", type: "video" },
    { id: 25, number: 28, name: "Fonte TV", url: "https://59fb88a1b1108.streamlock.net/fonte/_definst_/fontetv/chunklist_w1319813731.m3u8", type: "video" },
    { id: 26, number: 29, name: "TV Novo Tempo", url: "https://stream.live.novotempo.com/tv/smil:tvnovotempo.smil/playlist.m3u8", type: "video" },
    { id: 27, number: 30, name: "Euro News", url: "https://www.youtube.com/watch?v=XuZAl-ZPEcA", type: "youtube" },
    { id: 28, number: 31, name: "TV Aberta", url: "https://br5093.streamingdevideo.com.br/tvaberto/tvaberto/playlist.m3u8", type: "video" },
    { id: 29, number: 32, name: "Rede Família", url: "https://tv03.zas.media:1936/rftv/rftv/playlist.m3u8", type: "video" },
    { id: 30, number: 33, name: "BS TV", url: "https://br5093.streamingdevideo.com.br/bstv/bstv/playlist.m3u8", type: "video" },
    { id: 31, number: 34, name: "TV Max 90", url: "https://cdn.jmvstream.com/w/AVJ-15538/playlist/playlist.m3u8", type: "video" },
    { id: 32, number: 35, name: "TV Thathi", url: "https://cdn-grupo-10049.ciclano.io:1443/grupo-10049/grupo-10049/playlist.m3u8", type: "video" },
    { id: 33, number: 36, name: "TV ABC Brasil", url: "https://stmv1.srvstm.com/abc7891/abc7891/playlist.m3u8", type: "video" },
    { id: 34, number: 37, name: "TV Unisantos", url: "https://live.cdn.upx.com/7550/myStream.sdp/playlist.m3u8", type: "video" },
    { id: 35, number: 38, name: "TV Vintage", url: "https://video01.kshost.com.br:4443/rogerio7271/rogerio7271/playlist.m3u8", type: "video" },
    { id: 36, number: 39, name: "Rede TV Mais", url: "https://cdn.jmvstream.com/w/AVJ-15235/playlist/playlist.m3u8", type: "video" },
    { id: 37, number: 40, name: "TV Real Madrid", url: "https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/master.m3u8", type: "video" },
    { id: 38, number: 41, name: "Fox Sports", url: "https://live-news-manifest.tubi.video/live-news-manifest/csm/extlive/tubiprd01,Fox-Sports-Espanol2.m3u8", type: "video" },
    { id: 39, number: 42, name: "RS News Sports", url: "https://video03.logicahost.com.br/rssports4/rssports4/playlist.m3u8", type: "video" },
    { id: 40, number: 43, name: "CBS Sports", url: "https://dai.google.com/linear/hls/event/GxrCGmwST0ixsrc_QgB6qw/master.m3u8", type: "video" },
    { id: 41, number: 44, name: "Rete8 Sport", url: "https://64b16f23efbee.streamlock.net/rete8sport/rete8sport/playlist.m3u8", type: "video" },
    { id: 42, number: 45, name: "Trace Sport Stars", url: "https://lightning-tracesport-samsungau.amagi.tv/playlist1080p.m3u8", type: "video" },
    { id: 43, number: 46, name: "Motor Racing TV", url: "https://d35j504z0x2vu2.cloudfront.net/v1/master/0bc8e8376bd8417a1b6761138aa41c26c7309312/motorracing/master.m3u8", type: "video" },
    { id: 44, number: 47, name: "Sobrenatural TV", url: "https://stream-36723.castr.net/5d714f6a0bd97874e36f14e4/live_057ee4605c1711efbd4135c4457c726c/rewind-3600.m3u8", type: "video" },
    { id: 45, number: 48, name: "TV Futuro", url: "https://tv03.zas.media:1936/tvfuturo/tvfuturo/playlist.m3u8", type: "video" },
    { id: 46, number: 49, name: "TV Internacional", url: "https://raw.githubusercontent.com/ipstreet312/freeiptv/master/ressources/tvipt/sh/tviint.m3u8", type: "video" },
    { id: 47, number: 50, name: "TV Templo", url: "https://664398c.ha.azioncdn.net/primary/tvtemplo_480p.sdp/playlist.m3u8", type: "video" },
    { id: 48, number: 51, name: "Rede Super", url: "https://tv02.zas.media:1936/redesuper/redesuper/playlist.m3u8", type: "video" },
    { id: 49, number: 52, name: "CBS News", url: "https://www.cbsnews.com/common/video/cbsn-ny-prod.m3u8", type: "video" },
    { id: 50, number: 53, name: "SBT Rio", url: "https://www.youtube.com/watch?v=LLpNUqHVam8", type: "youtube" },
    { id: 51, number: 54, name: "Band TV", url: "https://cdn.jmvstream.com/w/LVW-15748/LVW15748_Yed7yzLuRC/playlist.m3u8", type: "video" },
    { id: 52, number: 55, name: "SBT PI", url: "https://stmv1.transmissaodigital.com/cidadeverdenovo/cidadeverdenovo/chunklist_w1550736161.m3u8", type: "video" },
    { id: 53, number: 56, name: "SBT Central", url: "https://www.youtube.com/watch?v=LLpNUqHVam8", type: "youtube" },
    { id: 54, number: 57, name: "Record RN", url: "https://video07.logicahost.com.br/portaldatropical/portaldatropical/chunklist_w1630150607.m3u8", type: "video" },
    { id: 55, number: 58, name: "TV Guará", url: "https://video02.logicahost.com.br/tvguara23/tvguara23/chunklist_w578184061.m3u8", type: "video" },
    { id: 56, number: 59, name: "SBT Ribeirão Preto", url: "https://www.youtube.com/watch?v=wJQUfbr69P0", type: "youtube" },
    { id: 57, number: 60, name: "RIT TV", url: "https://acesso.ecast.site:3648/live/ritlive.m3u8", type: "video" },
    { id: 58, number: 61, name: "CNN Brasil", url: "https://www.youtube.com/watch?v=htZWQlesV-E", type: "youtube" },
    { id: 59, number: 62, name: "TV Pantanal", url: "https://5a2b083e9f360.streamlock.net/tvpantanal/tvpantanal.sdp/chunklist_w1595845833.m3u8", type: "video" },
    { id: 60, number: 63, name: "Câmara Pedro Afonso", url: "https://www.youtube.com/watch?v=5_b3D64oS3A", type: "youtube" },
    { id: 61, number: 64, name: "Record News", url: "https://www.youtube.com/watch?v=OuDca0l0uz0", type: "youtube" },
    { id: 62, number: 65, name: "TV Senado", url: "https://www.youtube.com/watch?v=2XmxELSjlEg", type: "youtube" },
    { id: 63, number: 66, name: "TV Evangelizar", url: "https://tvevangelizar.brasilstream.com.br/hls/tvevangelizar/index.m3u8", type: "video" },
    { id: 64, number: 67, name: "TV ISTV", url: "https://video08.logicahost.com.br/istvnacional/srt.stream/chunklist_w27865936.m3u8", type: "video" },
    { id: 65, number: 68, name: "AWTV", url: "https://streaming.cloudecast.com/hls/awtv/index.m3u8", type: "video" },
    { id: 66, number: 69, name: "TV Aparecida 2", url: "https://www.youtube.com/watch?v=4CAmwaFJo6k", type: "youtube" },
    
    // Audio channels
    { id: 67, number: 70, name: "Rádio Olivença FM", url: "https://server12.srvsh.com.br:8074/stream", type: "audio" },
    { id: 68, number: 71, name: "Rádio Vale FM", url: "https://s37.maxcast.com.br:8058/live", type: "audio" },
    { id: 69, number: 72, name: "Rádio Jovem Palmas", url: "http://sd.dnip.com.br:10422/stream", type: "audio" },
    { id: 70, number: 73, name: "Rádio HCJB", url: "https://streamingecuador.net:8287/hcjb", type: "audio" },
    { id: 71, number: 74, name: "Rádio Ativa FM", url: "http://servidor33.brlogic.com:8224/live", type: "audio" },
    { id: 72, number: 75, name: "Rádio Paraiso FM", url: "https://sonicpanel.oficialserver.com/8112/stream", type: "audio" }
];

// API endpoint for all channels (requires API key)
app.get('/api/channels', validateApiKey, (req, res) => {
    const { type, limit, offset } = req.query;
    
    let filteredChannels = channels;
    
    // Filter by type if specified
    if (type && ['video', 'youtube', 'audio'].includes(type)) {
        filteredChannels = channels.filter(channel => channel.type === type);
    }
    
    // Apply pagination
    const startIndex = parseInt(offset) || 0;
    const limitCount = parseInt(limit) || filteredChannels.length;
    const paginatedChannels = filteredChannels.slice(startIndex, startIndex + limitCount);
    
    res.json({
        success: true,
        total: filteredChannels.length,
        count: paginatedChannels.length,
        offset: startIndex,
        channels: paginatedChannels.map(channel => ({
            id: channel.id,
            number: channel.number,
            name: channel.name,
            url: channel.url,
            type: channel.type
        }))
    });
});

// API endpoint for video channels only (requires API key)
app.get('/api/videos', validateApiKey, (req, res) => {
    const videoChannels = channels.filter(channel => 
        channel.type === 'video' || channel.type === 'youtube'
    );
    
    res.json({
        success: true,
        total: videoChannels.length,
        videos: videoChannels.map(channel => ({
            id: channel.id,
            number: channel.number,
            title: channel.name,
            url: channel.url,
            type: channel.type,
            thumbnail: channel.type === 'youtube' 
                ? `https://img.youtube.com/vi/${extractYouTubeId(channel.url)}/maxresdefault.jpg`
                : null
        }))
    });
});

// API endpoint for audio channels only (requires API key)
app.get('/api/audio', validateApiKey, (req, res) => {
    const audioChannels = channels.filter(channel => channel.type === 'audio');
    
    res.json({
        success: true,
        total: audioChannels.length,
        stations: audioChannels.map(channel => ({
            id: channel.id,
            number: channel.number,
            name: channel.name,
            url: channel.url,
            type: channel.type
        }))
    });
});

// API endpoint for single channel by ID (requires API key)
app.get('/api/channels/:id', validateApiKey, (req, res) => {
    const channelId = parseInt(req.params.id);
    const channel = channels.find(c => c.id === channelId);
    
    if (!channel) {
        return res.status(404).json({
            success: false,
            error: 'Channel not found'
        });
    }
    
    res.json({
        success: true,
        channel: {
            id: channel.id,
            number: channel.number,
            name: channel.name,
            url: channel.url,
            type: channel.type
        }
    });
});

// Generate API key endpoint (for development/testing)
app.post('/api/generate-key', (req, res) => {
    const newKey = crypto.randomBytes(32).toString('hex');
    res.json({
        success: true,
        message: 'New API key generated (for development only)',
        api_key: newKey,
        note: 'In production, use environment variable API_KEY'
    });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        name: 'Roku Streaming API',
        version: '2.0.0',
        description: 'API for streaming channels with M3U8, YouTube and audio support',
        authentication: 'API Key required in header "x-api-key" or query parameter "api_key"',
        endpoints: {
            'GET /api/channels': {
                description: 'Get all channels',
                parameters: {
                    type: 'Filter by type (video, youtube, audio)',
                    limit: 'Limit number of results',
                    offset: 'Offset for pagination'
                }
            },
            'GET /api/videos': 'Get video channels only',
            'GET /api/audio': 'Get audio channels only',
            'GET /api/channels/:id': 'Get specific channel by ID',
            'POST /api/generate-key': 'Generate new API key (development only)'
        },
        current_api_key: API_KEY,
        total_channels: channels.length,
        channel_types: {
            video: channels.filter(c => c.type === 'video').length,
            youtube: channels.filter(c => c.type === 'youtube').length,
            audio: channels.filter(c => c.type === 'audio').length
        }
    });
});

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
}

// Root endpoint with updated instructions
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Roku Streaming Server v2.0</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
                .status { color: #28a745; font-weight: bold; }
                .endpoint { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0; }
                .code { font-family: monospace; background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
                .api-key { background: #fff3cd; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107; }
                .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
                .stat-card { background: #e3f2fd; padding: 15px; border-radius: 4px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Roku Streaming Server v2.0</h1>
                <p class="status">✅ Servidor rodando com ${channels.length} canais disponíveis!</p>
                
                <div class="stats">
                    <div class="stat-card">
                        <h3>${channels.filter(c => c.type === 'video').length}</h3>
                        <p>Canais M3U8</p>
                    </div>
                    <div class="stat-card">
                        <h3>${channels.filter(c => c.type === 'youtube').length}</h3>
                        <p>Canais YouTube</p>
                    </div>
                    <div class="stat-card">
                        <h3>${channels.filter(c => c.type === 'audio').length}</h3>
                        <p>Rádios</p>
                    </div>
                </div>
                
                <div class="api-key">
                    <strong>🔑 API Key:</strong> <code>${API_KEY}</code><br>
                    <small>Use no header "x-api-key" ou query parameter "api_key"</small>
                </div>
                
                <h2>📺 Endpoints da API:</h2>
                <div class="endpoint">
                    <strong>GET /api/channels</strong><br>
                    Todos os canais (vídeo, YouTube, áudio)<br>
                    <small>Parâmetros: ?type=video|youtube|audio&limit=10&offset=0</small>
                </div>
                <div class="endpoint">
                    <strong>GET /api/videos</strong><br>
                    Apenas canais de vídeo e YouTube
                </div>
                <div class="endpoint">
                    <strong>GET /api/audio</strong><br>
                    Apenas estações de rádio
                </div>
                <div class="endpoint">
                    <strong>GET /api/channels/:id</strong><br>
                    Canal específico por ID
                </div>
                <div class="endpoint">
                    <strong>GET /api/docs</strong><br>
                    Documentação completa da API
                </div>
                
                <h2>🔧 Exemplo de Uso:</h2>
                <div class="endpoint">
                    <code>curl -H "x-api-key: ${API_KEY}" https://seu-dominio.com/api/channels</code>
                </div>
                
                <h2>🌐 Links Úteis:</h2>
                <p>
                    <a href="/streaming" target="_blank">🎬 Página de Streaming</a> |
                    <a href="/api/docs" target="_blank">📖 Documentação da API</a> |
                    <a href="/health" target="_blank">💚 Health Check</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint não encontrado',
        availableEndpoints: [
            '/streaming', 
            '/health', 
            '/api/channels', 
            '/api/videos', 
            '/api/audio',
            '/api/docs'
        ]
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});

app.listen(port, () => {
    console.log(`🚀 Roku Streaming Server v2.0 rodando!`);
    console.log(`📍 Local: http://localhost:${port}`);
    console.log(`🎬 Streaming: http://localhost:${port}/streaming`);
    console.log(`🔑 API Key: ${API_KEY}`);
    console.log(`📊 Total de canais: ${channels.length}`);
    console.log(`   • Vídeo M3U8: ${channels.filter(c => c.type === 'video').length}`);
    console.log(`   • YouTube: ${channels.filter(c => c.type === 'youtube').length}`);
    console.log(`   • Áudio: ${channels.filter(c => c.type === 'audio').length}`);
    console.log(`\n📖 Documentação: http://localhost:${port}/api/docs`);
    console.log(`\n🌐 Para produção, faça deploy em:`);
    console.log(`   • Heroku: https://heroku.com`);
    console.log(`   • Railway: https://railway.app`);
    console.log(`   • Render: https://render.com`);
});