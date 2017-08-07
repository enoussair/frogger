//Creates a Game object that stores our game score and ending message
game = {
    score: 0,
    message: "Thank You for Playing! You may keep on playing for fun",
    countdown: 3,
    inceaseScore: function() {
        game.score += 1;
    }
};

// Enemies our player must avoid
var Enemy = function(locations) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = locations[0];
    this.y = locations[1];
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.floor(Math.random() * 150 + 90);;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    //This part of the code first checks if the enemy is offscreen, in which case
    //resets it.
    //Then, the code uses a very simple random number generator to determine whether
    //We should add an extra enemy or remove one from the game.
    if (this.x >= 550) {
        this.x = -200;
        this.speed = Math.floor(Math.random() * 150 + 90);
        var possibleLocations = [
            [-100, 61.5],
            [-100, 145.5],
            [-100, 225]
        ];
        var chosenLocation = Math.floor(Math.random() * 3);
        var check = Math.floor(Math.random() * 40 + 7);
        if (check >= 7 && check <= 10 && allEnemies.length < 10) {
            allEnemies.unshift(new Enemy(possibleLocations[chosenLocation]));
        }
        if (check > 10 && check <= 30 && allEnemies.length > 3) {
            for (var i = 0; i < allEnemies.length; i++) {
                if (allEnemies[i].x >= 505) {
                    allEnemies.splice(i, 1);
                    break;
                }
            }
        }
    };
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //Call our Score count
    if (game.score < 5) {
        ctx.font = '20px Ariel';
        ctx.fillText('Score: ' + game.score, 0, 20);
    }
};

Player.prototype.handleInput = function(direction) {
    var moveLeftRight = 101;
    var moveUpDown = 83;
    if (direction === 'left' && (this.x - moveLeftRight) >= 0) {
        this.x -= moveLeftRight;
    }
    if (direction === 'right' && (this.x + moveLeftRight) < 505) {
        this.x += moveLeftRight;
    }
    if (direction === 'up' && (this.y - moveUpDown) >= -14) {
        this.y -= moveUpDown;
    }
    if (direction === 'down' && (this.y + moveUpDown) <= 406) {
        this.y += moveUpDown;
    }
};

//This player method simply checks whether we have collided with an enemy Based
//On the x and y coordinates of each individual enemy and the player
Player.prototype.isCollision = function() {
    var flag = false;
    allEnemies.forEach(function(enemy) {
        if (Math.abs(player.x - enemy.x) >= 0 && Math.abs(player.x - enemy.x) <= 55) {
            if (Math.abs(player.y - enemy.y) >= 0 && Math.abs(player.y - enemy.y) <= 50) {
                flag = true;
            }
        }
    });
    return flag;
};
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 320;
}

//This method both updates the players locatin upon collision or crossing
//To the River and it puts up a message once the game is won.
Player.prototype.update = function(dt) {
    var DisplayScore = function() {
        ctx.font = '20px Ariel';
        ctx.fillText('Score: ' + game.score, 0, 20);
    }
    if (this.isCollision()) {
        this.reset();
        game.dead();
        ctx.clearRect(0, 0, 100, 100);
    }
    if (this.y < 10) {
        this.reset();
        game.inceaseScore();
        ctx.clearRect(0, 0, 100, 100);
    }
    if (game.score >= 5) {
        ctx.clearRect(0, 0, 100, 100);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 500, 500);
        ctx.fillStyle = "white";
        ctx.fillText(game.message, 20, 20);
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

allEnemies.push(new Enemy([-100, 61.5]), new Enemy([-100, 145.5]), new Enemy([-100, 225]));



var player = new Player(202, 320);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
