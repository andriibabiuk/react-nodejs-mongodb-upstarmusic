import _ from 'lodash';
import faker from 'faker';
import { MongoClient } from 'mongodb';
import { GENRES } from './constants';

const MINIMUM_ARTISTS = 2;
const ARTISTS_TO_ADD = 15;

let artistsCollection;

MongoClient.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log('Connected successfully to server');
    const db = client.db('upstar_music');
    artistsCollection = db.collection('artists');
    return artistsCollection.countDocuments({});
  })
  .then((count) => {
    if (count < MINIMUM_ARTISTS) {
      const artists = _.times(ARTISTS_TO_ADD, () => createArtist());

      artistsCollection.insertMany(artists);
    }
  })
  .catch((e) => console.log(e));

function createArtist() {
  const uniqueId =
    Math.random().toString(36).slice(2) + Date.now().toString(36);

  return {
    name: faker.name.findName(),
    age: randomBetween(15, 45),
    yearsActive: randomBetween(0, 15),
    image: getArtistImage(),
    genre: getGenre(),
    website: faker.internet.url(),
    netWorth: randomBetween(0, 5000000),
    labelName: faker.company.companyName(),
    retired: faker.random.boolean(),
    albums: getAlbums(),
    image: getArtistImage(uniqueId),
  };
}

function getArtistImage(id) {
  const width = 300;
  const height = 300;

  return `https://picsum.photos/seed/${id}/${width}/${height}`;
}

function getAlbums() {
  return _.times(randomBetween(0, 5), () => {
    const uniqueId =
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    const copiesSold = randomBetween(0, 1000000);

    return {
      title: _.capitalize(faker.random.words()),
      date: faker.date.past(),
      copiesSold,
      numberTracks: randomBetween(1, 20),
      image: getAlbumImage(uniqueId),
      revenue: copiesSold * 12.99,
    };
  });
}

function getAlbumImage(id) {
  const width = 300;
  const height = 300;
  return `https://picsum.photos/seed/${id}/${width}/${height}`;
}

function getGenre() {
  return randomEntry(GENRES);
}

function randomEntry(array) {
  return array[~~(Math.random() * array.length)];
}

function randomBetween(min, max) {
  return ~~(Math.random() * (max - min)) + min;
}
