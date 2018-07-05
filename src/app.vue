<template>
    <v-app>
        <v-content>
            <v-container>
                <router-view ref="routerView"></router-view>
            </v-container>
        </v-content>
        <v-footer app fixed style="background: rgba(0, 0, 0, 0.7)">
            <div class="grey--text">(C) 2017 Jacek Karczmarczyk</div>
        </v-footer>
    </v-app>
</template>

<script>
export default {
  name: 'app',
}
</script>
