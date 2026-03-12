const isProduction = import.meta.env.PROD;

const prod = "https://to-be-assigned";
const dev = "http://localhost:5233";
export const baseUrl = isProduction ? prod : dev;