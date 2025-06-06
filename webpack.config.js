process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

let config = {
  context: path.join(__dirname, '/src'), // Директория с исходным кодом приложения
  entry: 'index.js', // Главный файл приложения
  output: {
    path: path.join(__dirname, 'build'), // Change output to build for Netlify
    filename: '[name].js', // Шаблон для названия файлов
    clean: true, // Очистить ./build перед сборкой
    publicPath: '/', // Add public path for routing
  },
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.jsx'], // расширения по умолчанию если не указаны в import
    modules: ['./', 'node_modules'], // Где искать файлы подключаемых модулей (пакетов)
  },
  module: {
    rules: [
      // Транспиляция JS/JSX
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      // Правила обработки подключаемых файлов
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: {} },
          { loader: 'css-loader', options: { url: true, import: true } },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(), // Плагин для вытаскивания собранных стилей в отдельный файл
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html',
      title: 'Simple SPA',
      base: '/',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'inline-source-map';
  config.devServer = {
    static: path.join(__dirname, 'build'),
    port: 8010,
    historyApiFallback: true,
    proxy: [
      {
        context: '/api/**',
        target: 'http://query.rest',
        secure: false,
        changeOrigin: true,
      },
    ],
  };
}

module.exports = config;
