export default {
    app: {
        port: 5000,
        host: "localhost",
        api_url: 'http://localhost:5000',
        client_url: 'http://localhost:3000',
        api_version: "1.0.0"
    },
    db: {
        dbUri: "mongodb://localhost:27017/react-blog-app",
    },
    jwt: {
        secret: "my-secret-word-123",
        expiresIn: '30d'
    },
    file: {
        //максимальная длина нзвания файла в байтах
        fieldNameSize: 10,
        //3MB максимальный размер одного файла
        fileSize: 3 * 1024*1024,
    }
}