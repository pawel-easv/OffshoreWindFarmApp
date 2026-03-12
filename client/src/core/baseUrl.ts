const isProduction = import.meta.env.PROD;

const prod = "https://windfarm-server.fly.dev";
const dev = "http://localhost:5233";
export const baseUrl = isProduction ? prod : dev;