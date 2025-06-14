import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3111;

// Middleware
app.use(cors());
app.use(express.static('.'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Roku Streaming Server'
    });
});

// Main streaming page for Roku
app.get('/streaming', (req, res) => {
    res.sendFile(path.join(__dirname, 'streaming.html'));
});

// API endpoint for video sources (opcional para futuras expansões)
app.get('/api/videos', (req, res) => {
    res.json({
        videos: [
            {
                id: 1,
                title: "Big Buck Bunny",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            },
            {
                id: 2,
                title: "Elephants Dream",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
            }
        ]
    });
});

// Root endpoint with instructions
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Roku Streaming Server</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
                .status { color: #28a745; font-weight: bold; }
                .endpoint { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0; }
                .code { font-family: monospace; background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Roku Streaming Server</h1>
                <p class="status">✅ Servidor rodando com sucesso!</p>
                
                <h2>📺 Endpoints Disponíveis:</h2>
                <div class="endpoint">
                    <strong>Página de Streaming:</strong><br>
                    <code>/streaming</code> - Página HTML otimizada para Roku TV
                </div>
                <div class="endpoint">
                    <strong>Health Check:</strong><br>
                    <code>/health</code> - Status do servidor
                </div>
                <div class="endpoint">
                    <strong>API de Vídeos:</strong><br>
                    <code>/api/videos</code> - Lista de vídeos disponíveis
                </div>
                
                <h2>🔧 Configuração do Canal Roku:</h2>
                <p>No arquivo <code>components/MainScene.brs</code>, configure a URL:</p>
                <div class="endpoint">
                    <code>streamingUrl = "https://SEU_DOMINIO.com/streaming"</code>
                </div>
                
                <h2>🌐 Deploy Recomendado:</h2>
                <ul>
                    <li><strong>Heroku:</strong> Deploy gratuito com Git</li>
                    <li><strong>Railway:</strong> Deploy automático</li>
                    <li><strong>Render:</strong> Hospedagem gratuita</li>
                    <li><strong>Vercel:</strong> Para aplicações Node.js</li>
                </ul>
                
                <p><a href="/streaming" target="_blank">🎬 Testar Página de Streaming</a></p>
            </div>
        </body>
        </html>
    `);
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint não encontrado',
        availableEndpoints: ['/streaming', '/health', '/api/videos']
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor Roku Streaming rodando!`);
    console.log(`📍 Local: http://localhost:${port}`);
    console.log(`🎬 Streaming: http://localhost:${port}/streaming`);
    console.log(`💚 Health: http://localhost:${port}/health`);
    console.log(`\n🌐 Para produção, faça deploy em:`);
    console.log(`   • Heroku: https://heroku.com`);
    console.log(`   • Railway: https://railway.app`);
    console.log(`   • Render: https://render.com`);
});