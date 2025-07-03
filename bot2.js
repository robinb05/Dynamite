class Bot {

    freqs = new Map();

    my_dynamite_count = 100;

    scores = {"R": 1, "P": 1, "S": 1, "W": 0, "D": this.base_dynamite_weight};
    
    base_dynamite_weight = 0.4;
    dynamite_mult = 1.5;
    start = 10;
    dynamite_cutoff = 500;

    updateGamestate(gamestate) {
            let p1 = gamestate.rounds.at(-1).p1;
            let p2 = gamestate.rounds.at(-1).p2;

            this.freqs.set(p2, (this.freqs.get(p2) ?? 0) + 1);

            if (p1 == 'D') {
                this.my_dynamite_count--;
            }

    }

    updateScores(gamestate) {
        let num_rounds = gamestate.rounds.length;
        if (gamestate.rounds.at(-1).p1 == gamestate.rounds.at(-1).p2) {
            this.scores.D *= this.dynamite_mult;
        } else {
            this.scores.D = this.base_dynamite_weight;
        }

        this.scores.R = ((this.freqs.get('R') ?? 0) + (this.freqs.get('S') ?? 0)) / num_rounds;
        this.scores.P = ((this.freqs.get('P') ?? 0) + (this.freqs.get('R') ?? 0)) / num_rounds;
        this.scores.S = ((this.freqs.get('S') ?? 0) + (this.freqs.get('P') ?? 0)) / num_rounds;

        if (this.my_dynamite_count == 0 || num_rounds < this.dynamite_cutoff) {
            this.scores.D = 0;
        }
        console.log(this.scores)
    }

    makeMove(gamestate) {
        if (gamestate.rounds.length > 0) {
            this.updateGamestate(gamestate);
            if (gamestate.rounds.length > this.start) {
                this.updateScores(gamestate);
            }
        } 
        

        let move = this.weightedRandom();
        console.log(this.my_dynamite_count);
        return move;
    }

    weightedRandom() {
        let moves = Object.keys(this.scores);
        let vals = Object.values(this.scores);
        const cum_scores = [vals[0]];
        for (let i = 1; i < vals.length; i++) {
            cum_scores.push(cum_scores[i-1]+vals[i]);
        }

        let random = Math.random() * cum_scores[cum_scores.length - 1];
        let choice = 0;
        for (let i = 0; i < cum_scores.length; i++) {
            if (cum_scores[i] >= random) {
                choice = i;
                break;
            }
        }

        return moves[choice];
    }
}

module.exports = new Bot();
