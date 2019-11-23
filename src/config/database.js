module.exports =  {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'alunos',
    define: 
    {
        timestamps: true, 
        underscored: true, 
        underscoredAll: true, 
    }
};