export interface InstructionNode{
    token:string, 
    isActive:boolean
    id:string;
}

export interface MemoryNode{
    memory:number, 
    isActive:boolean;
}

export interface BFStepResult{
    isDone:boolean;
    mem_ptr?:number; 
    instr_ptr?:number;
    memory?:number[],
    bfOutput?:string,
}

export const BF_TOKENS = "><+-.,[]";
export const PROGRAM_SIZE = 1000;

