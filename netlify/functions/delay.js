import {Pool} from 'pg'

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.connect((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Successfully connected to host');
    }
  });
  
const delay = async (id) => {
    try {
      const query = `update instapaper_queue set delayTill = CURRENT_DATE + INTERVAL '7 days' where id = ${id};
      select * from instapaper_queue where read = false and deleted = false (delayTill < current_date or delayTill is null) order by random() limit 1`;
      let result = await pool.query(query);
      //console.log(result);
      if(result.length == 2) {
        let rows = result[1].rows
        if(rows.length > 0) {
          return rows[0];
        }
      }
      return {};
    } catch (err) {
      console.log(err.stack);
    }
  };

export const handler = async (event, context) => {
  var body = JSON.parse(event.body)
	return {
		statusCode: 200,
		body: JSON.stringify(await delay(body.id))
	}
}