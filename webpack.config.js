const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
 mode: 'development', // Modo de desenvolvimento
 target: 'web', // Garantir que o Webpack será compatível com ambientes de navegador
  entry: './script.js', // Arquivo do JavaScript que vocẽ desenvolve, e que receberá bundle.


 // Saída do bundle
 output: {
   filename: 'bundle.js', //nome do arquivo .js gerado pelo bundler
   path: path.resolve(__dirname, 'dist'), //local onde o arquivo gerado pelo bundler será colocado
   clean: true, // Limpa a pasta dist antes de gerar os novos arquivos
 },


 // Configuração de loaders
 module: {
   rules: [
     {
       test: /\.js$/, // Para arquivos .js
       exclude: /node_modules/,
       use: {
         loader: 'babel-loader',
         options: {
           presets: ['@babel/preset-env'],
         },
       },
     },
     {
       test: /\.css$/, // Para arquivos .css
       use: ['style-loader', 'css-loader'],
     },
   ],
 },


 // Plugins
 plugins: [
   new HtmlWebpackPlugin({
     template: './index.html', // Arquivo HTML que será usado como template para o build


   }),
 ],


 // Configuração do servidor de desenvolvimento webpack-server
 devServer: {
   static: {
     // Diretório para servir os arquivos, ele olhará os arquivos nesse diretório e realizará as conexões import sem dar build
     directory: path.join(__dirname, '/'),  // directory: path.join(__dirname, '/src/'),
   },
   hot: true, // Habilitar Hot Module Replacement
   open: true, // Abrir o navegador automaticamente
   port: 9000, // Porta onde o servidor irá rodar
   // Monitorar mudanças em arquivos JS, CSS, e HTML, e atualiza a página. 
   //ex: watchFiles: ['./src/*.html', './src/*.js', './src/*.css']
   watchFiles: ['./*.html', './*.js', './*.css'],
 },
};
