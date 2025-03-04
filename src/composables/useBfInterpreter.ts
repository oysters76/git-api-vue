import { computed, ref, watch } from "vue";
import type { InstructionNode, MemoryNode } from "../types/bfInterpreterTypes";
import { filterBfCode, getJumpMap, resetProgramMemory, stepBf, isInvalidJumps, dumpToJS } 
            from "../logic/bfInterpreterLogic";
import { saveAs } from 'file-saver';
import { useI18n } from "vue-i18n";

export function useBfInterpreter(){
    const {t} = useI18n();
    const bfcode = ref<string>("");
    const bfoutput = ref<string>("");
    const memory_nodes = ref<MemoryNode[]>([]); 
    const instruction_nodes = ref<InstructionNode[]>([]);
    const jump_map = ref<number[]>([]);
    const memory_pointer = ref<number>(-1);
    const instruction_pointer = ref<number>(-1);
    const instructions_span_refs = ref<HTMLSpanElement[]>([]);
    const autoplay_speed_precentage = ref<number>(50); 
    const errorKey = ref<string>(""); 

    const errorMessage = computed(()=>{
        if (errorKey.value == "") return ""; 
        return t(errorKey.value);
    })

    let programAutoPlayInterval: number | undefined = undefined;

    const isError = computed(()=>{
        return errorMessage.value !== "";
    });

    const autoPlayButtonDisabled = computed(()=>{
        return instruction_pointer.value !== 0;
    });

    const stepOverButtonDisabled = computed(()=>{
        return instruction_pointer.value === -1;
    });

    const autoplayTimeInterval = computed(()=>{
        return 2000 * autoplay_speed_precentage.value/100;
    })

    function resetErrorMessage(){
        errorKey.value = "";
    }

    function setErrorMessage(errKey:string){
        errorKey.value = errKey;
    }

    function loadBfProgram(){
        resetErrorMessage();
        bfoutput.value = "";
        memory_pointer.value = 0;
        instruction_pointer.value = 0;
        instruction_nodes.value = filterBfCode(bfcode.value);
        jump_map.value = getJumpMap(instruction_nodes.value);
        memory_nodes.value = resetProgramMemory();
        
        if (programAutoPlayInterval)
            clearInterval(programAutoPlayInterval);
        if (instruction_nodes.value.length == 0){
            setErrorMessage('bfErrorInvalidProgram');
        }else if (isInvalidJumps(instruction_nodes.value)){
            setErrorMessage('bfErrorInvalidJumps'); 
        }
    }

    function stepThroughBf():boolean{
        const result = stepBf(jump_map.value, memory_nodes.value.map(mem=>mem.memory), 
        instruction_nodes.value.map(instr=>instr.token), memory_pointer.value, 
                        instruction_pointer.value, instruction_nodes.value.length, 
                        bfoutput.value);   
        if (!result.isDone){
            instruction_pointer.value = result.instr_ptr!;
            memory_pointer.value = result.mem_ptr!; 
            bfoutput.value = result.bfOutput!;
            memory_nodes.value.map((mem, memIndex)=>{
                mem.memory = result.memory![memIndex];
                return mem;
            })
        }                   
        return result.isDone;
    }

    function autoPlayBf(){
        programAutoPlayInterval = setInterval(()=>{
            const isDone = stepThroughBf();
            if (isDone){
                clearInterval(programAutoPlayInterval);
            }
            requestAnimationFrame(()=>{
                const spanElement = instructions_span_refs.value.find(el=>{
                     return el.classList.contains("active")
                }); 
                if (spanElement){
                    spanElement.scrollIntoView(
                        {
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        }
                    );
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

    async function downloadPortableFile(){
        const data = await dumpToJS(bfcode.value); 
        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'bf_code.js');
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

    return {
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
    }

}