<template>
  <div id="app">
    <nav class="navbar is-transparent">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">Two Offers</router-link>
      </div>

      <div id="navMenuTransparentExample" class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item " to="/about">
            <span class="bd-emoji">⭐️</span>About</router-link>
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