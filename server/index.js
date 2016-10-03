import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack/webpack.config.js';
import webpackMiddleware from 'webpack-dev-middleware';
import logger from 'morgan';
import open from 'open';

const app = express();
const routes = express.Router();
const port = process.env.PORT || 4000;
const compiler = webpack(config);
const assetFolder = config.output.publicPath;

// Only load this middleware in dev mode
if(app.get('env') === 'development') {
  routes.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  routes.use(require('webpack-hot-middleware')(compiler));
};

// serve static files
routes.use(express.static(assetFolder));

// make sure this is always last
routes.get('*', function(req, res) {
  res.sendFile(path.join(assetFolder + '/index.html'));
});

// Parse incoming request bodies as JSON
app.use(require('body-parser').json());

// Mount our main router
app.use('/', routes);

app.listen(port, function(err) {
  if(err){
    console.log(err)
  } else {
    open(`http://localhost:${port}`);
    console.log('listening on port 4000...');
  }
});

