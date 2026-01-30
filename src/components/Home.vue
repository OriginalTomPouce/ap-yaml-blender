<template>
    <div class="text-center text-white">
        <h1 class="text-4xl my-4">AP Yaml Blender</h1>
        <div class="mt-4 p-6 w-full xl:w-1/2 align-top inline-block">
            <div class="mb-20">
                An application to make your random YAML, so you don't have to edit a big file again and again.<br />
                Put any kind of YAML you want to the blender, either a single game or an already made random yaml.<br/>
                Then you can update it by adding more yamls ! (or remove games)<br />
            </div>
            <div>
                <label for="file" class="dropzone-container rounded-md border-2 border-gray-500 h-10 w-80 px-18 py-8 bg-gray-900 hover:bg-emerald-800" :class="{ isDragging : 'bg-emerald-800'}"
                       @dragover="dragover"
                       @dragleave="dragleave"
                       @drop="drop">
                    Drop your YAML here (or click here)
                </label>
                <input type="file" multiple accept=".yaml" id="file" v-on:change="uploadFile" class="hidden" />
            </div>
            <div class="mt-10"></div>
        </div>
        <div v-if="fileValid()" class="inline-block w-full xl:w-1/2 p-6 align-top">
            <div class="text-xl">
                <b>YAML Name :</b> <input type="text" class="border-1 border-gray-700 p-1" v-model="yaml_name" @change="changeYamlName()" />
            </div>
            <div>
                You have <b>{{ getRandomCount() }}</b> games.
            </div>
            <div>
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="w-120">Game</th>
                            <th class="w-80">Slot name</th>
                            <th class="w-80">Weight</th>
                            <th class="w-40">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="(element, index) in games">
                            <td class="w-120 p-1">{{ element.game_name }}</td>
                            <td class="w-80 p-1"><input class="border-1 border-gray-700 p-2 rounded-sm" type="text" v-model="element.slot_name" /></td>
                            <td class="w-80 p-1"><input class="border-1 border-gray-700 p-2" type="number" min=0 max=100 v-model="element.weight" /></td>
                            <td class="w-40 p-1"><b class="inline-block cursor-pointer text-red-400 border-1 rounded-md px-3 py-1" @click="deleteGame(element.game_name)">X</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="fileValid()" class="mt-4 p-6 w-full align-top inline-block">
            <input @click="download()" type="submit" class="bg-blue-800 p-4 px-8 br-1 rounded-md text-lg cursor-pointer" value="Download" />
        </div>
        <div class="p-6 align-top">
            <a href="https://github.com/OriginalTomPouce/ap-yaml-blender" target="_blank" class="cursor-pointer text-green-400 hover:text-white hover:underline">v{{ANAP_CONFIG.APP_VERSION}} - Github page</a>
        </div>
    </div>
</template>

<script>
    import ANAP_CONFIG from "../anapconfig.js";
    import yaml from 'js-yaml';
    import { saveAs } from 'file-saver';

    export default {
        name: 'home',
        props: {
        },
        data: function (
        ) {
            return {
                ANAP_CONFIG,
                error: 0,
                files: [],
                games: [],
                masterFile: null,
                isDragging: false
            }
        },

        methods: {
            fileValid: function () {
                if (this.masterFile && this.games.length)
                    return true;
                return false;
            },
            inputValid: function (yaml) {
                if (yaml.hasOwnProperty('game') && yaml.hasOwnProperty('name')) {
                    return true;
                }
                return false;
            },
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
            deleteGame: function (game) {
                if (!this.masterFile)
                    return;

                for (var x = 0; x < this.games.length; x++) {
                    if (this.games[x].game_name == game) {
                        this.games.splice(x, 1);

                        delete this.masterFile.game[game];
                        delete this.masterFile[game];
                        for (var y = 0; y < this.masterFile.triggers.length; y++) {
                            if (this.masterFile.triggers[y].option_name == 'game' && this.masterFile.triggers[y].option_result == game) {
                                this.masterFile.triggers.splice(y, 1);
                                break;
                            }

                        }
                        return;
                    }
                }
            },
            saveParams: function () {
                this.name = this.yaml_name;
                for (var x = 0; x < this.games.length; x++) {
                    this.masterFile.game[this.games[x].game_name] = this.games[x].weight; 
                    this.addTriggerGameName(this.games[x].game_name, this.games[x].slot_name);
                }
            },
            concatTriggersToMaster: function (triggers) {
                if (!triggers)
                    return;

                if (!this.masterFile.hasOwnProperty('triggers')) {
                    this.masterFile.triggers = [];
                }

                for (var x = 0; x < triggers.length; x++) {
                    var found = 0;
                    for (var y = 0; y < this.masterFile.triggers.length; y++) {

                        if (triggers[x].option_name == this.masterFile.triggers[y].option_name && triggers[x].option_result == this.masterFile.triggers[y].option_result) {
                            this.masterFile.triggers[y].options = triggers[x].options;
                            found = 1;
                            break;
                        }

                    }
                    if (!found) {
                        this.masterFile.triggers.push(triggers[x]);
                    }
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
            getNameFromTrigger: function (yaml, game) {
                if (!yaml.triggers)
                    return null;
                for (var x = 0; x < yaml.triggers.length; x++) {
                    if (yaml.triggers[x].option_name == 'game' && yaml.triggers[x].option_result == game) {
                        return yaml.triggers[x].options[""].name;
                    }
                }
                return null;
            },
            addGameToStruct: function (game, name, weight) {
                if (weight == null) {
                    weight = 10;
                }
                for (var x = 0; x < this.games.length; x++) {
                    if (this.games[x].game_name == game) {
                        this.games[x].slot_name = name;
                        this.games[x].weight = weight;
                        return;
                    }
                }
                this.games.push({ 'game_name': game, 'slot_name': name, 'weight': weight });
            },
            buildMasterFile: function (yaml) {
                this.masterFile = yaml;
                if (typeof this.masterFile.game === 'string') {
                    this.addGameToStruct(this.masterFile.game, yaml.name, 10);
                    var struct = {};
                    struct[this.masterFile.game] = 10;
                    this.addTriggerGameName(yaml.game, yaml.name);
                    this.masterFile.game = struct;
                }
                else {
                    for (var key in yaml.game) {
                        var name = this.getNameFromTrigger(yaml, key);
                        if (!name)
                            name = key;

                        this.addGameToStruct(key, name, yaml.game[key]);
                    }
                }
                this.yaml_name = yaml.name;
            },
            addGameToMasterFile: function (yaml, game, name, weight) {
                if (!this.masterFile)
                    return;
                if (!weight)
                    weight = 10;
                this.masterFile[game] = yaml[game];
                this.masterFile.game[game] = weight;
                var tmpname = this.getNameFromTrigger(yaml, game);
                if (tmpname)
                    name = tmpname;
                this.addGameToStruct(game, name, weight);
            },
            addFileToMaster: function (yaml) {
                if (!this.masterFile)
                    return;
                if (typeof yaml.game === 'string') {
                    this.addTriggerGameName(yaml.game, yaml.name);
                    this.addGameToMasterFile(yaml, yaml.game, yaml.name);
                }
                else {
                    if (yaml.hasOwnProperty('triggers'))
                        this.concatTriggersToMaster(yaml.triggers);
                    for (var key in yaml.game) {
                        this.addGameToMasterFile(yaml, key, yaml.name, yaml.game[key]);
                    }
                }
            },
            parseFile: function (file) {
                var tes = yaml.load(file);

                if (!this.inputValid(tes)) {
                    return;
                }
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
                this.saveParams();
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
