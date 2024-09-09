CREATE DATABASE empresabanco;

USE empresabanco;

CREATE TABLE departamentos(
    dep_codigo INT NOT NULL AUTO_INCREMENT,
    dep_nome VARCHAR(100) NOT NULL,
    dep_localizacao VARCHAR(100) NOT NULL,
    dep_funcao VARCHAR(255) NOT NULL,  
    CONSTRAINT pk_departamentos PRIMARY KEY(dep_codigo)
);

CREATE TABLE funcionarios(
    func_codigo INT NOT NULL AUTO_INCREMENT,
    func_nome VARCHAR(100) NOT NULL,
    func_salario DECIMAL(10,2) NOT NULL DEFAULT 0,
    dep_codigo INT NOT NULL,
    CONSTRAINT pk_funcionarios PRIMARY KEY(func_codigo),
    CONSTRAINT fk_funcionarios_departamento FOREIGN KEY(dep_codigo)
        REFERENCES departamentos(dep_codigo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
