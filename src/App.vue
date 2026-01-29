<template>
    <div class="fixed top-0 bottom-0 left-0 right-0 bg-gray-800 z-0">
    </div>
    <div class="relative h-screen">
        <div class="flex flex-col">
            <div>
                <Navbar v-bind:gamedata="DATA_PACKAGE"></Navbar>
            </div>
            <div>
                <Home></Home>
            </div>
        </div>
    </div>
    <Toast  position="bottom-right" />
</template>
<script>
    import Navbar from './components/Navbar.vue';
    import Home from './components/Home.vue';
    import ANAP_CONFIG from "./anapconfig.js";

    ANAP_CONFIG.URL_WEBSITE = import.meta.env.VITE_URL_WEBSITE;
    ANAP_CONFIG.OFFLINE = (import.meta.env.VITE_OFFLINE == 'true') ? true : false;


    export default {
        name: "app",
        data: function () {
            return {
            };
        },
        created() {
        },
        beforeUnmount() {
        },

        methods: {
        },
        components: {
            Navbar,
            Home
        },
        mounted: function () {
            var url = location.href;

        },
    };



</script>
