const { weightedRandom, my_dynamite_count } = require("./bot1");

class Bot {
    pair_freqs = new Map();
    uni_freqs = new Map();
    dynamite1_count = 0;
    dynamite2_count = 0;

    
    my_dynamite_count = 100;

    scores = [1,1,1,0,0]
    moves = ["R", "P", "S", "W", "D"];

    updateGamestate(gamestate) {
            let p1 = gamestate.rounds.at(-1).p1;
            let p2 = gamestate.rounds.at(-1).p2;
            let uni_str = p1+p2;
            this.uni_freqs.set(uni_str, (this.uni_freqs.get(uni_str) ?? 0) + 1);

            if (p1 == "D") {
                this.dynamite1_count++;
                this.my_dynamite_count--;
            }
            if (p2 == "D") {
                this.dynamite2_count++;
            }

            if (gamestate.rounds.length > 1) {
                let oldp1 = gamestate.rounds.at(-2).p1;
                let oldp2 = gamestate.rounds.at(-2).p2;
                let pair_str = oldp1+oldp2+p1+p2;
                this.pair_freqs.set(pair_str, (this.pair_freqs.get(pair_str) ?? 0) + 1)
            }
    }

    updateScores(gamestate) {
        if (gamestate.rounds.at(-1).p1 == gamestate.rounds.at(-1).p2) {
            this.scores[4]++;
        } else {
            this.scores[4] = 0;
        }

        if (this.my_dynamite_count == 0) {
            this.scores[4] = 0;
        }
    }

    makeMove(gamestate) {
        if (gamestate.rounds.length > 0) {
            this.updateGamestate(gamestate);
            this.updateScores(gamestate);
        }

        let move = this.weightedRandom();

        return move;
    }

    weightedRandom() {
        const cum_scores = [this.scores[0]];
        for (let i = 1; i < this.scores.length; i++) {
            cum_scores.push(cum_scores[i-1]+this.scores[i]);
        }

        let random = Math.random() * cum_scores[cum_scores.length - 1];
        let choice = 0;
        for (let i = 0; i < cum_scores.length; i++) {
            if (cum_scores[i] >= random) {
                choice = i;
                break;
            }
        }

        return this.moves[choice];
    }
}

module.exports = new Bot();
