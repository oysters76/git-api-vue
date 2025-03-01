<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { saveAs } from 'file-saver';

    interface InstructionNode{
        token:string, 
        isActive:boolean
        id:string;
    }

    interface MemoryNode{
        memory:number, 
        isActive:boolean;
    }

    const BF_TOKENS = "><+-.,[]";
    const PROGRAM_SIZE = 1000;

    const bfcode = ref<string>("");
    const bfoutput = ref<string>("");
    const memory_nodes = ref<MemoryNode[]>([]); 
    const instruction_nodes = ref<InstructionNode[]>([]);
    const jump_map = ref<number[]>([]);
    const memory_pointer = ref<number>(-1);
    const instruction_pointer = ref<number>(-1);
    const instructions_span_refs = ref<HTMLSpanElement[]>([]);
    const autoplay_speed_precentage = ref<number>(50); 
    
    let programAutoPlayInterval: number | undefined = undefined;

    const autoPlayButtonDisabled = computed(()=>{
        return instruction_pointer.value !== 0;
    });

    const stepOverButtonDisabled = computed(()=>{
        return instruction_pointer.value === -1;
    });

    const autoplayTimeInterval = computed(()=>{
        return 2000 * autoplay_speed_precentage.value/100;
    })


    function filterBfCode(code:string):InstructionNode[]{
        return code.split("")
                    .filter(char => BF_TOKENS.includes(char))
                    .map((token, index)=>{
                        return {
                            token:token, 
                            isActive:false, 
                            id:`bf-instruction-span-${index}`
                        }
                    });
    }

    function getJumpMap(instructions:InstructionNode[]):number[]{
        let jumpMap:number[] = [];
        
        for (let i = 0; i < instructions.length; i++) 
            jumpMap.push(-1);

        let stack:number[] = [];
        for (let i = 0; i < instructions.length; i++){
            const instruction:string = instructions[i].token; 
            if (instruction === "["){
                stack.push(i); 
            }else if (instruction == "]"){
                const prevJump = stack.pop(); 
                if (!prevJump) continue; 
                jumpMap[prevJump] = i; 
                jumpMap[i] = prevJump;
            }
        }
        return jumpMap;
    }

    function resetProgramMemory(limit:number=PROGRAM_SIZE):MemoryNode[]{
        let memory:MemoryNode[] = []; 
        for (let i = 0; i < limit; i++) 
            memory[i] = {memory:0, isActive:false};
        return memory;
    }

    function loadProgram(){
        bfoutput.value = "";
        memory_pointer.value = 0;
        instruction_pointer.value = 0;
        instruction_nodes.value = filterBfCode(bfcode.value);
        jump_map.value = getJumpMap(instruction_nodes.value);
        memory_nodes.value = resetProgramMemory();
        
        if (programAutoPlayInterval)
            clearInterval(programAutoPlayInterval);
    }
    
    function lexer():InstructionNode{
        return instruction_nodes.value[instruction_pointer.value];
    }

    function stepOver():boolean{
        if (instruction_pointer.value >= instruction_nodes.value.length){
            return true;  
        }       
        const token = lexer().token; 
        if (token === ">"){
            memory_pointer.value += 1;
        }
        if (token === "<"){
            memory_pointer.value -= 1;
        }
        if (token === "+"){
            memory_nodes.value[memory_pointer.value].memory += 1;
        }
        if (token === "-"){
            memory_nodes.value[memory_pointer.value].memory -= 1;
        }
        if (token === "."){
            const memValue = memory_nodes.value[memory_pointer.value].memory; 
            bfoutput.value += String.fromCharCode(memValue);
        }
        if (token === ","){
            let userInput = prompt("Enter a character:"); 
            userInput = userInput && userInput?.length > 0 ? userInput[0] : "";
            memory_nodes.value[memory_pointer.value].memory = userInput.charCodeAt(0);
        }
        if (token === "["){
            const memValue = memory_nodes.value[memory_pointer.value].memory; 
            const shouldJump = memValue === 0; 
            if (shouldJump){
                instruction_pointer.value = jump_map.value[instruction_pointer.value];
            }
        }
        if (token === "]"){
            const memValue = memory_nodes.value[memory_pointer.value].memory; 
            const shouldJump = memValue !== 0; 
            if (shouldJump){
                instruction_pointer.value = jump_map.value[instruction_pointer.value];
            }
        }
        instruction_pointer.value += 1;
        return false;
    }

    function autoPlay(){
        programAutoPlayInterval = setInterval(()=>{
            const isDone = stepOver();
            if (isDone){
                clearInterval(programAutoPlayInterval);
            }
            requestAnimationFrame(()=>{
                const spanElement = instructions_span_refs.value.find(el=>{
                     return el.classList.contains("active")
                }); 
                if (spanElement){
                    spanElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                }
            })
        }, autoplayTimeInterval.value)
    }

    

    function isActiveInstruction(bfTokenIndex:number){
        return {
            "active": instruction_nodes.value[bfTokenIndex].isActive, 
            "inactive": !instruction_nodes.value[bfTokenIndex].isActive
        }
    }

    function isActiveMemory(memoryIndex:number){
        return {
            "active": memory_nodes.value[memoryIndex].isActive, 
            "inactive": !memory_nodes.value[memoryIndex].isActive
        }
    }

    function downloadPortableFile(){
        const blob = new Blob(['Hello, world!'], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'hello.txt');
    }

    watch(instruction_pointer, (newInstructionPointer)=>{
        if (instruction_nodes.value.length === 0) return;
        for (let i = 0; i < instruction_nodes.value.length; i++){
            const elem = instruction_nodes.value[i];
            elem.isActive = i === newInstructionPointer; 
        }
    })

    watch(memory_pointer, (newMemoryPointer)=>{
        if (instruction_nodes.value.length === 0) return;
        for (let i = 0; i < memory_nodes.value.length; i++){
            memory_nodes.value[i].isActive = i === newMemoryPointer; 
        }
    }); 

    
</script>

<template>
  <div class="row">
     <div v-if="memory_nodes.length > 0" class="holder memory-holder">
        <span v-for="(memoryNode, memoryIndex) in memory_nodes" :key="memoryIndex"
                :class="isActiveMemory(memoryIndex)">
            {{ memoryNode.memory }}
        </span>
     </div>
     <div v-if="instruction_nodes.length > 0" class="holder instruction-holder">
        <span v-for="(bfToken, bfTokenIndex) in instruction_nodes" :id="bfToken.id" :key="bfTokenIndex" 
                        :class="isActiveInstruction(bfTokenIndex)" ref="instructions_span_refs" >
            {{ bfToken.token }}
        </span>
     </div>
     <label id="bfOutputLabel">{{ bfoutput }}</label>
     <textarea v-model="bfcode" ></textarea>
     <div class="button-row">
        <input type="range" min="1" max="100" v-model="autoplay_speed_precentage"/>  
     </div>
     <div class="button-row">
        <button @click="loadProgram">Load Program</button>
        <button @click="stepOver" :disabled="stepOverButtonDisabled">Step Over</button>
        <button @click="autoPlay" :disabled="autoPlayButtonDisabled">Autoplay</button>
        <button @click="downloadPortableFile" :disabled="stepOverButtonDisabled">Download</button>
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
