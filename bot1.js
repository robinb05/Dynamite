class Bot {
    pair_freqs = new Map();
    uni_freqs = new Map();
    dynamite1_count = 0;
    dynamite2_count = 0;

    my_dynamite_count = 100;

    moves = ["R", "P", "S", "W", "D"];

    updateGamestate(gamestate) {
        if (gamestate.rounds.length > 0) {
            let p1 = gamestate.rounds.at(-1).p1;
            let p2 = gamestate.rounds.at(-1).p2;
            let uni_str = p1+p2;
            this.uni_freqs.set(uni_str, (this.uni_freqs.get(uni_str) ?? 0) + 1);

            if (p1 == "D") {
                this.dynamite1_count++;
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
    }

    calculateScore(move1, gamestate) {
        const wins = ["DR", "DP", "DS", "WD", "RS", "SP", "PR"];
        const ties = ["DD", "PP", "RR", "SS", "WW"];

        let p1 = gamestate.rounds.at(-1).p1;
        let p2 = gamestate.rounds.at(-1).p2;
        console.log(p1+p2);

        let uni_count = this.uni_freqs.get(p1+p2);
        let score = 0;
        for (const move2 of this.moves) {
            let pair_count = (this.pair_freqs.get(p1+p2+move1+move2) ?? 0);
            let pair_prob = (pair_count+1) / (uni_count+1);

            if (wins.includes(move1+move2)) {
                score += pair_prob * 1;
            } else if (ties.includes(move1+move2)) {
                score += pair_prob * 0.5;
            } else {
                score += pair_prob * -1;
            }
        }

        return score;
    }

    makeMove(gamestate) {
        let move;
        if (gamestate.rounds.length > 50) {
            this.updateGamestate(gamestate);
            const scores = []

            for (const move of this.moves) {
                scores.push(this.calculateScore(move, gamestate));
            }
            move = this.weightedRandom(scores);
            
        } else {
            move = this.moves[Math.floor(Math.random() * this.moves.length)];
 
        }

        if (move == "D") {
            if (this.my_dynamite_count > 0) {
                this.my_dynamite_count--;
                return "D";
            } else {
                move = "P"
            }
        }

        return move;
    }

    weightedRandom(scores) {
        let i;

        let minScore = Math.min(...scores);
        let pos_scores = [];
        if (minScore < 0) {
            pos_scores = scores.map(score => score + Math.abs(minScore))
        } else {
            pos_scores = scores;
        }
        
        for (i = 1; i < pos_scores.length; i++) {
            pos_scores[i] += pos_scores[i-1];

        }

        var random = Math.random() * pos_scores[pos_scores.length - 1];
        let choice = i;
        for (i = 0; i < pos_scores.length; i++) {
            if (pos_scores[i] >= random) {
                choice = i;
                break;
            }
        }

        return this.moves[choice];
    }
}

module.exports = new Bot();
