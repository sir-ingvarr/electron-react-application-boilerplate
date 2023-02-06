import path from "path";

const { env } = process;
export default {
    isDev: env.DEVELOPMENT === 'true',
    webViewSource: env.DEVELOPMENT === 'true'
        ? 'http://localhost:3000'
        : `file://${path.resolve('../renderer/public/index.html')}`
}
