//@ts-nocheck
import { loadDb } from './config';

export interface ITaxi {
    "VendorID": number,
    "lpep_pickup_datetime": number,
    "lpep_dropoff_datetime": number,
    "store_and_fwd_flag": string,
    "RatecodeID": number,
    "PULocationID": number,
    "DOLocationID": number,
    "passenger_count": number,
    "trip_distance": number,
    "fare_amount": number,
    "extra": number,
    "mta_tax": number,
    "tip_amount": number,
    "tolls_amount": number,
    "ehail_fee": number,
    "improvement_surcharge": number,
    "total_amount": number,
    "payment_type": number,
    "trip_type": number,
    "congestion_surcharge": number,
}

export class Taxi {
    async init() {
        this.db = await loadDb();
        this.conn = await this.db.connect();

        this.color = "green";
        this.table = 'taxi_2023';
    }

    async loadTaxi(months = 6) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const files = [];

        for (let id = 1; id <= months; id++) {
            const sId = String(id).padStart(2, '0')
            files.push({ key: `Y2023M${sId}`, url: `${this.color}/${this.color}_tripdata_2023-${sId}.parquet` });

            const res = await fetch(files[files.length - 1].url);
            await this.db.registerFileBuffer(files[files.length - 1].key, new Uint8Array(await res.arrayBuffer()));
        }

        await this.conn.query(`
            CREATE TABLE ${this.table} AS
                SELECT * 
                FROM read_parquet([${files.map(d => d.key).join(",")}]);
        `);
    }

    async query(sql) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        let result = await this.conn.query(sql);
        return result.toArray().map(row => row.toJSON());
    }

    async test(limit = 10) {
        if (!this.db || !this.conn)
            throw new Error('Database not initialized. Please call init() first.');

        const sql = `
                SELECT * 
                FROM ${this.table}
                LIMIT ${limit}
            `;

        return await this.query(sql);
    }
}