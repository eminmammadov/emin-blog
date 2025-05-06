import { MongoClient, type MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // İnkişaf rejimində, HMR (Hot Module Replacement) səbəbindən
  // modulun yenidən yüklənməsi zamanı dəyərin qorunması üçün qlobal dəyişən istifadə olunur.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // İstehsal rejimində qlobal dəyişən istifadə etmək tövsiyə edilmir.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Modul səviyyəli MongoClient vədini ixrac edin. Bunu ayrıca modulda
// etmək, müştərinin funksiyalar arasında paylaşılmasına imkan verir.
export default clientPromise;
