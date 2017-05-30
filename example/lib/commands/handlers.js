((module) => {
  class Handlers {
    createProject(cmd, options, ctx) {
      // business logic
      console.log('created project \''.gray + options.name.green + '\' successfully'.gray);
    }

    createModule(cmd, options, ctx) {
      // business logic
      console.log('created module \''.gray + options.name.green + '\' successfully'.gray);
    }

    isCreateModuleCmdAvailable(ctx) {
      // any logic to determine if the command is available
      return ctx === 'project';
    }
  }

  module.exports = new Handlers();
})(module);
