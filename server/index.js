import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3111;
const host = process.env.HOST || '0.0.0.0'; // Escuta em todas as interfaces

// Middleware
app.use(cors({
    origin: '*', // Permite acesso de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false
}));

app.use(express.static('.'));
app.use(express.static('pages'));
app.use(express.json());

// Função para obter todos os IPs da máquina
function getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(interfaces)) {
        for (const networkInterface of interfaces[name]) {
            // Pula interfaces internas e IPv6
            if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
                addresses.push({
                    name: name,
                    address: networkInterface.address,
                    netmask: networkInterface.netmask,
                    mac: networkInterface.mac
                });
            }
        }
    }
    
    return addresses;
}

// Health check endpoint com informações de rede
app.get('/health', (req, res) => {
    const networkInfo = getNetworkInterfaces();
    
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Roku Streaming Server',
        server: {
            host: host,
            port: port,
            environment: process.env.NODE_ENV || 'development'
        },
        network: {
            interfaces: networkInfo,
            accessUrls: networkInfo.map(iface => `http://${iface.address}:${port}`)
        },
        endpoints: {
            streaming: '/streaming',
            health: '/health',
            videos: '/api/videos',
            network: '/network-info',
            privacy: '/privacy-policy',
            terms: '/terms-of-service',
            support: '/support',
            about: '/about',
            contact: '/contact',
            apiDocs: '/api-docs'
        }
    });
});

// Endpoint específico para informações de rede
app.get('/network-info', (req, res) => {
    const networkInfo = getNetworkInterfaces();
    
    res.json({
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        interfaces: networkInfo,
        streamingUrls: networkInfo.map(iface => ({
            interface: iface.name,
            url: `http://${iface.address}:${port}/streaming`,
            network: `${iface.address}/${iface.netmask}`
        })),
        rokuConfiguration: {
            primaryUrl: networkInfo.length > 0 ? `http://${networkInfo[0].address}:${port}/streaming` : `http://localhost:${port}/streaming`,
            alternativeUrls: networkInfo.slice(1).map(iface => `http://${iface.address}:${port}/streaming`)
        }
    });
});

// Main streaming page for Roku
app.get('/streaming', (req, res) => {
    res.sendFile(path.join(__dirname, 'streaming.html'));
});

// API endpoint for video sources
app.get('/api/videos', (req, res) => {
    res.json({
        videos: [
            {
                id: 1,
                title: "Big Buck Bunny",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
                duration: "10:34",
                description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.",
                genre: "Animation",
                year: 2008
            },
            {
                id: 2,
                title: "Elephants Dream",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
                duration: "10:53",
                description: "The first Blender Open Movie from 2006",
                genre: "Animation",
                year: 2006
            },
            {
                id: 3,
                title: "For Bigger Blazes",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
                duration: "15:10",
                description: "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV.",
                genre: "Commercial",
                year: 2013
            },
            {
                id: 4,
                title: "For Bigger Fun",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
                duration: "1:00",
                description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV.",
                genre: "Commercial",
                year: 2013
            },
            {
                id: 5,
                title: "For Bigger Joyrides",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
                duration: "1:15",
                description: "Introducing Chromecast. The easiest way to enjoy online video and music on your TV.",
                genre: "Commercial",
                year: 2013
            }
        ],
        total: 5,
        apiVersion: "1.0",
        lastUpdated: new Date().toISOString()
    });
});

// API endpoint for single video
app.get('/api/videos/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const videos = [
        {
            id: 1,
            title: "Big Buck Bunny",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
            duration: "10:34",
            description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.",
            genre: "Animation",
            year: 2008
        },
        {
            id: 2,
            title: "Elephants Dream",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
            duration: "10:53",
            description: "The first Blender Open Movie from 2006",
            genre: "Animation",
            year: 2006
        },
        {
            id: 3,
            title: "For Bigger Blazes",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
            duration: "15:10",
            description: "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV.",
            genre: "Commercial",
            year: 2013
        }
    ];
    
    const video = videos.find(v => v.id === videoId);
    
    if (video) {
        res.json(video);
    } else {
        res.status(404).json({
            error: 'Video não encontrado',
            videoId: videoId,
            availableIds: videos.map(v => v.id)
        });
    }
});

