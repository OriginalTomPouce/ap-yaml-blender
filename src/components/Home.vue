<template>
    <div class="text-center text-white">
        <h1 class="text-2xl my-4">AP Yaml Blender</h1>
        <div class="mt-4 mb-10 p-6 w-100 align-top inline-block">

            <span class="text-lg">Put a YAML Here :</span>
                <div class="dropzone-container"
                     
                     @dragover="dragover"
                     @dragleave="dragleave"
                     @drop="drop">
                    <input type="file" multiple accept=".yaml" name="file" v-on:change="uploadFile" class="border-1 border-gray-500 rounded-xs p-2 mr-2 text-lg" />
                </div>
            <input @click="download()" type="submit" class="bg-blue-800 p-2 br-1 rounded-xs text-lg" value="Download" />
        </div>
        <div class="inline-block w-100 p-6 align-top">
            You have {{ getRandomCount() }} games
            <input type="text" v-model="yaml_name" @change="changeYamlName()" />
            <div>
                <div v-for="(element, index) in getGames()">
                    {{ element }} :
                    <input type="number" min=0 max=100 :value="masterFile.game[element]" />
                </div>
            </div>
        </div>
        <div class="p-6 align-top">
            <a href="https://github.com/OriginalTomPouce/ap-yaml-blender" target="_blank" class="cursor-pointer text-green-400 hover:text-white hover:underline">Github page</a>
        </div>
    </div>
</template>

<script>
    import yaml from 'js-yaml';
    import { saveAs } from 'file-saver';

    export default {
        name: 'home',
        props: {
        },
        data: function (
        ) {
            return {
                error: 0,
                files: [],
                masterFile: null
            }
        },

        methods: {
            changeYamlName: function () {
                if (this.masterFile)
                    this.masterFile.name = this.yaml_name;
            },
            getGames: function () {
                if (this.masterFile) {
                    return Object.keys(this.masterFile.game);
                }
                return [];
            },
            getRandomCount: function () {
                if (this.masterFile) {
                    return Object.keys(this.masterFile.game).length;
                }
            },
            addTriggerGameName: function (game, name) {
                if (!this.masterFile)
                    return;

                if (!this.masterFile.hasOwnProperty('triggers')) {
                    this.masterFile.triggers = [];
                }

                for (var x = 0; x < this.masterFile.triggers.length; x++) {
                    if (this.masterFile.triggers[x].option_name == 'game' && this.masterFile.triggers[x].option_result == game) {
                        this.masterFile.triggers[x].options[""].name = name;
                        return;
                    }
                }
                this.masterFile.triggers.push({ 'option_name': 'game', 'option_result': game, 'options': { "": { 'name': name } } });
                console.log(this.masterFile.triggers);

            },
            buildMasterFile: function (yaml) {
                this.masterFile = yaml;
                if (typeof this.masterFile.game === 'string') {
                    var struct = {};
                    struct[this.masterFile.game] = 10;
                    this.masterFile.game = struct;
                }
                this.yaml_name = yaml.name;
            },
            addGameToMasterFile: function (yaml, game, name) {
                if (!this.masterFile)
                    return;
                this.masterFile[game] = yaml[game];

                this.masterFile.game[game] = 10;
            },
            addFileToMaster: function (yaml) {
                if (!this.masterFile)
                    return;
                if (typeof yaml.game === 'string') {
                    this.addGameToMasterFile(yaml, yaml.game, yaml.name);
                    this.addTriggerGameName(yaml.game, yaml.name);
                }
                else {
                    for (var key in yaml.game) {
                        this.addGameToMasterFile(yaml, key, yaml.name);
                    }
                }
            },
            parseFile: function (file) {
                var tes = yaml.load(file);
                console.log(tes);
                if (this.masterFile == null) {
                    this.buildMasterFile(tes);
                }
                else
                    this.addFileToMaster(tes);
            },
            uploadFile: async function (event) {
                const eventTarget = event.target;
                if (!eventTarget.files) {
                    return;
                }

                for (var x = 0; x < eventTarget.files.length; x++) {
                    var file_content = await eventTarget.files[x].text();
                    this.parseFile(file_content);
                }

            },
            download: function (event) {
                if (!this.masterFile)
                    return;

                var response = yaml.dump(this.masterFile, {
                    'styles': {
                        '!!null': 'canonical' // dump null as ~
                    },
                    'sortKeys': false        // sort object keys
                });

                var blob = new Blob([response], {
                    type: "text/plain;charset=utf-8;",
                });
                saveAs(blob, this.masterFile.name + '.yaml');
            },
    dragover(e) {
                e.preventDefault();
                this.isDragging = true;
            },
            dragleave() {
                this.isDragging = false;
            },
            drop: async function (e) {
                e.preventDefault();
                if (!e.dataTransfer) {
                    return;
                }
                if (e.dataTransfer.items) {
                    for (var x = 0; x < e.dataTransfer.items.length; x++) {
                        const file = e.dataTransfer.items[x].getAsFile();
                        var file_content = await file.text();
                        this.parseFile(file_content);
                    }
                }
                else
                    this.uploadFile(e);
                this.isDragging = false;
            },

        },
        components: {
        }
    }
</script>
