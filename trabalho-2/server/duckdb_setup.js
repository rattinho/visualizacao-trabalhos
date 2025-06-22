const duckdb = require('duckdb');
const path = require('path');

const db = new duckdb.Database(':memory:');

async function setupDatabase() {
    const csvPath = path.resolve(__dirname, '../data/campeonato-brasileiro-full.csv');
    console.log('Caminho absoluto do CSV:', csvPath);

    const query = `
        CREATE TABLE brasileirao AS
        SELECT 
            CAST(ID AS INTEGER) AS ID,
            CAST(rodada AS INTEGER) AS rodada,
            data,
            hora,
            mandante,
            visitante,
            formacao_mandante,
            formacao_visitante,
            tecnico_mandante,
            tecnico_visitante,
            vencedor,
            arena,
            CAST(mandante_placar AS INTEGER) AS mandante_placar,
            CAST(visitante_placar AS INTEGER) AS visitante_placar,
            mandante_estado,
            visitante_estado
        FROM read_csv('${csvPath.replace(/\\/g, '/')}',
            delim=',',
            quote='"',
            header=true,
            AUTO_DETECT=TRUE
        );
    `;

    return new Promise((resolve, reject) => {
        db.exec(query, (err) => {
            if (err) {
                console.error('Erro ao criar a tabela:', err);
                reject(err);
            } else {
                console.log('Tabela brasileirao criada com sucesso.');
                resolve(db);
            }
        });
    });
}

module.exports = setupDatabase;