// Páginas legais e informativas
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'privacy-policy.html'));
});

app.get('/terms-of-service', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'terms-of-service.html'));
});

app.get('/support', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'support.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});

app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'api-docs.html'));
});

// Root endpoint com network information e exemplos da API
app.get('/', (req, res) => {
    const networkInfo = getNetworkInterfaces();
    const streamingUrls = networkInfo.map(iface => `http://${iface.address}:${port}/streaming`);
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Roku Streaming Server - API Completa</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; 
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: #333;
                }
                .container { 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 40px; 
                    border-radius: 15px; 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                }
                .status { 
                    color: #28a745; 
                    font-weight: bold; 
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .status::before {
                    content: "✅";
                    font-size: 24px;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 30px;
                    margin: 30px 0;
                }
                .card {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    border-left: 5px solid #007bff;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }
                .card h3 {
                    margin-top: 0;
                    color: #007bff;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .endpoint { 
                    background: #e8f5e8;
                    padding: 15px; 
                    border-radius: 8px; 
                    margin: 10px 0; 
                    border-left: 4px solid #28a745;
                    font-family: 'Monaco', 'Menlo', monospace;
                }
                .code { 
                    font-family: 'Monaco', 'Menlo', monospace;
                    background: #f1f3f4; 
                    padding: 15px; 
                    border-radius: 8px; 
                    font-size: 14px;
                    overflow-x: auto;
                    border: 1px solid #e0e0e0;
                }
                .url-list {
                    background: #fff3cd;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #ffc107;
                }
                .url-item {
                    margin: 8px 0;
                    padding: 12px;
                    background: white;
                    border-radius: 6px;
                    font-family: monospace;
                    border: 1px solid #e0e0e0;
                }
                .api-examples {
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #2196f3;
                }
                .language-tab {
                    display: inline-block;
                    padding: 8px 16px;
                    margin: 5px;
                    background: #007bff;
                    color: white;
                    border-radius: 20px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: bold;
                }
                .language-tab:hover {
                    background: #0056b3;
                    color: white;
                }
                .network-info {
                    background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #28a745;
                }
                .quick-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 20px 0;
                }
                .quick-link {
                    padding: 12px 20px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                .quick-link:hover {
                    background: #0056b3;
                    transform: translateY(-2px);
                    color: white;
                }
                .highlight { 
                    background: #fff3cd; 
                    padding: 3px 6px; 
                    border-radius: 4px;
                    font-weight: bold;
                }
                @media (max-width: 768px) {
                    .container { padding: 20px; }
                    .grid { grid-template-columns: 1fr; }
                    .quick-links { justify-content: center; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Roku Streaming Server</h1>
                    <p class="status">Servidor Multi-Rede Ativo</p>
                    <div class="quick-links">
                        <a href="/streaming" class="quick-link">🎬 Testar Streaming</a>
                        <a href="/api-docs" class="quick-link">📚 Documentação API</a>
                        <a href="/health" class="quick-link">💚 Status do Servidor</a>
                        <a href="/support" class="quick-link">🛠️ Suporte</a>
                    </div>
                </div>

                <div class="network-info">
                    <h3>🌐 Informações de Rede</h3>
                    <p><strong>Servidor:</strong> ${os.hostname()}</p>
                    <p><strong>Plataforma:</strong> ${os.platform()} (${os.arch()})</p>
                    <p><strong>Escutando em:</strong> <span class="highlight">${host}:${port}</span></p>
                    <p><strong>Ambiente:</strong> ${process.env.NODE_ENV || 'development'}</p>
                </div>

                <div class="grid">
                    <div class="card">
                        <h3>📺 URLs de Streaming Disponíveis</h3>
                        <div class="url-list">
                            ${streamingUrls.length > 0 ? streamingUrls.map((url, index) => `
                                <div class="url-item">
                                    <strong>Interface ${index + 1}:</strong><br>
                                    <a href="${url}" target="_blank">${url}</a>
                                </div>
                            `).join('') : '<div class="url-item">http://localhost:' + port + '/streaming</div>'}
                        </div>
                        
                        <h4>🔧 Configuração no Roku:</h4>
                        <div class="code">streamingUrl = "${streamingUrls[0] || `http://localhost:${port}/streaming`}"</div>
                    </div>

                    <div class="card">
                        <h3>🛠️ Endpoints da API</h3>
                        <div class="endpoint"><strong>Streaming:</strong> /streaming</div>
                        <div class="endpoint"><strong>Vídeos:</strong> /api/videos</div>
                        <div class="endpoint"><strong>Vídeo específico:</strong> /api/videos/:id</div>
                        <div class="endpoint"><strong>Health Check:</strong> /health</div>
                        <div class="endpoint"><strong>Rede:</strong> /network-info</div>
                        <div class="endpoint"><strong>Privacidade:</strong> /privacy-policy</div>
                        <div class="endpoint"><strong>Termos:</strong> /terms-of-service</div>
                        <div class="endpoint"><strong>Suporte:</strong> /support</div>
                    </div>
                </div>

                <div class="card">
                    <h3>💻 Exemplos de Uso da API</h3>
                    <div class="api-examples">
                        <h4>Linguagens Suportadas:</h4>
                        <a href="#" class="language-tab">JavaScript</a>
                        <a href="#" class="language-tab">Node.js</a>
                        <a href="#" class="language-tab">Python</a>
                        <a href="#" class="language-tab">PHP</a>
                        <a href="#" class="language-tab">cURL</a>
                        <a href="#" class="language-tab">Java</a>
                        <a href="#" class="language-tab">C#</a>
                        
                        <h4>Exemplo JavaScript/Fetch:</h4>
                        <div class="code">
// Buscar todos os vídeos
const response = await fetch('${streamingUrls[0] || `http://localhost:${port}`}/api/videos');
const data = await response.json();
console.log(data.videos);

// Buscar vídeo específico
const video = await fetch('${streamingUrls[0] || `http://localhost:${port}`}/api/videos/1');
const videoData = await video.json();
console.log(videoData);
                        </div>

                        <h4>Exemplo Node.js:</h4>
                        <div class="code">
const axios = require('axios');

async function getVideos() {
    try {
        const response = await axios.get('${streamingUrls[0] || `http://localhost:${port}`}/api/videos');
        return response.data.videos;
    } catch (error) {
        console.error('Erro:', error.message);
    }
}
                        </div>

                        <h4>Exemplo Python:</h4>
                        <div class="code">
import requests

def get_videos():
    response = requests.get('${streamingUrls[0] || `http://localhost:${port}`}/api/videos')
    if response.status_code == 200:
        return response.json()['videos']
    return None

videos = get_videos()
print(videos)
                        </div>

                        <h4>Exemplo cURL:</h4>
                        <div class="code">
# Buscar todos os vídeos
curl -X GET "${streamingUrls[0] || `http://localhost:${port}`}/api/videos"

# Buscar vídeo específico
curl -X GET "${streamingUrls[0] || `http://localhost:${port}`}/api/videos/1"

# Health check
curl -X GET "${streamingUrls[0] || `http://localhost:${port}`}/health"
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="card">
                        <h3>📱 Casos de Uso</h3>
                        <ul>
                            <li><strong>Apps Mobile:</strong> Integração com aplicativos iOS/Android</li>
                            <li><strong>Websites:</strong> Player de vídeo em sites</li>
                            <li><strong>Smart TVs:</strong> Canais para diferentes plataformas</li>
                            <li><strong>Sistemas CMS:</strong> Gestão de conteúdo de vídeo</li>
                            <li><strong>APIs Terceiros:</strong> Integração com outros serviços</li>
                            <li><strong>Automação:</strong> Scripts e bots para conteúdo</li>
                        </ul>
                    </div>

                    <div class="card">
                        <h3>🚀 Deploy em Produção</h3>
                        <ul>
                            <li><strong>Render.com:</strong> Deploy gratuito automático</li>
                            <li><strong>Heroku:</strong> Plataforma robusta</li>
                            <li><strong>Railway:</strong> Deploy simplificado</li>
                            <li><strong>Vercel:</strong> Edge functions</li>
                            <li><strong>DigitalOcean:</strong> VPS personalizado</li>
                            <li><strong>AWS/GCP:</strong> Cloud enterprise</li>
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <h3>📋 Páginas Legais (Roku Store)</h3>
                    <div class="quick-links">
                        <a href="/privacy-policy" class="quick-link">🔒 Política de Privacidade</a>
                        <a href="/terms-of-service" class="quick-link">📜 Termos de Uso</a>
                        <a href="/support" class="quick-link">🛠️ Suporte</a>
                        <a href="/about" class="quick-link">ℹ️ Sobre</a>
                        <a href="/contact" class="quick-link">📧 Contato</a>
                    </div>
                </div>

                <div class="network-info">
                    <h3>💡 Dicas de Desenvolvimento</h3>
                    <ul>
                        <li>✅ <strong>CORS habilitado</strong> para todas as origens</li>
                        <li>✅ <strong>Multi-rede</strong> - acessível de qualquer dispositivo</li>
                        <li>✅ <strong>API RESTful</strong> com responses JSON</li>
                        <li>✅ <strong>Error handling</strong> robusto</li>
                        <li>✅ <strong>Health checks</strong> para monitoramento</li>
                        <li>✅ <strong>Documentação completa</strong> da API</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
                    <p><strong>🎯 Roku Streaming Server v1.0</strong></p>
                    <p>Desenvolvido para máxima compatibilidade e facilidade de uso</p>
                    <p><em>Acesse <a href="/api-docs">/api-docs</a> para documentação completa</em></p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint não encontrado',
        availableEndpoints: [
            '/streaming', 
            '/health', 
            '/api/videos', 
            '/api/videos/:id',
            '/network-info',
            '/privacy-policy',
            '/terms-of-service',
            '/support',
            '/about',
            '/contact',
            '/api-docs'
        ],
        requestedUrl: req.originalUrl,
        method: req.method
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(port, host, () => {
    const networkInfo = getNetworkInterfaces();
    
    console.log(`🚀 Servidor Roku Streaming iniciado!`);
    console.log(`📍 Host: ${host} (todas as interfaces)`);
    console.log(`🔌 Porta: ${port}`);
    console.log(`\n🌐 URLs de acesso disponíveis:`);
    
    // Mostrar localhost
    console.log(`   • Local: http://localhost:${port}`);
    console.log(`   • Streaming: http://localhost:${port}/streaming`);
    
    // Mostrar todas as interfaces de rede
    if (networkInfo.length > 0) {
        console.log(`\n📡 Interfaces de rede detectadas:`);
        networkInfo.forEach((iface, index) => {
            console.log(`   ${index + 1}. ${iface.name}: http://${iface.address}:${port}`);
            console.log(`      Streaming: http://${iface.address}:${port}/streaming`);
            console.log(`      Rede: ${iface.address}/${iface.netmask}`);
        });
        
        console.log(`\n🎯 Para configurar no Roku, use:`);
        console.log(`   streamingUrl = "http://${networkInfo[0].address}:${port}/streaming"`);
    }
    
    console.log(`\n💡 Dicas:`);
    console.log(`   • Acesse /health para ver todas as informações de rede`);
    console.log(`   • Acesse /network-info para configuração detalhada`);
    console.log(`   • Acesse /api-docs para documentação completa da API`);
    console.log(`   • O servidor está acessível de qualquer dispositivo na rede`);
    
    console.log(`\n📚 Páginas disponíveis:`);
    console.log(`   • Privacidade: /privacy-policy`);
    console.log(`   • Termos: /terms-of-service`);
    console.log(`   • Suporte: /support`);
    console.log(`   • Sobre: /about`);
    console.log(`   • Contato: /contact`);
    
    console.log(`\n🌐 Para produção, faça deploy em:`);
    console.log(`   • Render: https://render.com (recomendado)`);
    console.log(`   • Heroku: https://heroku.com`);
    console.log(`   • Railway: https://railway.app`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Recebido SIGTERM, encerrando servidor graciosamente...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Recebido SIGINT, encerrando servidor graciosamente...');
    process.exit(0);
});