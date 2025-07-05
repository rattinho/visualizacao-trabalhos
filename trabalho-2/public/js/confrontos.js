import {renderLineChart} from "./charts/lineChart.js";
import {renderBarChart} from "./charts/barChart.js";
import {renderPieChart} from "./charts/pieChart.js";
import {renderTableView} from "./charts/tableView.js";

document.addEventListener("DOMContentLoaded", () => {
  const chartDivs = {
    barChart: document.getElementById("chart"),
    lineChart: document.getElementById("chart2"),
    pieChart: document.getElementById("chart3"),
    tableView: document.getElementById("chart4"),
  };

  const selectTime1 = document.getElementById("time1-select");
  const selectTime2 = document.getElementById("time2-select");
  const btnPesquisar = document.getElementById("attbtn");

  let dataOriginal = [];
  let filtrosAtivos = {
    barChart: null,
    lineChart: null,
    pieChart: null,
  };

  let times = [];

  const config = {
    xField: "time",
    yField: "vitorias",
  };

  async function fetchTimes() {
    try {
      const r = await fetch("/api/times");
      times = await r.json();

      times.forEach((t) => {
        const option1 = document.createElement("option");
        option1.value = t.time;
        option1.textContent = t.time;
        selectTime1.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = t.time;
        option2.textContent = t.time;
        selectTime2.appendChild(option2);
      });

      selectTime2.value = "Vitoria"; // Valor padrão

      await atualizarData();
    } catch (err) {
      console.error("Erro ao buscar times:", err);
    }
  }

  async function atualizarData() {
    if (selectTime1.value === selectTime2.value) {
      alert("Selecione dois clubes diferentes.");
      return;
    }

    try {
      const response = await fetch(`/api/confrontos?time1=${selectTime1.value}&time2=${selectTime2.value}`);
      const temp = await response.json();

      if (temp.length > 0) {
        const statsTime1 = {
          time: temp[0].time1,
          vitorias: parseInt(temp[0].vitoriasTime1),
          gols: parseInt(temp[0].golsTime1),
        };
        const statsTime2 = {
          time: temp[0].time2,
          vitorias: parseInt(temp[0].vitoriasTime2),
          gols: parseInt(temp[0].golsTime2),
        };
        const statsEmpate = {
          time: "Empate",
          vitorias: parseInt(temp[0].empates),
          gols: 0,
        };

        dataOriginal = [statsTime1, statsEmpate, statsTime2];

        // Reseta os filtros
        filtrosAtivos.barChart = null;
        filtrosAtivos.lineChart = null;
        filtrosAtivos.pieChart = null;

        atualizarTodosGraficos(dataOriginal);
      } else {
        alert("Não existem dados para o confronto selecionado.");
      }
    } catch (err) {
      console.error("Erro ao buscar dados do confronto:", err);
    }
  }

  function atualizarTodosGraficos(dados) {
    renderBarChart(chartDivs.barChart, dados, {
      ...config,
      onSelection: (selecionados) => atualizarFiltro("barChart", selecionados),
    });

    renderLineChart(chartDivs.lineChart, dados, {
      ...config,
      onSelection: (selecionados) => atualizarFiltro("lineChart", selecionados),
    });

    renderPieChart(chartDivs.pieChart, dados, {
      ...config,
      onSelection: (selecionados) => atualizarFiltro("pieChart", selecionados),
    });

    renderTableView(chartDivs.tableView, dados);
  }

  function atualizarFiltro(grafico, selecionados) {
    filtrosAtivos[grafico] = selecionados?.length > 0 ? selecionados : null;
    const dadosFiltrados = combinarFiltros();
    atualizarTodosGraficos(dadosFiltrados);
  }

  function combinarFiltros() {
    let resultado = [...dataOriginal];
    for (const key in filtrosAtivos) {
      if (filtrosAtivos[key]) {
        resultado = resultado.filter((item) => filtrosAtivos[key].some((f) => compararItem(item, f)));
      }
    }
    return resultado;
  }

  function compararItem(a, b) {
    return a.time === b.time;
  }

  btnPesquisar.addEventListener("click", atualizarData);

  fetchTimes();
});
