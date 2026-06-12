/* eslint-env browser */
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import Routes from './router';
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

const rootElement = document.getElementById('root');
ReactDOM.render(
	<div>
		<h2>Connecting to Database...</h2>
	</div>,
	rootElement,
);

const mongoUrl = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(mongoUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

client
	.connect()
	.then(() => {
		console.log('Connected successfully to MongoDB using MongoClient');
		// cspell:disable-next-line
		const db = client.db('upstar_music');
		window.db = db;

		// cspell:disable-next-line
		mongoose.connect('mongodb://127.0.0.1/upstar_music', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
		mongoose.connection
			.once('open', () => {
				ReactDOM.render(<App />, rootElement);
			})
			.on('error', error => {
				console.warn('Warning', error);
				ReactDOM.render(
					<div>
						<h2>Database Error:</h2>
						<p>{error.message}</p>
					</div>,
					rootElement,
				);
			});
	})
	.catch(error => {
		console.error('MongoDB connection error using MongoClient:', error);
		ReactDOM.render(
			<div>
				<h2>Failed to connect to MongoDB.</h2>
				<p>
					Is your local MongoDB server running? (Run <code>mongod</code> in your
					terminal)
				</p>
				<p>{error.message}</p>
			</div>,
			rootElement,
		);
	});
