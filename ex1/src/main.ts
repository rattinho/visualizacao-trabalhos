import D3jsDados from './dash';
import './style.css'
import { Taxi, type ITaxi } from './taxi';

let app = new D3jsDados(600, 400);


async function run() {
  const taxi = new Taxi();
  
      await taxi.init();
      await taxi.loadTaxi();
  
      const sql = `
SELECT
  EXTRACT(DOW FROM lpep_pickup_datetime) AS dia_semana,
  SUM(tip_amount) AS total_tip_amount
FROM
  taxi_2023
GROUP BY
  dia_semana
ORDER BY
  dia_semana;

      `;
  

  
  const data = await taxi.query(sql);

  console.log(data)
  data.forEach((row: any) => {
    row.dia_semana = Number(row.dia_semana)
  })
  app.attScaleY(data, 'total_tip_amount')
  app.attScaleX(data, 'dia_semana')

  data.forEach((row: any, idx:number) => {
    app.createSquare(row.total_tip_amount, idx);
  })

  app.attEixos()
  
  
}

document.addEventListener('DOMContentLoaded', () => {
  run()
})





