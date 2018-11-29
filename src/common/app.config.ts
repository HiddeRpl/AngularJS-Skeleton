/* @ngInject */
const appConfig = ($stateProvider, $urlRouterProvider, $locationProvider) => {
  $locationProvider.hashPrefix('')
  $urlRouterProvider.when('', '/')

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/home/partial/home.html',
    })
    .state('404', {
      url: '*path',
      templateUrl: 'common/partial/404.html',
    })

  // Default route
  $urlRouterProvider.when('', '/')
}

export default appConfig
