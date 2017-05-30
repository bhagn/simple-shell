var handlers = require('./handlers');

module.exports = [
  {
    name: 'create project',
    help: 'create a new project',
    context: 'project',
    handler: handlers.createProject,
    options: {
      name: {
        help: 'name of the project',
        required: true
      },
      version: {
        help: 'project version',
        allowedValues: ['2', '3'],
        defaultValue: '3'
      }
    }
  },
  {
    name: 'create module',
    help: 'create a module under the selected project',
    context: 'module',
    handler: handlers.createModule,
    options: {
      name: {
        help: 'name of the module',
        required: true
      }
    },
    isAvailable: handlers.isCreateModuleCmdAvailable
  }
];
