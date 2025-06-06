import D3jsLinhasAgrupadas from '../dashLinesGruped';
import { Taxi } from '../taxi';

export default async function Dash3(taxi: Taxi) {
  // SQL para receita média por corrida por dia da semana
  const sql = `
      SELECT
    EXTRACT(HOUR FROM lpep_pickup_datetime) AS pickup_hour,
    AVG(tip_amount) AS avg_tip_amount
    FROM
        taxi_2023
    GROUP BY
        pickup_hour
    ORDER BY
        pickup_hour;
    `;

  const resultado = await taxi.query(sql);

const nomesHoras = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const coresPorHora = nomesHoras.reduce((acc, hora, i) => {
  acc[hora] = `hsl(${(i / 24) * 360}, 70%, 60%)`;
  return acc;
}, {} as Record<string, string>);

const dados = resultado.map((d: any) => {
  const pickupHour = Number(d.pickup_hour);
  const avgTipAmount = Number(d.avg_tip_amount);
  const hora = nomesHoras[pickupHour];

  return {
    grupo: hora,
    categoria: 'Gorjeta Média',
    valor: avgTipAmount,
    ordem: pickupHour,
    color: coresPorHora[hora],
  };
}).sort((a: { ordem: number; }, b: { ordem: number; }) => a.ordem - b.ordem);

const app = new D3jsLinhasAgrupadas(900, 405, '#view3');
app.attScale(dados);
app.attEixos();
app.createLines(dados);
app.createLegends(
  'Gorjeta média por horário de pickup (USD)',
  'Horário do Dia'
);

}
