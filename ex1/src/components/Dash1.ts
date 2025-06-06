import D3jsBarrasAgrupadas from '../dashBarGruped';
import { Taxi } from '../taxi';

export default async function Dash1(taxi: Taxi) {
  // SQL modificado para contar o número de corridas por dia da semana
  const sql = `
      SELECT
        EXTRACT(DOW FROM lpep_pickup_datetime) AS dia_semana,
        COUNT(*) AS numero_corridas
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

  // Transforma no formato esperado pela classe de barras agrupadas
  const dadosNaoOrdenados = resultado.map((d: any) => ({
    grupo: nomesDias[d.dia_semana],
    categoria: 'Corridas',
    valor: +Number(d.numero_corridas),
    ordem: Number(d.dia_semana),
    color: coresPorDia[nomesDias[d.dia_semana]],
  }));

  // Nova ordem: Segunda (1) a Sexta (5), depois Sábado (6) e Domingo (0)
  const ordemDesejada = [1, 2, 3, 4, 5, 6, 0];

  const dados = ordemDesejada
    .map((ord) => dadosNaoOrdenados.find((d: any) => d.ordem === ord))
    .filter(Boolean); // remove possíveis undefined

  // Cria e renderiza o gráfico
  const app = new D3jsBarrasAgrupadas(600, 400, '#view1');
  console.log(dados);
  app.attScale(dados);
  app.attEixos();
  app.createBars(dados);
  app.createLegends('Número de Corridas', 'Dias da Semana');
}
