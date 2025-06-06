import D3jsBarrasEmpilhadas from '../dashStackedBar';
import { Taxi } from '../taxi';

export default async function Dash2(taxi: Taxi) {
  const sql = `
    SELECT
      EXTRACT(DOW FROM lpep_pickup_datetime) AS dia_semana,
      CASE
        WHEN EXTRACT(HOUR FROM lpep_pickup_datetime) BETWEEN 5 AND 11 THEN 'Manha'
        WHEN EXTRACT(HOUR FROM lpep_pickup_datetime) BETWEEN 12 AND 17 THEN 'Tarde'
        ELSE 'Noite'
      END AS turno,
      AVG((EXTRACT(EPOCH FROM lpep_dropoff_datetime) - EXTRACT(EPOCH FROM lpep_pickup_datetime)) / 60.0) AS duracao_media
    FROM
      taxi_2023
    GROUP BY
      dia_semana, turno
    ORDER BY
      dia_semana, turno;
  `;

  const resultado = await taxi.query(sql);

  const nomesDias = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  const coresPorTurno: Record<string, string> = {
    Manha: '#FFD166',
    Tarde: '#06D6A0',
    Noite: '#118AB2',
  };

  const dados = resultado.map((d: any) => ({
    grupo: nomesDias[d.dia_semana],
    categoria: d.turno,
    valor: +d.duracao_media,
    color: coresPorTurno[d.turno],
  }));

  const app = new D3jsBarrasEmpilhadas(600, 400, '#view2');
  app.attScale(dados);
  app.attEixos();
  app.createBars();
  app.createTurnoLegend();
  app.createLegends('Duração Média (min)', 'Dias da Semana');
}
