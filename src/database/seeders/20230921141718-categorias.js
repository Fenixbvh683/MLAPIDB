'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.bulkInsert('Categories', [
      {
       name: 'Ultimos Visitados',
       image: null,
       createdAt : new Date(),
       updatedAt : new Date(),
      },
      {
        name: 'En Oferta',
        image: null,
        createdAt : new Date(),
        updatedAt : new Date(),
       }
    ], 
    {}
    );
    
  },

  async down (queryInterface, Sequelize) {
    
     await queryInterface.bulkDelete('Categories', null, {});
     
  }
};
