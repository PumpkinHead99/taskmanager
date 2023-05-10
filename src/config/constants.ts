export default {
	SERVER: {
		PORT: 3800
	},

    DATABASE: {
        CONNECTION_NAME: "default",
        HOST: "localhost",
        USER: "postgres",
        PASSWORD: "",
        DB_NAME: "workbook",
        PORT: 5432
    },

    HTTP_RESPONSE_CODES: {
		OK: 200,
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500,
		CONFLICT: 409
	}
}