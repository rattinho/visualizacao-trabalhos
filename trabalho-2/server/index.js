const express = require('express');
const path = require('path');
const setupDatabase = require('./duckdb_setup');

const app = express();
let dbInstance = null;

function convertBigIntToString(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToString);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === 'bigint') {
                newObj[key] = obj[key].toString(); // ou Number(obj[key]) se preferir
            } else {
                newObj[key] = convertBigIntToString(obj[key]);
            }
        }
        return newObj;
    } else {
        return obj;
    }
}

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '1mb' }));

app.get('/api/individual', (req, res) => {
   if(!dbInstance){
    return res.status(500).json({error: 'Dataset ainda não carregado.'});
   } 
   const {time} = req.query;
   const query = `
    WITH temporada_manual AS (
        SELECT 1 AS temporada_id, 2003 AS ano_inicio, 1 AS id_inicio, 552 AS id_fim
        UNION ALL SELECT 2, 2004, 553, 1104
        UNION ALL SELECT 3, 2005, 1105, 1566
        UNION ALL SELECT 4, 2006, 1567, 1946
        UNION ALL SELECT 5, 2007, 1947, 2326
        UNION ALL SELECT 6, 2008, 2327, 2706
        UNION ALL SELECT 7, 2009, 2707, 3086
        UNION ALL SELECT 8, 2010, 3087, 3466
        UNION ALL SELECT 9, 2011, 3467, 3846
        UNION ALL SELECT 10, 2012, 3847, 4226
        UNION ALL SELECT 11, 2013, 4227, 4606
        UNION ALL SELECT 12, 2014, 4607, 4986
        UNION ALL SELECT 13, 2015, 4987, 5366
        UNION ALL SELECT 14, 2016, 5367, 5745
        UNION ALL SELECT 15, 2017, 5746, 6125
        UNION ALL SELECT 16, 2018, 6126, 6505
        UNION ALL SELECT 17, 2019, 6506, 6885
        UNION ALL SELECT 18, 2020, 6886, 7265
        UNION ALL SELECT 19, 2021, 7266, 7645
        UNION ALL SELECT 20, 2022, 7646, 8025
        UNION ALL SELECT 21, 2023, 8026, 8405
        UNION ALL SELECT 22, 2024, 8406, 8785
    ),
    jogos_com_temporada AS (
        SELECT
            b.*,
            t.temporada_id,
            t.ano_inicio AS temporada_ano_inicio
        FROM brasileirao b
        JOIN temporada_manual t
            ON b.ID BETWEEN t.id_inicio AND t.id_fim
    ),
    estatisticas_mandante AS (
        SELECT
            temporada_id,
            temporada_ano_inicio,
            mandante AS time_nome,
            CASE WHEN vencedor = mandante THEN 3
                WHEN vencedor = '-' THEN 1
                ELSE 0 END AS pontos,
            CASE WHEN vencedor = mandante THEN 1 ELSE 0 END AS vitorias,
            CASE WHEN vencedor = '-' THEN 1 ELSE 0 END AS empates,
            CASE WHEN vencedor = visitante THEN 1 ELSE 0 END AS derrotas,
            mandante_placar AS gols_pro,
            visitante_placar AS gols_contra,
            mandante_Estado AS estado
        FROM jogos_com_temporada
        WHERE mandante = '${time}'
    ),
    estatisticas_visitante AS (
        SELECT
            temporada_id,
            temporada_ano_inicio,
            visitante AS time_nome,
            CASE WHEN vencedor = visitante THEN 3
                WHEN vencedor = '-' THEN 1
                ELSE 0 END AS pontos,
            CASE WHEN vencedor = visitante THEN 1 ELSE 0 END AS vitorias,
            CASE WHEN vencedor = '-' THEN 1 ELSE 0 END AS empates,
            CASE WHEN vencedor = mandante THEN 1 ELSE 0 END AS derrotas,
            visitante_placar AS gols_pro,
            mandante_placar AS gols_contra,
            visitante_Estado AS estado
        FROM jogos_com_temporada
        WHERE visitante = '${time}'
    ),
    estatisticas_gerais AS (
        SELECT * FROM estatisticas_mandante
        UNION ALL
        SELECT * FROM estatisticas_visitante
    )
    SELECT
        temporada_ano_inicio AS temporada,
        time_nome,
        COUNT(*) AS jogos,
        SUM(pontos) AS total_pontos,
        SUM(vitorias) AS vitorias,
        SUM(empates) AS empates,
        SUM(derrotas) AS derrotas,
        SUM(gols_pro) AS gols_marcados,
        SUM(gols_contra) AS gols_sofridos,
        SUM(gols_pro - gols_contra) AS saldo_gols,
        MAX(estado) AS estado
    FROM estatisticas_gerais
    GROUP BY temporada_ano_inicio, time_nome
    ORDER BY temporada_ano_inicio, total_pontos DESC;`;
   dbInstance.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar a tabela 2012:', err);
            res.status(500).json({ error: err.message });
        } else {
            try {
                const safeRows = convertBigIntToString(rows);
                res.json(safeRows);
            } catch (serializationError) {
                console.error('Erro ao serializar resposta:', serializationError);
                res.status(500).json({ error: 'Falha ao serializar a resposta.' });
            }
        }
    });

});

