"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// 환경변수 로드
dotenv_1.default.config();
// Express 앱 생성
const app = (0, express_1.default)();
// CORS 설정
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = CORS_ORIGIN.includes(',')
    ? CORS_ORIGIN.split(',').map((o) => o.trim())
    : [CORS_ORIGIN];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            callback(new Error(`Not allowed by CORS. Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 라우트 동적 import (빌드된 파일 참조)
const test_routes_1 = __importDefault(require("../dist/routes/test.routes"));
const projects_routes_1 = __importDefault(require("../dist/routes/projects.routes"));
const designs_routes_1 = __importDefault(require("../dist/routes/designs.routes"));
const auth_routes_1 = __importDefault(require("../dist/routes/auth.routes"));
const feedbacks_routes_1 = __importDefault(require("../dist/routes/feedbacks.routes"));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DesignSync API Server' });
});
// API routes
app.use('/api/test', test_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/projects', projects_routes_1.default);
app.use('/api/projects', designs_routes_1.default);
app.use('/api/feedbacks', feedbacks_routes_1.default);
// Error handling middleware
app.use((err, req, res, _next) => {
    console.error('Error:', err.message);
    if (err.stack) {
        console.error('Stack:', err.stack);
    }
    res.status(500).json({ error: 'Internal server error', message: err.message });
});
// Vercel serverless function handler
function handler(req, res) {
    return app(req, res);
}
//# sourceMappingURL=index.js.map