class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: { MACACO: 3 } },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: {} },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: { GAZELA: 1 } },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: {} },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: { LEAO: 1 } }
        ];

        this.animaisZoo = {
            LEAO: { bioma: "savana", tamanho: 3, carnivoro: true },
            LEOPARDO: { bioma: "savana", tamanho: 2, carnivoro: true },
            CROCODILO: { bioma: "rio", tamanho: 3, carnivoro: true },
            MACACO: { bioma: "savana ou floresta", tamanho: 1, carnivoro: false },
            GAZELA: { bioma: "savana", tamanho: 2, carnivoro: false },
            HIPOPOTAMO: { bioma: "savana e rio", tamanho: 4, carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        const erro = this.validarEntrada(tipoAnimal, quantidade);
        if (erro) {
            return { erro };
        }
        const animal = this.animaisZoo[tipoAnimal];
        if (!animal) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        const recintosViaveis = this.recintos
            .filter(recinto => this.recintoViavel(animal, recinto, quantidade))
            .map(recinto => {
                const espacoOcupado = this.calcularEspacoOcupadoRecinto(recinto) + (animal.tamanho * quantidade);
                const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
            })

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis };
    }

    validarEntrada(tipoAnimal, quantidade) {
        if (!this.animaisZoo[tipoAnimal]) {
            return "Animal inválido";
        }
        if (isNaN(quantidade) || quantidade <= 0) {
            return "Quantidade inválida";
        }
        return null;
    }

    recintoViavel(animal, recinto, quantidade) {
        const biomaPermitido = this.biomaPermitidoParaRecinto(animal, recinto);
        const compatibilidadeZoo = this.verificarCompatibilidade(animal, recinto, quantidade);
        const espacoOcupado = this.calcularEspacoOcupadoRecinto(recinto) + (animal.tamanho * quantidade);
        const espacoSuficienteParaRecinto = espacoOcupado <= recinto.tamanhoTotal;

        return biomaPermitido && compatibilidadeZoo && espacoSuficienteParaRecinto;
    }

    biomaPermitidoParaRecinto(animal, recinto) {
        const biomasAnimal = animal.bioma.trim().split(" ou ");
        const biomasRecinto = recinto.bioma.trim().split(" e ").map(bioma => bioma.trim());


        return biomasAnimal.some(bioma => biomasRecinto.includes(bioma)) && (biomasRecinto.length === 1 || !biomasRecinto.includes('savana') || animal.bioma.includes('savana'));
    }

    calcularEspacoOcupadoRecinto(recinto) {
        let totalOcupado = 0;
        const especiesNoRecinto = Object.keys(recinto.animais);
        const numEspecies = especiesNoRecinto.length;

        especiesNoRecinto.forEach(tipoAnimal => {
            const quantidade = recinto.animais[tipoAnimal];
            const animal = this.animaisZoo[tipoAnimal];
            if (animal && quantidade > 1) {
                totalOcupado += animal.tamanho * quantidade;
            }
        });

        // Adiciona espaço extra se houver mais de uma espécie
        if (numEspecies >= 1) {
            totalOcupado++;
        }

        return totalOcupado;
    }

    verificarCompatibilidade(animal, recinto, quantidade) {
        const tipoAnimal = Object.keys(this.animaisZoo).find(key => this.animaisZoo[key] === animal);

        if (animal.carnivoro) {
            const animaisNoRecinto = recinto.animais || {};
            const especieExistente = Object.keys(animaisNoRecinto).find(especie => this.animaisZoo[especie].carnivoro && especie !== tipoAnimal);
            if (especieExistente) {
                return false;
            }
        }

        // Regras para Hipopótamo
        if (animal.bioma.includes("HIPOPOTAMO") && recinto.bioma !== "savana e rio") {
            return false;
        }

        if (animal.bioma.includes("MACACO")) {
            if (quantidade > 1 && Object.keys(recinto.animais).length === 0) {
                return false; // Macaco precisa de pelo menos uma outra espécie se houver mais de um
            }
            if (recinto.bioma === "rio") {
                return false; // Macaco não deve estar em recinto com bioma "rio"
            }
        }

        if (animal.bioma.includes("CROCODILO") && recinto.bioma !== "rio") {
            return false;
        }

        return true;
    }
}

export { RecintosZoo as RecintosZoo };