app.get('/api/placares', (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: 'Database ainda não carregada.' });
    }

    const query = `
        SELECT 
            rodada,
            mandante,
            mandante_placar,
            visitante,
            visitante_placar
        FROM brasileirao
        WHERE mandante_placar IS NOT NULL AND visitante_placar IS NOT NULL
        LIMIT 20;
    `;

    dbInstance.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar o banco:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/times', (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: 'Database ainda não carregada.' });
    }

    const query = `
        SELECT 
            DISTINCT mandante AS time
        FROM brasileirao
        ORDER BY time;
    `;

    dbInstance.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar o banco:', err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get('/api/tabela', (req, res) => {
    if (!dbInstance) {
        return res.status(500).json({ error: 'Database ainda não carregada.' });
    }

    const query = `
        SELECT
            time,
            SUM(pontos) AS pontos,
            SUM(jogos) AS jogos,
            SUM(vitorias) AS vitorias,
            SUM(empates) AS empates,
            SUM(derrotas) AS derrotas,
            SUM(gols_pro) AS gols_pro,
            SUM(gols_contra) AS gols_contra,
            SUM(gols_pro) - SUM(gols_contra) AS saldo_gols,
            MAX(estado) AS estado
        FROM (
            SELECT
                mandante AS time,
                CASE
                    WHEN CAST(mandante_placar AS INTEGER) > CAST(visitante_placar AS INTEGER) THEN 3
                    WHEN CAST(mandante_placar AS INTEGER) = CAST(visitante_placar AS INTEGER) THEN 1
                    ELSE 0
                END AS pontos,
                1 AS jogos,
                CASE WHEN CAST(mandante_placar AS INTEGER) > CAST(visitante_placar AS INTEGER) THEN 1 ELSE 0 END AS vitorias,
                CASE WHEN CAST(mandante_placar AS INTEGER) = CAST(visitante_placar AS INTEGER) THEN 1 ELSE 0 END AS empates,
                CASE WHEN CAST(mandante_placar AS INTEGER) < CAST(visitante_placar AS INTEGER) THEN 1 ELSE 0 END AS derrotas,
                CAST(mandante_placar AS INTEGER) AS gols_pro,
                CAST(visitante_placar AS INTEGER) AS gols_contra,
                mandante_Estado AS estado
            FROM brasileirao
            WHERE mandante_placar IS NOT NULL AND visitante_placar IS NOT NULL

            UNION ALL

            SELECT
                visitante AS time,
                CASE
                    WHEN CAST(visitante_placar AS INTEGER) > CAST(mandante_placar AS INTEGER) THEN 3
                    WHEN CAST(visitante_placar AS INTEGER) = CAST(mandante_placar AS INTEGER) THEN 1
                    ELSE 0
                END AS pontos,
                1 AS jogos,
                CASE WHEN CAST(visitante_placar AS INTEGER) > CAST(mandante_placar AS INTEGER) THEN 1 ELSE 0 END AS vitorias,
                CASE WHEN CAST(visitante_placar AS INTEGER) = CAST(mandante_placar AS INTEGER) THEN 1 ELSE 0 END AS empates,
                CASE WHEN CAST(visitante_placar AS INTEGER) < CAST(mandante_placar AS INTEGER) THEN 1 ELSE 0 END AS derrotas,
                CAST(visitante_placar AS INTEGER) AS gols_pro,
                CAST(mandante_placar AS INTEGER) AS gols_contra,
                visitante_Estado AS estado
            FROM brasileirao
            WHERE mandante_placar IS NOT NULL AND visitante_placar IS NOT NULL
        ) AS resultados
        GROUP BY time
        ORDER BY pontos DESC, saldo_gols DESC, gols_pro DESC;
    `;

    dbInstance.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar a tabela 2012:', err);
            res.status(500).json({ error: err.message });
        } else {
            try {
                const safeRows = convertBigIntToString(rows);
                res.json(safeRows);
            } catch (serializationError) {
                console.error('Erro ao serializar resposta:', serializationError);
                res.status(500).json({ error: 'Falha ao serializar a resposta.' });
            }
        }
    });
});


(async () => {
    try {
        dbInstance = await setupDatabase();
        const PORT = 3000;
        app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
    } catch (error) {
        console.error('Falha ao iniciar o servidor devido ao erro de banco.');
        process.exit(1);
    }
})();
