// Swagger/OpenAPI 설정 파일
// 추후 swagger-ui-express 또는 다른 문서화 도구 설치 시 사용

export const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DesignSync API',
      version: '1.0.0',
      description: 'DesignSync Backend API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // API 경로
}

// TODO: swagger-ui-express 설치 후 활성화
// import swaggerUi from 'swagger-ui-express'
// import swaggerJsdoc from 'swagger-jsdoc'
// const swaggerSpec = swaggerJsdoc(swaggerConfig)

