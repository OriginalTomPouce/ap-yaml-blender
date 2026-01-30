<template>
    <div class="fixed top-0 bottom-0 left-0 right-0 bg-gray-800 z-0">
    </div>
    <div class="relative h-screen">
        <div class="flex flex-col">
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
            toasOasIOAST: function (message, category) {
                if (category == null)
                    category = 'info';

                this.$toast.add({ summary: message, severity: category, life: 8000 });
            }
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
