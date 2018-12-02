import * as angular from 'angular'
import 'angular-ui-router'

// Used by webpack-require-loader, DO NOT REMOVE!
// @require "../**/!(index)*.html";

// import userWelcome from '../components/user-welcome/user-welcome'

import home from '../modules/home/home'

import appConfig from './app.config'

import './assets/style/main.scss'

import appRoot from './scripts/controller/app-root'

// import promoTooltip from './scripts/directive/promo-tooltip'

// import submitId from './scripts/service/submit-id'

angular
  .module('ui_cust', [
    appRoot,
    'ui.router',
    home,
  ])
  .config(appConfig)
  .run(/* @ngInject */($rootScope, $state) => {
    // currency goes at the end, always (i.e. 23.00 USD, instead of USD23.00).
    $rootScope.$on('$localeChangeSuccess', () => {
      $rootScope.$state = $state
    })

    $rootScope.$on('$stateChangeStart', (evt, to, params, from) => {
      $state.previous = from

      if (to.redirectTo) {
        evt.preventDefault()
        $state.go(to.redirectTo, params)
      }
    })

    $rootScope.$on('$stateChangeError', () => $state.go('404'))
  })
