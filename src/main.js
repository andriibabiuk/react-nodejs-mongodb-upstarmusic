import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { MongoClient } from 'mongodb';
import reducers from './reducers';
import Routes from './router';
import mongoose from 'mongoose';
import './seeds';

mongoose.Promise = global.Promise;

const App = () => {
  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

const mongoUrl = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    console.log('Connected successfully to MongoDB using MongoClient');
    const db = client.db('upstar_music');
    window.db = db;

    mongoose.connect('mongodb://localhost/upstar_music', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    mongoose.connection
      .once('open', () => {
        ReactDOM.render(<App />, document.getElementById('root'));
      })
      .on('error', (error) => {
        console.warn('Warning', error);
      });
  })
  .catch((error) => {
    console.error('MongoDB connection error using MongoClient:', error);
  });
