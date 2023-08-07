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
  
const read = async (id) => {
    try {
      const query = `update instapaper_queue set read = true where id = ${id};
      select * from instapaper_queue where read = false and (delayTill < current_date or delayTill is null) limit 1`;
      let result = await pool.query(query);
      //console.log(result[1]);
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
  //console.log(body)
  let resp = await read(body.id)
	return {
		statusCode: 200,
		body: JSON.stringify(resp)
	}
}