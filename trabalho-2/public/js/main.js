import {renderLineChart} from "./charts/lineChart.js";
import {renderBarChart} from "./charts/barChart.js";
import {renderPieChart} from "./charts/pieChart.js";
import {renderTableView} from "./charts/tableView.js";
import {estadoParaRegiao} from "./util/estados.js";

document.addEventListener("DOMContentLoaded", async () => {
  const groupBy = document.getElementById("groupBy");

  let dataOriginal = [];
  let dataAgrupada = [];

  // Estado global dos filtros ativos por gráfico
  const filtrosAtivos = {
    barChart: null, // array dos dados selecionados ou null (sem filtro)
    lineChart: null,
    pieChart: null,
  };

  // Buscar dados e agrupar conforme o select
  async function fetchData() {
    try {
      const response = await fetch("/api/tabela");
      dataOriginal = await response.json();
      atualizarDadosAgrupados();
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  }

  // Agrupa dados de acordo com a opção selecionada
  function atualizarDadosAgrupados() {
    if (groupBy.value !== "clube") {
      dataAgrupada = agruparDados(groupBy.value, dataOriginal);
    } else {
      dataAgrupada = [...dataOriginal];
    }
    // Reseta filtros ao mudar agrupamento
    filtrosAtivos.barChart = null;
    filtrosAtivos.lineChart = null;
    filtrosAtivos.pieChart = null;

    // Renderiza com todos dados, sem filtro
    atualizarTodosGraficos(dataAgrupada);
  }

  // Combina os filtros ativos para gerar o dataset filtrado cumulativo
  function combinarFiltros() {
    let resultado = [...dataAgrupada];
    for (const key in filtrosAtivos) {
      if (filtrosAtivos[key]) {
        // Filtra resultado para conter só itens presentes no filtro ativo do gráfico key
        resultado = resultado.filter((item) => filtrosAtivos[key].some((filtrado) => compararItens(filtrado, item)));
      }
    }
    return resultado;
  }

  // Função para atualizar filtro quando um gráfico seleciona dados
  function atualizarFiltro(grafico, selecionados) {
    filtrosAtivos[grafico] = selecionados && selecionados.length > 0 ? selecionados : null;

    // Gera dados filtrados cumulativos
    const dadosFiltrados = combinarFiltros();

    // Renderiza todos gráficos com dados filtrados cumulativos
    atualizarTodosGraficos(dadosFiltrados);
  }

  // Renderiza todos os gráficos passando a função onSelection para controle do filtro
  function atualizarTodosGraficos(dados) {
    renderBarChart(document.querySelector("#chart"), dados, {
      onSelection: (selecionados) => atualizarFiltro("barChart", selecionados),
    });
    renderLineChart(document.querySelector("#chart2"), dados, {
      onSelection: (selecionados) => atualizarFiltro("lineChart", selecionados),
    });
    renderPieChart(document.querySelector("#chart3"), dados, {
      onSelection: (selecionados) => atualizarFiltro("pieChart", selecionados),
    });
    renderTableView(document.querySelector("#chart4"), dados);
  }

  // Função para agrupar dados (igual a sua)
  function agruparDados(grupo, dados) {
    const agrupado = {};

    for (const item of dados) {
      let chave = "";

      if (grupo === "estado") {
        chave = item.estado;
      } else if (grupo === "regiao") {
        const infoEstado = estadoParaRegiao[item.estado];
        if (!infoEstado) continue;
        chave = infoEstado.regiao;
      } else if (grupo === "clube") {
        chave = item.clube;
      }

      if (!agrupado[chave]) {
        agrupado[chave] = {
          time: chave,
          pontos: 0,
          jogos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          gols_pro: 0,
          gols_contra: 0,
          saldo_gols: 0,
        };
      }

      agrupado[chave].pontos += +item.pontos;
      agrupado[chave].jogos += +item.jogos;
      agrupado[chave].vitorias += +item.vitorias;
      agrupado[chave].empates += +item.empates;
      agrupado[chave].derrotas += +item.derrotas;
      agrupado[chave].gols_pro += +item.gols_pro;
      agrupado[chave].gols_contra += +item.gols_contra;
      agrupado[chave].saldo_gols += +item.saldo_gols;
    }

    return Object.values(agrupado).sort((a, b) => b.pontos - a.pontos);
  }

  // Função para comparar itens do filtro (ajuste conforme sua estrutura)
  function compararItens(a, b) {
    // Aqui o ideal é comparar uma chave única ou campos relevantes que identifiquem o item
    return a.time === b.time;
  }

  groupBy.addEventListener("change", atualizarDadosAgrupados);

  fetchData();
});
