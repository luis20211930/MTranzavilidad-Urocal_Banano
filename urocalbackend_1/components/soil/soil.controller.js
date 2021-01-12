// Une varias capas
// Se comunica con el modelo
// *Pendiente: Añadir capa de validación a todos los controladores
//const userDto = require('./users.dto');

const soilModel = require('./soil.model');
const validation = require('../../utils/validations');

module.exports = {
    // Agrega un nuevo suelo
    async createSoil(req, res) {
        const { sueclase, suecolor, suetextura, sueph, suetipoanalisis, suetomamuestras, sueresultados, lotecultivadoid } = req.body;

        // Valida que las variables no esten vacias
        if (validation.emptyField(sueclase) || validation.emptyField(suecolor) || validation.emptyField(suetextura) ||
            validation.emptyField(sueph) || validation.emptyField(suetipoanalisis) || validation.emptyField(suetomamuestras) ||
            validation.emptyField(sueresultados) || validation.emptyField(lotecultivadoid)) {
            return res.status(400).send({ message: 'Llene todos los campos del formulario!' });
        } else {
            try {
                await soilModel.createSoil({ sueclase, suecolor, suetextura, sueph, suetipoanalisis, suetomamuestras, sueresultados, lotecultivadoid })

                return res.status(201).send({ message: 'Suelo registrado' });
            } catch (error) {
                if (error.code == '23505') {
                    return res.status(400).send({ message: "Ya existe un suelo registrado con ese lote" });
                }
                if (error.code == '23503') {
                    return res.status(400).send({ message: "El lote seleccinado no existe" });
                }
                return res.status(500).send({ message: "Error al registrar suelo" });
            }
        }
    },

    // Obtener todos los suelos
    async getAllSoils(req, res) {
        const result = await soilModel.getAllSoils()
        //return res.status(200).send(userDto.multiple(users, req.user)); //<--
        return res.status(200).send(result); // <--
    },

    // Obtener un suelo por ID
    async getSoil(req, res) {
        const { id } = req.params;
        const result = await soilModel.getSoil(id);
        //return res.status(200).send(userDto.multiple(users, req.user)); //<--
        return result === undefined ? res.status(200).send({}) : res.status(200).send(result);
    },

    // Actualiza un suelo
    async updateSoil(req, res) {
        const { id } = req.params;
        const { sueclase, suecolor, suetextura, sueph, suetipoanalisis, suetomamuestras, sueresultados, lotecultivadoid } = req.body;

        if (validation.emptyField(sueclase) || validation.emptyField(suecolor) || validation.emptyField(suetextura) ||
            validation.emptyField(sueph) || validation.emptyField(suetipoanalisis) || validation.emptyField(suetomamuestras) ||
            validation.emptyField(sueresultados) || validation.emptyField(lotecultivadoid)) {
            return res.status(400).send({ message: 'Llene todos los campos del formulario!' });
        } else {
            try {
                const rowCount = await soilModel.updateSoil(id, {
                    sueclase, suecolor, suetextura, sueph, suetipoanalisis,
                    suetomamuestras, sueresultados, lotecultivadoid
                })

                return rowCount == 1 ? res.status(200).send({ message: "Suelo actualizado" }) : res.status(400).send({ message: "Suelo no registrado" });
            } catch (error) {
                /*if (error.code == '23505') {
                    res.status(400).send({ message: "Ya existe un suelo con el código que ha ingresado" });
                } else {
                    return res.status(400).send({ message: "Error al actualizar producto" });
                }*/
                return res.status(400).send({ message: "Error al actualizar suelo" });
            }
        }
    },

    // Elimina un suelo
    async deleteSoil(req, res) {
        const { id } = req.params;

        try {
            let rowCount = await soilModel.deleteSoil(id);
            if (rowCount == 1) {
                return res.status(200).send({ message: "Suelo eliminado" });
            } else {
                return res.status(400).send({ message: "Suelo no registrado" });
            }

        } catch (err) {
            if (err.code == '23503') {
                res.status(400).send({ message: "El suelo a eliminar tiene relaciones con otros registros en la base de datos" });
            } else {
                return res.status(400).send({ message: "Error al eliminar suelo" });
            }
        }
    }
}