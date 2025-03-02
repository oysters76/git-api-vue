import { BF_TOKENS, PROGRAM_SIZE, type BFStepResult, type InstructionNode, 
    type MemoryNode } from "../types/bfInterpreterTypes";
    
import {obfuscate} from "javascript-obfuscator";

export function filterBfCode(code:string):InstructionNode[]{
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

export function isInvalidJumps(nodes:InstructionNode[]):boolean{
    let count = 0;
    for (let i = 0; i < nodes.length; i++){
        const {token} = nodes[i]; 
        if (token === "["){
            count += 1;
        }
        else if (token === "]"){
            count -= 1;
        }
    }
    return count != 0;
}

export function getJumpMap(instructions:InstructionNode[]):number[]{
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

export function  resetProgramMemory(limit:number=PROGRAM_SIZE):MemoryNode[]{
    let memory:MemoryNode[] = []; 
    for (let i = 0; i < limit; i++) 
        memory[i] = {memory:0, isActive:false};
    return memory;
}

function getNextToken(tokens:string[], instr_ptr:number):string|null{
    if (instr_ptr < 0 || instr_ptr >= tokens.length) return null;
    return tokens[instr_ptr];
}

export function dumpToJS(bfCode:string):Promise<string>{

    function arrayToString(arr:any[]):string{
        let buffer = "[";
        buffer += arr.join(",");
        buffer += "]";
        return buffer;
    }

    function bfToJS(bfCode:string, evalLimit=100000000):string{
        const instrNodes = filterBfCode(bfCode); 
        const jsTokens = instrNodes
                            .map(({token})=>{
                                return `\"${token}\"`;
                            });
        const tokens = instrNodes
                            .map(({token})=>{
                                return token;
        });
        const jmpMap = getJumpMap(instrNodes);
        let buffer = "(function(){";
        buffer += "const tokens=" + arrayToString(jsTokens) + ";";
        buffer += "const jmpMap=" + arrayToString(jmpMap) + ";"; 
        
        let result:BFStepResult = {
            mem_ptr:0, 
            instr_ptr:0, 
            isDone:false, 
            memory:resetProgramMemory().map(({memory})=>memory), 
            bfOutput:"",
        };
        let stepCounter = 0;                                 
        while (!result.isDone && (stepCounter < evalLimit)){
            const newResult = stepBf(jmpMap, result.memory!, tokens, result.mem_ptr!, 
            result.instr_ptr!, instrNodes.length, result.bfOutput!); 
            if (newResult.isDone)
                break;
            result = newResult;
            stepCounter += 1;  
        }
        
        if (stepCounter >= evalLimit)
            result.bfOutput = "err: eval limit reached!";

        buffer += `console.log(\`${result.bfOutput}\`)`; 
        buffer += "})();"; 

        console.log(buffer);
        return buffer;
    }

    return new Promise((resolve)=>{
        resolve(
            obfuscate(bfToJS(bfCode), {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                numbersToExpressions: true,
                simplify: true,
                stringArrayShuffle: true,
                splitStrings: true,
                stringArrayThreshold: 1
            }).getObfuscatedCode()
        );
    })
}

export function stepBf(jump_map:number[], memory:number[], tokens:string[], mem_ptr:number, 
                instr_ptr:number, instr_size:number,bfOutput:string):BFStepResult{
    if (instr_ptr >= instr_size){
        return {
            isDone:true
        }
    }       
    const token = getNextToken(tokens, instr_ptr);
    if (!token){
        return {
            isDone:true
        }
    }
    if (token === ">"){
        mem_ptr += 1;
    }
    if (token === "<"){
        mem_ptr -= 1;
    }
    if (token === "+"){
        memory[mem_ptr] += 1;
    }
    if (token === "-"){
        memory[mem_ptr] -= 1;
    }
    if (token === "."){
        const memValue = memory[mem_ptr];
        bfOutput += String.fromCharCode(memValue);
    }
    if (token === "["){
        const memValue = memory[mem_ptr];
        const shouldJump = memValue === 0; 
        if (shouldJump){
            instr_ptr = jump_map[instr_ptr];
        }
    }
    if (token === "]"){
        const memValue = memory[mem_ptr];
        const shouldJump = memValue !== 0; 
        if (shouldJump){
            instr_ptr = jump_map[instr_ptr];
        }
    }
    instr_ptr += 1;
    return {
        isDone:false, 
        mem_ptr:mem_ptr, 
        instr_ptr:instr_ptr, 
        memory:memory, 
        bfOutput:bfOutput
    }
}
