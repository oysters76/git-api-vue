<script setup lang="ts">
   import { useI18n } from 'vue-i18n';
import { useBfInterpreter } from './composables/useBfInterpreter';

   const {t} = useI18n();

    const {
        bfcode, 
        bfoutput, 
        memory_nodes, 
        instruction_nodes, 
        instructions_span_refs, 
        autoPlayButtonDisabled, 
        stepOverButtonDisabled, 
        autoplay_speed_precentage,
        errorMessage, 
        isError,

        loadBfProgram,
        stepThroughBf,
        autoPlayBf,
        isActiveInstruction,
        isActiveMemory,
        downloadPortableFile
    } = useBfInterpreter();

    
</script>

<template>
  <div class="row">
     <div v-if="memory_nodes.length > 0 && !isError" class="holder memory-holder">
        <span v-for="(memoryNode, memoryIndex) in memory_nodes" :key="memoryIndex"
                :class="isActiveMemory(memoryIndex)">
            {{ memoryNode.memory }}
        </span>
     </div>
     <div v-if="instruction_nodes.length > 0 && !isError" class="holder instruction-holder">
        <span v-for="(bfToken, bfTokenIndex) in instruction_nodes" :id="bfToken.id" :key="bfTokenIndex" 
                        :class="isActiveInstruction(bfTokenIndex)" ref="instructions_span_refs" >
            {{ bfToken.token }}
        </span>
     </div>
     <label id="bfOutputLabel">{{ bfoutput }}</label>
     <textarea v-model="bfcode" id="txtBfCode"></textarea>
     <label id="lblError" v-if="isError" style="color:red;">{{ errorMessage }}</label>
     <div class="button-row">
        <input id="rangeSpeedSelect" type="range" min="1" max="100" v-model="autoplay_speed_precentage"/>  
     </div>
     <div class="button-row">
        <button id="btnLoad" @click="loadBfProgram">{{ t('bfLoadProgram') }}</button>
        <button id="btnStep" @click="stepThroughBf" :disabled="stepOverButtonDisabled">{{ t('bfStepOver') }}</button>
        <button id="btnAutoPlay" @click="autoPlayBf" :disabled="autoPlayButtonDisabled">{{ t('bfAutoPlay') }}</button>
        <button id="btnDownload" @click="downloadPortableFile" :disabled="stepOverButtonDisabled">{{ t('bfDownload') }}</button>
     </div>
  </div>
</template>

<style scoped>
 .row{
    display:flex; 
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
 }
 .row > button{
    max-width: 150px;
 }
 .row > textarea{
    width:400px;
    height: 200px;
 }
 .holder{
    display: flex;
    gap: 2px;
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
 }
.holder > span{
    min-width: 15px;
    min-height: 45px;    
    columns: black;
    display: flex;
    justify-content: center;
    align-items: center;
 }
 .button-row{
    display:flex;
    gap: 15px;
 }
 .inactive{
    background-color: grey;
 }
 .active{
    background-color: yellow;
 }
 #bfOutputLabel{
    color: white;
 }
</style>
