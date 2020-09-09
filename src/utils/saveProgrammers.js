const Programmer = require("../models/programmer");

// saveProgrammer({name: 'Johan Ochoa', image: '/images/profilePicture.jpg', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, rem quam. Cumque cupiditate aliquam repudiandae eligendi id harum dolor, earum facilis amet optio veritatis odio dolore fugit atque accusamus consequatur expedita, consequuntur inventore, corporis neque quidem pariatur dolores ratione quaerat.'});

saveProgrammer = async (programmer) => {
   const saveProgrammer = new Programmer(programmer);
   await saveProgrammer.save();
}


module.exports = saveProgrammer;