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
            LEAO: { nome: "LEAO", bioma: "savana", tamanho: 3, carnivoro: true },
            LEOPARDO: { nome: "LEOPARDO", bioma: "savana", tamanho: 2, carnivoro: true },
            CROCODILO: { nome: "CROCODILO", bioma: "rio", tamanho: 3, carnivoro: true },
            MACACO: { nome: "MACACO", bioma: "savana ou floresta", tamanho: 1, carnivoro: false },
            GAZELA: { nome: "GAZELA", bioma: "savana", tamanho: 2, carnivoro: false },
            HIPOPOTAMO: { nome: "HIPOPOTAMO", bioma: "savana ou rio", tamanho: 4, carnivoro: false }
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

        var recintosViaveis = [];
        for (var i = 0; i < this.recintos.length; i++) {
            var recinto = this.recintos[i];
            // Verifica se o recinto é viável
            if (this.recintoViavel(animal, recinto, quantidade)) {
                var espacoOcupado = this.calcularEspacoOcupadoRecinto(recinto, animal.nome) + (animal.tamanho * quantidade);
                var espacoLivre = recinto.tamanhoTotal - espacoOcupado;
                recintosViaveis.push('Recinto ' + recinto.numero + ' (espaço livre: ' + espacoLivre + ' total: ' + recinto.tamanhoTotal + ')');
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis };
    }

    recintoViavel(animal, recinto, quantidade) {
        const biomaPermitido = this.biomaPermitidoParaRecinto(animal, recinto);
        const compatibilidadeZoo = this.verificarCompatibilidade(animal, recinto, quantidade);
        const espacoOcupado = this.calcularEspacoOcupadoRecinto(recinto, animal.nome) + (animal.tamanho * quantidade);
        const espacoSuficienteParaRecinto = espacoOcupado <= recinto.tamanhoTotal;

        return biomaPermitido && compatibilidadeZoo && espacoSuficienteParaRecinto;
    }

    biomaPermitidoParaRecinto(animal, recinto) {
        const biomasAnimal = animal.bioma.split(" ou ");
        const biomasRecinto = recinto.bioma.split(" e ");
    
        if (animal.bioma === "rio" && (biomasRecinto.length > 1 || !biomasRecinto.includes("rio"))) {
            return false; 
        }
        return biomasAnimal.some(bioma => biomasRecinto.includes(bioma));
    }

    calcularEspacoOcupadoRecinto(recinto, animalInformado) {
        let totalOcupado = 0;
        const especiesNoRecinto = Object.keys(recinto.animais);

        especiesNoRecinto.forEach(tipoAnimal => {
            const quantidade = recinto.animais[tipoAnimal];
            const animal = this.animaisZoo[tipoAnimal];
            if (animal && quantidade >= 1) {
                totalOcupado += animal.tamanho * quantidade;
            }
        });

        if (especiesNoRecinto[0]) {
            if (animalInformado !== especiesNoRecinto[0]) {
                totalOcupado++; //Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
            }
        }
        return totalOcupado;
    }

    verificarCompatibilidade(animal, recinto, quantidade) {
        var tipoAnimal = this.animaisZoo;
        var temCarnivoro = false;

        // Animais carnívoros devem habitar somente com a própria espécie
        for (const nomeAnimal in recinto.animais) {
            if (this.animaisZoo[nomeAnimal].carnivoro) {
                temCarnivoro = true;
                break;
            }
        }

        if (!animal.carnivoro && temCarnivoro) {
            return false;
        }

        if (tipoAnimal === "MACACO") {
            if (recinto.quantidade <= 0) {
                return false; // Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
            }
        }
        return true;
    }

    validarEntrada(tipoAnimal, quantidade) {
        if(typeof quantidade !== "number"){
            return "Quantidade inválida, por favor digite um número válido.";
        }
        if (!this.animaisZoo[tipoAnimal]) {
            return "Animal inválido";
        }
        if (isNaN(quantidade) || quantidade <= 0) {
            return "Quantidade inválida";
        }
        return null;
    }
}

export { RecintosZoo as RecintosZoo };

