import * as angular from 'angular'

/**
 * Root controller attached to the <html>
 */
angular.module('app-root', [
])
  .controller('AppRootCtrl', /* @ngInject */($scope) => {
    $scope.hello = 'Hello World'
  })

export default 'app-root'
