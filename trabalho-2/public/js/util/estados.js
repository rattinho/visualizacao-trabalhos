export const mapaBrasil = {
  "regioes": {
    "Norte": {
      "estados": {
        "AC": "Acre",
        "AP": "Amapá",
        "AM": "Amazonas",
        "PA": "Pará",
        "RO": "Rondônia",
        "RR": "Roraima",
        "TO": "Tocantins"
      }
    },
    "Nordeste": {
      "estados": {
        "AL": "Alagoas",
        "BA": "Bahia",
        "CE": "Ceará",
        "MA": "Maranhão",
        "PB": "Paraíba",
        "PE": "Pernambuco",
        "PI": "Piauí",
        "RN": "Rio Grande do Norte",
        "SE": "Sergipe"
      }
    },
    "Centro-Oeste": {
      "estados": {
        "GO": "Goiás",
        "MT": "Mato Grosso",
        "MS": "Mato Grosso do Sul",
        "DF": "Distrito Federal"
      }
    },
    "Sudeste": {
      "estados": {
        "ES": "Espírito Santo",
        "MG": "Minas Gerais",
        "RJ": "Rio de Janeiro",
        "SP": "São Paulo"
      }
    },
    "Sul": {
      "estados": {
        "PR": "Paraná",
        "RS": "Rio Grande do Sul",
        "SC": "Santa Catarina"
      }
    }
  }
};

export const estadoParaRegiao = {};

for (const [regiao, info] of Object.entries(mapaBrasil.regioes)) {
  for (const [sigla, nome] of Object.entries(info.estados)) {
    estadoParaRegiao[sigla] = {
      nome,
      regiao
    };
  }
}