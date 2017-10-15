<template>
  <div id="app">
    <nav class="navbar is-transparent">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/"><img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"></router-link>

      </div>

      <div id="navMenuTransparentExample" class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item " to="/about">
            <span class="bd-emoji">⭐️</span>About</router-link>
          <router-link class="navbar-item " to="/calc">
            <span class="bd-emoji">⭐️</span>Old Calc</router-link>

        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>