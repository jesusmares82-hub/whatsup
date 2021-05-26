"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "members",
      {
        //id: {
        //  type: Sequelize.INTEGER,
        //  primaryKey: true,
        //  autoIncrement: true,
        //  allowNull: false,
        //},
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id",
            onDelete: "cascade",
          },
        },
        room_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "rooms",
            key: "id",
            onDelete: "cascade",
          },
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        uniqueKeys: {
          members_unique: {
            fields: ["user_id", "room_id"],
          },
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    //return queryInterface.dropTable("members");
    return queryInterface.addConstraint("members", {
      fields: ["user_id", "room_id"],
      type: "primary key",
      name: "members_pkey",
    });
  },
};
