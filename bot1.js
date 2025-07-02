class Bot {
    pair_freqs = new Map();
    uni_freqs = new Map();
    dynamite1_count = 0;
    dynamite2_count = 0;

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

        let uni_count = this.uni_freqs.get(p1+p2);
        let score = 0;
        for (let move2 in this.moves) {
            let pair_count = this.pair_freqs.get(p1+p2+move1+move2) ?? 0;
            let pair_prob = pair_count / uni_count;
            if (wins.includes(move1+move2)) {
                score += pair_prob * 1;
            } else if (ties.includes(move1+move2)) {
                score += pair_prob * 0.5;
            } else {
                score += pair_prob * -1
            }
        }
    }

    makeMove(gamestate) {
        if (gamestate.rounds.length > 0) {
            this.updateGamestate(gamestate);
            const scores = new Map();

            for (let move in this.moves) {
                scores.set(move, this.calculateScore(move, gamestate));
            }

            return "R";
        } else {
            return 'R';
        }

        // either pick max or draw probabilistically

    }
}

module.exports = new Bot();
