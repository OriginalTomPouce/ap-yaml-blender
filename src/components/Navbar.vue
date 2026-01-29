<template>
    <div>
        <nav class="flex flex-row flex-nowrap bg-gray-900">
            <div v-on:click="$parent.resetBack()" class="mr-4 p-3 text-green-600 cursor-pointer hover:text-white p-3 font-roboto font-bold">
                <span class="font-semibold text-l tracking-tight">AP Yaml Blender</span>
            </div>
            <div class="text-green-600 relative justify-self-end font-roboto p-3 grow-5 text-right">
                <a href="https://github.com/OriginalTomPouce/ap-yaml-blender" target="_blank" class="cursor-pointer hover:text-white">v{{ANAP_CONFIG.APP_VERSION}}</a>
            </div>
        </nav>
    </div>
</template>

<script>
    import ANAP_CONFIG from "../anapconfig.js";

    export default {
        name: 'navbar',
        props: {
            data: Object,
        },
        data: function () {
            return {
                ANAP_CONFIG,
            }
        },

        methods: {

        },
        components: {
        }
    }
</script>
