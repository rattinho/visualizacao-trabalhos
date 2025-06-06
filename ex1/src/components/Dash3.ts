import D3jsBarrasAgrupadas from '../dashBarGruped';
import D3jsLinhasAgrupadas from '../dashLinesGruped';
import { Taxi } from '../taxi';

export default async function Dash3(taxi: Taxi) {
  // SQL para receita média por corrida por dia da semana
  const sql = `
      SELECT
        EXTRACT(DOW FROM lpep_pickup_datetime) AS dia_semana,
        AVG(total_amount) AS receita_media
      FROM
        taxi_2023
      GROUP BY
        dia_semana
      ORDER BY
        dia_semana;
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

  const coresPorDia: Record<string, string> = {
    Domingo: '#FF6384',
    Segunda: '#36A2EB',
    Terça: '#36A2EB',
    Quarta: '#36A2EB',
    Quinta: '#36A2EB',
    Sexta: '#36A2EB',
    Sábado: '#FF6384',
  };

  const dadosNaoOrdenados = resultado.map((d: any) => ({
    grupo: nomesDias[d.dia_semana],
    categoria: 'Receita Média',
    valor: +d.receita_media,
    ordem: Number(d.dia_semana),
    color: coresPorDia[nomesDias[d.dia_semana]],
  }));

  const ordemDesejada = [1, 2, 3, 4, 5, 6, 0];

  const dados = ordemDesejada
    .map((ord) => dadosNaoOrdenados.find((d: any) => d.ordem === ord))
    .filter(Boolean); // remove possíveis undefined

  const app = new D3jsLinhasAgrupadas(600, 400, '#view3');
  app.attScale(dados);
  app.attEixos();
  app.createLines(dados);
  app.createLegends(
    'Receita média por corridaReceita média por corrida',
    'Dias da Semana',
  );
}
