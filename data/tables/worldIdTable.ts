        `CREATE TABLE 
        WorldId(
        ID_USER BIGINT NOT NULL, 
        ACCESS_TOKEN VARCHAR(1500) NOT NULL,
        TOKEN_TYPE VARCHAR(150),
        EXPIRES_IN VARCHAR(150),
        SCOPE VARCHAR(150),
        ID_TOKEN VARCHAR(1500),
        EMAIL VARCHAR(150),
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`