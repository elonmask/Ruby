const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const dev = process.env.NODE_ENV === "development";

const forCss = (loader) => {
  const defaultSettings = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: dev,
        reloadAll: dev,
      },
    },
    "css-loader",
  ];

  if (loader) {
    defaultSettings.push(loader);
  }

  return defaultSettings;
};

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "rubybet"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: forCss(),
      },
      {
        test: /\.less$/,
        use: forCss("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: forCss("sass-loader"),
      },
      {
        test: /\.(png|jpg|svg|gif|ico)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/transform-runtime",
              "import-directory",
            ],
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "main.[hash].css",
    }),
  ],
};
