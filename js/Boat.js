class Boat {
    constructor(x, y, width, height, boatPos, boatAnimation){
        var options = {
            restitution: 0.8,
            friction: 1,
            density: 1,
            label: "boat"
        };

        this.body = Bodies.rectangle(x, y, width, height, options);
        this.width = width;
        this.height = height;

        this.animation = boatAnimation;
        this.speed = 0.05;

        this.isBroken = false;

        this.image = loadImage("assets/boat.png");
        this.boatPosition = boatPos;
        World.add(world, this.body);
    }

    animate() {
        this.speed += 0.05;
    }

    display(){
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);

        push();
        translate(pos.x, pos.y);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPosition, this.width, this.height);
        pop();
    }
    remove(index) {
        this.animation = brokenBoatAnimation;
        this.speed = 0.05;
        this.width = 300;
        this.height = 300;
        this.isBroken = true;
        setTimeout(() => {
            World.remove(world, boats[index].body);
            delete boats[index];
        }, 2000);
    }
}